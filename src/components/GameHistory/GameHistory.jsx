import React, { useState } from 'react';
import { Trophy, Calendar, Search, X, Filter, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import './GameHistory.css';

const GameHistory = ({ games, currentSessionId, sessions, setSessions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, game, player
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [deleteModalPosition, setDeleteModalPosition] = useState({ x: 0, y: 0 });

  const filteredGames = games.filter(game => {
    const matchesSearch = searchTerm === '' || 
      game.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.winner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'game' && searchTerm === '') ||
      (filterType === 'player' && searchTerm === '');

    return matchesSearch && matchesFilter;
  });

  // Get unique games and players for filter suggestions
  const uniqueGames = [...new Set(games.map(game => game.game))];
  const uniquePlayers = [...new Set(games.map(game => game.winner))];

  const clearSearch = () => {
    setSearchTerm('');
    setFilterType('all');
  };

  const groupGamesByDate = () => {
    const grouped = {};
    filteredGames.forEach(game => {
      if (!grouped[game.date]) {
        grouped[game.date] = [];
      }
      grouped[game.date].push(game);
    });
    return grouped;
  };

  const groupedGames = groupGamesByDate();

  const handleDeleteClick = (game, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate Y position, ensuring modal stays in viewport
    let yPos = rect.top + window.scrollY;
    
    // Adjust if too close to bottom of viewport
    if (rect.top > viewportHeight - 300) {
      yPos = rect.top - 100;
    }
    
    setDeleteModalPosition({
      x: 50, // Using 50% with transform in CSS
      y: yPos
    });
    setGameToDelete(game);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || !gameToDelete) return;

    try {
      setIsDeleting(true);
      const updatedSession = await api.deleteGame(currentSessionId, games.indexOf(gameToDelete));
      setSessions(sessions.map(s => s.id === currentSessionId ? updatedSession : s));
      setGameToDelete(null);
    } catch (err) {
      setError('Failed to delete game');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setGameToDelete(null);
  };

  return (
    <div className="game-history">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="history-header">
        <div className="header-title">
          <Trophy size={24} className="header-icon" />
          <h2 className="title-text">Game History</h2>
        </div>
        
        <div className="search-container">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search games or winners..."
              className="search-input"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-dropdown">
            <Filter size={18} className="filter-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="game">By Game</option>
              <option value="player">By Player</option>
            </select>
          </div>
        </div>

        {filterType !== 'all' && (
          <div className="filter-suggestions">
            {filterType === 'game' && uniqueGames.map(game => (
              <button
                key={game}
                onClick={() => setSearchTerm(game)}
                className="suggestion-chip"
              >
                {game}
              </button>
            ))}
            {filterType === 'player' && uniquePlayers.map(player => (
              <button
                key={player}
                onClick={() => setSearchTerm(player)}
                className="suggestion-chip"
              >
                {player}
              </button>
            ))}
          </div>
        )}
      </div>

      {gameToDelete && (
        <div className="delete-confirmation-overlay">
          <div 
            className="delete-confirmation-modal"
            style={{
              left: `${deleteModalPosition.x}%`,
              top: `${deleteModalPosition.y}px`
            }}
          >
            <AlertCircle className="text-red-400 mb-2" size={24} />
            <h3 className="confirmation-title">Delete Game?</h3>
            <p className="confirmation-text">
              Are you sure you want to delete this game record?
              <br />
              <span className="game-details">
                {gameToDelete.game} - Winner: {gameToDelete.winner}
              </span>
            </p>
            <div className="confirmation-buttons">
              <button
                onClick={handleCancelDelete}
                className="cancel-button"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="confirm-button"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {Object.keys(groupedGames).length > 0 ? (
        <div className="history-content">
          {Object.entries(groupedGames).map(([date, dateGames]) => (
            <div key={date} className="date-group">
              <div className="date-header">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="games-list">
                {dateGames.map((game, index) => (
                  <div key={index} className="game-card">
                    <div className="game-content">
                      <div className="game-main-info">
                        <div className="game-info">
                          <span className="game-name">{game.game}</span>
                          <div className="winner-info">
                            <Trophy size={18} className="winner-icon" />
                            <span className="winner-name">{game.winner}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteClick(game, e)}
                          className="delete-game-button"
                          disabled={isDeleting}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="game-date">
                        <Calendar size={14} className="inline mr-2 text-white/40" />
                        {game.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {games.length === 0 ? (
            <p>No games recorded yet</p>
          ) : (
            <p>No matches found for your search</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHistory;