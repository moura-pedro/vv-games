import { Plus } from 'lucide-react';
import './Header.css';

const Header = ({ showNewSessionForm, setShowNewSessionForm }) => (
  <div className="header">
    <div className="header-content">
      <h1 className="header-title">VV Jogos</h1>
      <button
        onClick={() => setShowNewSessionForm(!showNewSessionForm)}
        className="header-button"
      >
        <Plus size={24} />
      </button>
    </div>
  </div>
);

export default Header;