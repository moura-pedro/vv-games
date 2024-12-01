import React, { useState } from 'react';
import { UserPlus, X, Save, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import './AddPlayerForm.css';

const AddPlayerForm = ({ 
  currentSession, 
  sessions, 
  setSessions, 
  currentSessionId 
}) => {
  const [newPlayer, setNewPlayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const addPlayer = async (e) => {
    e.preventDefault();
    const playerName = newPlayer.trim();

    if (!playerName) {
      setError('Please enter a player name');
      return;
    }

    if (currentSession.players.includes(playerName)) {
      setError('This player already exists in the session');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedSession = {
        ...currentSession,
        players: [...currentSession.players, playerName]
      };
      
      const updated = await api.updateSession(updatedSession);
      setSessions(sessions.map(s => s.id === currentSessionId ? updated : s));
      
      // Show success message
      setSuccessMessage(`${playerName} added successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setNewPlayer('');
    } catch (err) {
      setError('Failed to add player. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-player-form">
      <div className="form-header">
        <UserPlus size={24} className="form-icon" />
        <h2 className="form-title">Add New Player</h2>
      </div>

      {successMessage && (
        <div className="success-message">
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={addPlayer} className="form-content">
        <div className="form-group">
          <label htmlFor="playerName" className="form-label">
            Player Name
          </label>
          <div className="input-wrapper">
            <input
              id="playerName"
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Enter player name"
              className="form-input"
              disabled={isSubmitting}
              maxLength={30}
            />
            {newPlayer && (
              <button
                type="button"
                onClick={() => setNewPlayer('')}
                className="clear-button"
                aria-label="Clear input"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="current-players">
          <h3 className="current-players-title">
            Current Players ({currentSession.players.length})
          </h3>
          <div className="players-list">
            {currentSession.players.length > 0 ? (
              currentSession.players.map((player, index) => (
                <div key={index} className="player-tag">
                  {player}
                </div>
              ))
            ) : (
              <p className="no-players">No players added yet</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !newPlayer.trim()}
        >
          {isSubmitting ? (
            <span className="loading-text">Adding player...</span>
          ) : (
            <>
              <Save size={20} />
              Add Player
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddPlayerForm;