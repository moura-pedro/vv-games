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
  const [winner, setWinner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const recordGame = async (e) => {
    e.preventDefault();
    if (!newGame.trim() || !winner) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const gameRecord = {
        game: newGame.trim(),
        winner,
        date: new Date().toLocaleDateString()
      };
      
      const updatedSession = {
        ...currentSession,
        games: [gameRecord, ...currentSession.games]
      };
      
      const updated = await api.updateSession(updatedSession);
      setSessions(sessions.map(s => s.id === currentSessionId ? updated : s));
      
      // Show success message
      setSuccessMessage('Partida registrada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setNewGame('');
      setWinner('');
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
          <label htmlFor="winner" className="form-label">
            Vencedor
          </label>
          <select
            id="winner"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            className="form-select"
            disabled={isSubmitting}
          >
            <option value="">Selecione o vencedor</option>
            {currentSession.players.map(player => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !newGame.trim() || !winner}
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