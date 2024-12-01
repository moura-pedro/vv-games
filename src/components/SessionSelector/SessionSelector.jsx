// src/components/GameTracker/SessionSelector/SessionSelector.jsx
import React, { useState } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import './SessionSelector.css';

const SessionSelector = ({ 
  sessions, 
  currentSessionId, 
  setCurrentSessionId, 
  setSessions, 
  showNewSessionForm,
  setShowNewSessionForm 
}) => {
  const [newSessionName, setNewSessionName] = useState('');
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const createNewSession = async (e) => {
    e.preventDefault();
    if (newSessionName.trim()) {
      try {
        const newSession = {
          id: Date.now().toString(),
          name: newSessionName.trim(),
          players: [],
          games: []
        };
        const created = await api.createSession(newSession);
        setSessions([...sessions, created]);
        setCurrentSessionId(created.id);
        setNewSessionName('');
        setShowNewSessionForm(false);
        setError(null);
      } catch (err) {
        setError('Failed to create session');
      }
    }
  };

  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (deleteConfirmId === sessionId) {
      if (sessions.length > 1) {
        try {
          setIsDeleting(true);
          await api.deleteSession(sessionId);
          const newSessions = sessions.filter(s => s.id !== sessionId);
          setSessions(newSessions);
          if (currentSessionId === sessionId) {
            setCurrentSessionId(newSessions[0].id);
          }
          setError(null);
        } catch (err) {
          setError('Failed to delete session');
        } finally {
          setIsDeleting(false);
        }
      }
    } else {
      setDeleteConfirmId(sessionId);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Click outside handler to reset delete confirmation
  React.useEffect(() => {
    const handleClickOutside = () => setDeleteConfirmId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="session-selector">
      <div className="session-list">
        {sessions.map(session => (
          <button
            key={session.id}
            onClick={() => setCurrentSessionId(session.id)}
            className={`session-button ${
              currentSessionId === session.id ? 'active' : ''
            }`}
          >
            <Users size={16} />
            <span>{session.name}</span>
            {sessions.length > 1 && (
              <button
                onClick={(e) => deleteSession(e, session.id)}
                className={`delete-button ${
                  deleteConfirmId === session.id ? 'confirming' : ''
                }`}
                disabled={isDeleting}
              >
                <Trash2 size={14} />
                {deleteConfirmId === session.id && (
                  <span className="delete-confirm">Click to confirm</span>
                )}
              </button>
            )}
          </button>
        ))}
      </div>

      {showNewSessionForm && (
        <form onSubmit={createNewSession} className="new-session-form">
          <div className="form-content">
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="New session name"
              className="session-input"
              maxLength={30}
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={!newSessionName.trim()}
            >
              <Plus size={24} />
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default SessionSelector;