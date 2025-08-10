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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameSuggestions, setGameSuggestions] = useState([]);

  // Get unique game names from all sessions
  const getAllUniqueGames = () => {
    const allGames = sessions.flatMap(session => 
      session.games?.map(game => game.game) || []
    );
    return [...new Set(allGames)].sort();
  };

  // Filter games based on input and generate suggestions
  const generateGameSuggestions = (input) => {
    if (!input.trim()) {
      setGameSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const uniqueGames = getAllUniqueGames();
    const filtered = uniqueGames.filter(game => 
      game.toLowerCase().includes(input.toLowerCase())
    );
    
    setGameSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
    setShowSuggestions(filtered.length > 0);
  };

  // Handle game input change
  const handleGameInputChange = (e) => {
    const value = e.target.value;
    setNewGame(value);
    generateGameSuggestions(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (gameName) => {
    setNewGame(gameName);
    setShowSuggestions(false);
    setGameSuggestions([]);
  };

  // Handle input blur (with delay to allow click on suggestions)
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

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
              onChange={handleGameInputChange}
              onBlur={handleInputBlur}
              onFocus={() => generateGameSuggestions(newGame)}
              placeholder="Digite o nome do jogo"
              className="form-input"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {newGame && (
              <button
                type="button"
                onClick={() => {
                  setNewGame('');
                  setShowSuggestions(false);
                  setGameSuggestions([]);
                }}
                className="clear-button"
              >
                <X size={16} />
              </button>
            )}
            {showSuggestions && gameSuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {gameSuggestions.map((game, index) => (
                  <button
                    key={index}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionSelect(game)}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur
                  >
                    {game}
                  </button>
                ))}
              </div>
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