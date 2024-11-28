import { useState, useEffect } from 'react';
import { PlusCircle, Trophy, History, MoreVertical, Trash2, Users, Plus } from 'lucide-react';

const GameTracker = () => {
  const [sessions, setSessions] = useState(() => {
    const savedSessions = localStorage.getItem('vvSessions');
    return savedSessions ? JSON.parse(savedSessions) : [{
      id: 'default',
      name: 'Default Session',
      players: [],
      games: []
    }];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('vvCurrentSession');
    return saved || 'default';
  });

  const [newPlayer, setNewPlayer] = useState('');
  const [newGame, setNewGame] = useState('');
  const [winner, setWinner] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  
  // Get current session data
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  
  useEffect(() => {
    localStorage.setItem('vvSessions', JSON.stringify(sessions));
  }, [sessions]);
  
  useEffect(() => {
    localStorage.setItem('vvCurrentSession', currentSessionId);
  }, [currentSessionId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
        setConfirmingDelete(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const createNewSession = (e) => {
    e.preventDefault();
    if (newSessionName.trim()) {
      const newSession = {
        id: Date.now().toString(),
        name: newSessionName.trim(),
        players: [],
        games: []
      };
      setSessions([...sessions, newSession]);
      setCurrentSessionId(newSession.id);
      setNewSessionName('');
      setShowNewSessionForm(false);
    }
  };

  const deleteSession = (sessionId) => {
    if (sessions.length > 1) {
      const newSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(newSessions);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(newSessions[0].id);
      }
    }
  };
  
  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayer.trim() && !currentSession.players.includes(newPlayer.trim())) {
      const updatedSessions = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            players: [...session.players, newPlayer.trim()]
          };
        }
        return session;
      });
      setSessions(updatedSessions);
      setNewPlayer('');
    }
  };

  const removePlayer = (playerToRemove) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          players: session.players.filter(player => player !== playerToRemove),
          games: session.games.filter(game => game.winner !== playerToRemove)
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
    if (winner === playerToRemove) {
      setWinner('');
    }
    setOpenDropdown(null);
    setConfirmingDelete(null);
  };
  
  const recordGame = (e) => {
    e.preventDefault();
    if (newGame.trim() && winner) {
      const gameRecord = {
        game: newGame.trim(),
        winner,
        date: new Date().toLocaleDateString()
      };
      
      const updatedSessions = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            games: [gameRecord, ...session.games]
          };
        }
        return session;
      });
      
      setSessions(updatedSessions);
      setNewGame('');
      setWinner('');
    }
  };
  
  const getPlayerStats = (playerName) => {
    const wins = currentSession.games.filter(game => game.winner === playerName).length;
    return { wins };
  };

  const toggleDropdown = (e, player) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === player ? null : player);
    setConfirmingDelete(null);
  };

  const handleDeleteClick = (e, player) => {
    e.stopPropagation();
    setConfirmingDelete(player);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">VV Family Game Tracker</h1>
      
      {/* Session Selector */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Game Sessions</h2>
          <button
            onClick={() => setShowNewSessionForm(!showNewSessionForm)}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
          >
            <Plus size={20} />
            New Session
          </button>
        </div>
        
        {showNewSessionForm && (
          <form onSubmit={createNewSession} className="mb-4 flex gap-2">
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Enter session name"
              className="flex-1 p-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
              <PlusCircle size={20} />
              Create
            </button>
          </form>
        )}
        
        <div className="flex gap-2 flex-wrap">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                currentSessionId === session.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Users size={16} />
              {session.name}
              {sessions.length > 1 && currentSessionId === session.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="ml-2 text-white hover:text-red-200"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Add Player Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Player to {currentSession.name}</h2>
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
            {currentSession.players.map(player => (
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
        <h2 className="text-xl font-semibold mb-4">Player Rankings - {currentSession.name}</h2>
        <div className="space-y-2">
          {currentSession.players
            .sort((a, b) => getPlayerStats(b).wins - getPlayerStats(a).wins)
            .map(player => {
              const { wins } = getPlayerStats(player);
              return (
                <div key={player} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{player}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{wins} wins</span>
                    <div className="dropdown-container relative">
                      <button
                        onClick={(e) => toggleDropdown(e, player)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === player && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          {confirmingDelete === player ? (
                            <div className="p-3 space-y-2">
                              <p className="text-sm text-gray-600">Remove this player?</p>
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmingDelete(null);
                                  }}
                                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePlayer(player);
                                  }}
                                  className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded flex items-center gap-1"
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleDeleteClick(e, player)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Remove Player
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      
      {/* Game History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Game History - {currentSession.name}</h2>
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
            {currentSession.games.map((game, index) => (
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