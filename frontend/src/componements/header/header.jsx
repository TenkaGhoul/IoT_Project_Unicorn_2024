import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './header.css';

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <header className="header">
      <h1 className="header-title">SmartShade</h1>
      <div className="header-settings">
        <button onClick={toggleSettings} className="header-settings-button">
          <img src="" alt="Settings" />
        </button>
        {showSettings && (
          <nav className="header-nav">
            <Link to="/" className="header-link">Home</Link>
            <Link to="/settings" className="header-link">User Settings</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;