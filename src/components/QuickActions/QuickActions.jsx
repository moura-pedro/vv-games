import React from 'react';
import { PlusCircle, Trophy } from 'lucide-react';
import './QuickActions.css';

const QuickActions = ({ setActiveTab }) => {
  const actions = [
    {
      id: 'add',
      title: 'Add Player',
      description: 'Join the game',
      icon: <PlusCircle size={24} />,
      gradient: 'from-green-400 to-green-500'
    },
    {
      id: 'record',
      title: 'Record Win',
      description: 'Log a victory',
      icon: <Trophy size={24} />,
      gradient: 'from-blue-400 to-blue-500'
    }
  ];

  return (
    <div className="quick-actions">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => setActiveTab(action.id)}
          className={`action-button bg-gradient-to-br ${action.gradient}`}
        >
          <div className="action-icon">{action.icon}</div>
          <div className="action-content">
            <div className="action-title">{action.title}</div>
            <div className="action-description">{action.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;