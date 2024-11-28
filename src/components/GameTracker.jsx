import { useState, useEffect } from 'react';
import { PlusCircle, Trophy, History } from 'lucide-react';

const GameTracker = () => {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('vvPlayers');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  
  const [games, setGames] = useState(() => {
    const savedGames = localStorage.getItem('vvGames');
    return savedGames ? JSON.parse(savedGames) : [];
  });
  
  const [newPlayer, setNewPlayer] = useState('');
  const [newGame, setNewGame] = useState('');
  const [winner, setWinner] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('vvPlayers', JSON.stringify(players));
  }, [players]);
  
  useEffect(() => {
    localStorage.setItem('vvGames', JSON.stringify(games));
  }, [games]);
  
  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };
  
  const recordGame = (e) => {
    e.preventDefault();
    if (newGame.trim() && winner) {
      const gameRecord = {
        game: newGame.trim(),
        winner,
        date: new Date().toLocaleDateString()
      };
      setGames([gameRecord, ...games]);
      setNewGame('');
      setWinner('');
    }
  };
  
  const getPlayerStats = (playerName) => {
    const wins = games.filter(game => game.winner === playerName).length;
    return { wins };
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">VV Family Game Tracker</h1>
      
      {/* Add Player Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
        <form onSubmit={addPlayer} className="flex gap-2">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
            <PlusCircle size={20} />
            Add
          </button>
        </form>
      </div>
      
      {/* Record Game Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Record Game Result</h2>
        <form onSubmit={recordGame} className="space-y-4">
          <input
            type="text"
            value={newGame}
            onChange={(e) => setNewGame(e.target.value)}
            placeholder="Enter game name"
            className="w-full p-2 border rounded"
          />
          <select
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select winner</option>
            {players.map(player => (
              <option key={player} value={player}>{player}</option>
            ))}
          </select>
          <button 
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
          >
            <Trophy size={20} />
            Record Win
          </button>
        </form>
      </div>
      
      {/* Player Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Player Rankings</h2>
        <div className="space-y-2">
          {players
            .sort((a, b) => getPlayerStats(b).wins - getPlayerStats(a).wins)
            .map(player => {
              const { wins } = getPlayerStats(player);
              return (
                <div key={player} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{player}</span>
                  <span className="font-semibold">{wins} wins</span>
                </div>
              );
            })}
        </div>
      </div>
      
      {/* Game History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Game History</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-500 flex items-center gap-2"
          >
            <History size={20} />
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>
        {showHistory && (
          <div className="space-y-2">
            {games.map((game, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded flex justify-between">
                <div>
                  <span className="font-semibold">{game.game}</span>
                  <span className="text-gray-500 ml-2">- Winner: {game.winner}</span>
                </div>
                <span className="text-gray-500">{game.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameTracker;