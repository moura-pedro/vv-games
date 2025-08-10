import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../../services/api';
import Header from '../Header/Header';
import SessionSelector from '../SessionSelector/SessionSelector';
import QuickActions from '../QuickActions/QuickActions';
import TabNav from '../TabNav/TabNav';
import AddPlayerForm from '../AddPlayerForm/AddPlayerForm';
import RecordGameForm from '../RecordGameForm/RecordGameForm';
import PlayerRankings from '../PlayerRankings/PlayerRankings';
import GameHistory from '../GameHistory/GameHistory';
import './GameTracker.css';

const GameTracker = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState('default');
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('rankings');

  const getLatestSessionId = (list) => {
    if (!list || list.length === 0) return undefined;
    const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted[0]?.id;
  };

  // Get current session data
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);

        // Fast path: latest 3 sessions first for immediate render
        const latest = await api.fetchSessions({ limit: 3, sort: '-createdAt' });

        if (latest.length === 0) {
          const defaultSession = {
            id: 'default',
            name: 'Default Session',
            players: [],
            games: []
          };
          await api.createSession(defaultSession);
          setSessions([defaultSession]);
          setCurrentSessionId('default');
        } else {
          setSessions(latest);
          setCurrentSessionId(getLatestSessionId(latest));
        }

        // Background: fetch all sessions (won't block initial render)
        api.fetchSessions({ sort: '-createdAt' })
          .then((all) => {
            setSessions(all);
            // Always keep selection on the most recently created session
            const latestId = getLatestSessionId(all);
            if (latestId) setCurrentSessionId(latestId);
          })
          .catch(() => { /* ignore background errors to not disrupt UX */ });

      } catch (err) {
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Ensure selection always points to the most recently created session when list changes
  useEffect(() => {
    if (sessions.length === 0) return;
    const latestId = getLatestSessionId(sessions);
    if (latestId && currentSessionId !== latestId) {
      setCurrentSessionId(latestId);
    }
  }, [sessions]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-container">
          {error}
          <button onClick={() => setError(null)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-tracker">
      <Header 
        showNewSessionForm={showNewSessionForm}
        setShowNewSessionForm={setShowNewSessionForm}
      />

      <SessionSelector
        sessions={sessions}
        currentSessionId={currentSessionId}
        setCurrentSessionId={setCurrentSessionId}
        setSessions={setSessions}
        showNewSessionForm={showNewSessionForm}
      />

      <div className="main-content">
        <QuickActions setActiveTab={setActiveTab} />
        
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'add' && (
          <AddPlayerForm 
            currentSession={currentSession}
            sessions={sessions}
            setSessions={setSessions}
            currentSessionId={currentSessionId}
          />
        )}

        {activeTab === 'record' && (
          <RecordGameForm
            currentSession={currentSession}
            sessions={sessions}
            setSessions={setSessions}
            currentSessionId={currentSessionId}
          />
        )}

        {activeTab === 'rankings' && (
          <PlayerRankings currentSession={currentSession} />
        )}

        {activeTab === 'history' && (
          <GameHistory 
            games={currentSession.games} 
            currentSessionId={currentSessionId}
            sessions={sessions}
            setSessions={setSessions}
          />
        )}
      </div>
    </div>
  );
};

export default GameTracker;