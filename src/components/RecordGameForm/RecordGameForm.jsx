import React, { useState } from 'react';
import { Trophy, Save, X } from 'lucide-react';
import { api } from '../../services/api';
import './RecordGameForm.css';

const RecordGameForm = ({ 
  currentSession, 
  sessions, 
  setSessions, 
  currentSessionId 
}) => {
  const [newGame, setNewGame] = useState('');
  const [winners, setWinners] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const recordGame = async (e) => {
    e.preventDefault();
    if (!newGame.trim() || winners.length === 0) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const date = new Date().toLocaleDateString();
      
      // Create a separate game record for each winner
      const gameRecords = winners.map(winner => ({
        game: newGame.trim(),
        winner,
        date
      }));
      
      const updatedSession = {
        ...currentSession,
        games: [...gameRecords, ...currentSession.games]
      };
      
      const updated = await api.updateSession(updatedSession);
      setSessions(sessions.map(s => s.id === currentSessionId ? updated : s));
      
      // Show success message
      setSuccessMessage('Partida registrada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setNewGame('');
      setWinners([]);
    } catch (err) {
      setError('Falha ao registrar a partida. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="record-game-form">
      <div className="form-header">
        <Trophy size={24} className="form-icon" />
        <h2 className="form-title">Registrar Resultado da Partida</h2>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={recordGame} className="form-content">
        <div className="form-group">
          <label htmlFor="gameName" className="form-label">
            Nome do Jogo
          </label>
          <div className="input-wrapper">
            <input
              id="gameName"
              type="text"
              value={newGame}
              onChange={(e) => setNewGame(e.target.value)}
              placeholder="Digite o nome do jogo"
              className="form-input"
              disabled={isSubmitting}
            />
            {newGame && (
              <button
                type="button"
                onClick={() => setNewGame('')}
                className="clear-button"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Vencedores
          </label>
          <div className="checkbox-group">
            {currentSession.players.map(player => {
              const checked = winners.includes(player);
              return (
                <label key={player} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setWinners(prev => (
                        prev.includes(player)
                          ? prev.filter(p => p !== player)
                          : [...prev, player]
                      ));
                    }}
                    disabled={isSubmitting}
                  />
                  <span>{player}</span>
                </label>
              );
            })}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !newGame.trim() || winners.length === 0}
        >
          {isSubmitting ? (
            <span className="loading-text">Gravando...</span>
          ) : (
            <>
              <Save size={20} />
              Registrar Partida
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RecordGameForm;