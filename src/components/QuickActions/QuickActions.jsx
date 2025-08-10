import React from 'react';
import { PlusCircle, Trophy } from 'lucide-react';
import './QuickActions.css';

const QuickActions = ({ setActiveTab }) => {
  const actions = [
    {
      id: 'add',
      title: 'Adicionar Jogador',
      description: 'Entrar no jogo',
      icon: <PlusCircle size={24} />,
gradient: 'from-sand-300 to-sand-400'
    },
    {
      id: 'record',
      title: 'Registrar Vitória',
      description: 'Pontuar um jogador',
      icon: <Trophy size={24} />,
gradient: 'from-primary-500 to-primary-400'
    }
  ];

  return (
    <div className="quick-actions">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => setActiveTab(action.id)}
          className={`action-button bg-gradient-to-br ${action.gradient} ${action.id === 'add' ? 'text-primary-900' : 'text-sand-50'}`}
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