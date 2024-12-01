import React, { useMemo, useState } from 'react';
import { Trophy, Crown, Award, Medal, Star, TrendingUp, Percent, Trash2, AlertCircle, Hash } from 'lucide-react';
import { api } from '../../services/api';
import './PlayerRankings.css';

const PlayerRankings = ({ currentSession, sessions, setSessions, currentSessionId }) => {
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const playerStats = useMemo(() => {
    const stats = currentSession.players.map(player => {
      const totalGames = currentSession.games.filter(game => 
        game.game.includes(player) || game.winner === player
      ).length;
      const wins = currentSession.games.filter(game => 
        game.winner === player
      ).length;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      
      return {
        name: player,
        wins,
        totalGames,
        winRate,
      };
    }).sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);

    return stats.map((player, index) => ({
      ...player,
      rank: index + 1,
      medal: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
    }));
  }, [currentSession]);

  const getMedalIcon = (medal, size = 24) => {
    switch (medal) {
      case 'gold':
        return <Crown size={size} className="text-yellow-400" />;
      case 'silver':
        return <Award size={size} className="text-gray-300" />;
      case 'bronze':
        return <Medal size={size} className="text-yellow-700" />;
      default:
        return <Star size={size} className="text-white/40" />;
    }
  };

  return (
    <div className="player-rankings">
      <div className="rankings-header">
        <Trophy size={24} className="header-icon" />
        <h2 className="header-title">Player Rankings</h2>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="stats-grid">
        <div className="stats-card total-players">
          <div className="stats-icon">👥</div>
          <div className="stats-info">
            <div className="stats-value">{currentSession.players.length}</div>
            <div className="stats-label">Players</div>
          </div>
        </div>
        <div className="stats-card total-games">
          <div className="stats-icon">🎮</div>
          <div className="stats-info">
            <div className="stats-value">{currentSession.games.length}</div>
            <div className="stats-label">Games</div>
          </div>
        </div>
      </div>

      {playerStats.length > 0 ? (
        <div className="rankings-list">
          {playerStats.map((player) => (
            <div key={player.name} className="player-card">
              <div className="rank-section">
                <div className="rank-number">{player.rank}</div>
                <div className="medal-icon">
                  {getMedalIcon(player.medal)}
                </div>
              </div>

              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-stats">
                  <div className="stat-item">
                    <Trophy size={14} />
                    <span>{player.wins} wins</span>
                  </div>
                  <div className="stat-item">
                    <Percent size={14} />
                    <span>{player.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="stat-item">
                    <Hash size={14} />
                    <span>{player.totalGames} games</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-rankings">
          <p>No players added yet</p>
          <p className="empty-subtitle">Add players to start tracking rankings</p>
        </div>
      )}
    </div>
  );
};

export default PlayerRankings;