import React, { useMemo, useState } from 'react';
import { Trophy, Crown, Award, Medal, Star, TrendingUp, Percent, Trash2, AlertCircle, Hash } from 'lucide-react';
import { api } from '../../services/api';
import './PlayerRankings.css';

const PlayerRankings = ({ currentSession, sessions, setSessions, currentSessionId }) => {
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const playerStats = useMemo(() => {
    const totalGamesInSession = currentSession.games.length;
    const stats = currentSession.players.map(player => {
      const wins = currentSession.games.filter(game => 
        game.winner === player
      ).length;
      const winRate = totalGamesInSession > 0 ? (wins / totalGamesInSession) * 100 : 0;
      
      return {
        name: player,
        wins,
        totalGames: totalGamesInSession,
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
        <h2 className="header-title">Ranking de Jogadores</h2>
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
            <div className="stats-label">Jogadores</div>
          </div>
        </div>
        <div className="stats-card total-games">
          <div className="stats-icon">🎮</div>
          <div className="stats-info">
            <div className="stats-value">{currentSession.games.length}</div>
            <div className="stats-label">Partidas</div>
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
                    <span>{player.wins} vitórias</span>
                  </div>
                  <div className="stat-item">
                    <Percent size={14} />
                    <span>{player.winRate.toFixed(1)}%</span>
                  </div>
                  {/* <div className="stat-item">
                    <Hash size={14} />
                    <span>{player.totalGames} games</span>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-rankings">
          <p>Nenhum jogador adicionado ainda</p>
          <p className="empty-subtitle">Adicione jogadores para começar a acompanhar o ranking</p>
        </div>
      )}
    </div>
  );
};

export default PlayerRankings;