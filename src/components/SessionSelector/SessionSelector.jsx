// src/components/GameTracker/SessionSelector/SessionSelector.jsx
import React, { useRef, useState } from 'react';
import { Users, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
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
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleRetry = async () => {
    setIsRetrying(true);
    setError(null);
    try {
      const fetchedSessions = await api.fetchSessions({ sort: '-createdAt' });
      setSessions(fetchedSessions);
    } catch (err) {
      setError('Failed to load sessions. Click to retry.');
    } finally {
      setIsRetrying(false);
    }
  };

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

  // Click outside handler to reset delete confirmation and close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDeleteConfirmId(null);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="session-selector" ref={dropdownRef}>
      {error ? (
        <button 
          onClick={handleRetry} 
          className="error-message" 
          disabled={isRetrying}
        >
          {error}
          {isRetrying && ' ...'}
        </button>
      ) : (
        <>
          <div className="dropdown">
            <button
              type="button"
              className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <div className="trigger-content">
                <Users size={18} />
                <span className="trigger-label">
                  {sessions.find(s => s.id === currentSessionId)?.name || 'Select session'}
                </span>
              </div>
              <ChevronDown className={`trigger-caret ${isOpen ? 'rotated' : ''}`} size={18} />
            </button>

            {isOpen && (
              <div className="dropdown-menu" role="listbox">
                {[...sessions]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((session) => (
                    <div key={session.id} className="dropdown-item-wrapper">
                      <button
                        type="button"
                        role="option"
                        aria-selected={currentSessionId === session.id}
                        className={`dropdown-item ${currentSessionId === session.id ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentSessionId(session.id);
                          setIsOpen(false);
                        }}
                      >
                        <div className="item-left">
                          <Users size={16} />
                          <span className="item-label">{session.name}</span>
                        </div>
                        {currentSessionId === session.id ? (
                          <Check size={16} className="item-check" />
                        ) : null}
                      </button>
                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => deleteSession(e, session.id)}
                          className={`delete-button ${deleteConfirmId === session.id ? 'confirming' : ''}`}
                          disabled={isDeleting}
                          title={deleteConfirmId === session.id ? 'Click to confirm' : 'Delete session'}
                        >
                          <Trash2 size={14} />
                          {deleteConfirmId === session.id && (
                            <span className="delete-confirm">Click to confirm</span>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            )}
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
        </>
      )}
    </div>
  );
};

export default SessionSelector;