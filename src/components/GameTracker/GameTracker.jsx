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

  const LOCAL_STORAGE_KEY = 'vv_currentSessionId';

  const getLatestSessionId = (list) => {
    if (!list || list.length === 0) return undefined;
    const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted[0]?.id;
  };

  const handleSetCurrentSessionId = (nextId) => {
    setCurrentSessionId(nextId);
    try {
      if (nextId) {
        localStorage.setItem(LOCAL_STORAGE_KEY, nextId);
      }
    } catch (_) {
      // ignore storage errors (e.g., private mode)
    }
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
          handleSetCurrentSessionId('default');
        } else {
          setSessions(latest);
          // Prefer previously selected session if available
          const storedId = (() => { try { return localStorage.getItem(LOCAL_STORAGE_KEY); } catch { return null; } })();
          if (storedId) {
            handleSetCurrentSessionId(storedId);
          } else {
            handleSetCurrentSessionId(getLatestSessionId(latest));
          }
        }

        // Background: fetch all sessions (won't block initial render)
        api.fetchSessions({ sort: '-createdAt' })
          .then((all) => {
            setSessions(all);
            // Keep current selection unless it's missing; then fallback
            const storedId = (() => { try { return localStorage.getItem(LOCAL_STORAGE_KEY); } catch { return null; } })();
            const currentExists = all.some(s => s.id === currentSessionId);
            if (!currentExists) {
              const fallbackId = (storedId && all.some(s => s.id === storedId))
                ? storedId
                : getLatestSessionId(all);
              if (fallbackId) handleSetCurrentSessionId(fallbackId);
            }
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