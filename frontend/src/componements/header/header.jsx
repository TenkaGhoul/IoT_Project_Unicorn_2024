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
          <img src="https://cdn.discordapp.com/attachments/1024213058370945044/1235518697926299701/3524623.png?ex=6634a9f4&is=66335874&hm=d6355183ad79c763ea95a7057d6980a1336b7d279651fbeb4e44450abac696cf&" alt="Settings" />
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