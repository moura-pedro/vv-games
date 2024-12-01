import React from 'react';
import { Trophy, History, Users, Plus } from 'lucide-react';
import './TabNav.css';

const TabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'rankings',
      label: 'Rankings',
      icon: <Trophy size={20} />
    },
    {
      id: 'history',
      label: 'History',
      icon: <History size={20} />
    },
    {
      id: 'add',
      label: 'Add Player',
      icon: <Plus size={20} />
    },
    {
      id: 'record',
      label: 'Record',
      icon: <Users size={20} />
    }
  ];

  return (
    <nav className="tab-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
        >
          <div className="tab-icon">{tab.icon}</div>
          <span className="tab-label">{tab.label}</span>
          {activeTab === tab.id && <div className="tab-indicator" />}
        </button>
      ))}
    </nav>
  );
};

export default TabNav;