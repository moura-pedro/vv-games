import React, { useState } from 'react';
import { Trophy, Calendar, Search, X, Filter } from 'lucide-react';
import './GameHistory.css';

const GameHistory = ({ games }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, game, player

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

  return (
    <div className="game-history">
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
                    <div className="game-info">
                      <span className="game-name">{game.game}</span>
                      <div className="winner-info">
                        <Trophy size={16} className="winner-icon" />
                        <span className="winner-name">{game.winner}</span>
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