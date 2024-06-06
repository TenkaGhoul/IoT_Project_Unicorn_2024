import React from 'react';
import { Link } from 'react-router-dom';

import './notFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <h1 className="not-found-title">404 Not Found</h1>
        <p className="not-found-text">The page you are looking for does not exist.</p>
        <Link to="/" className="not-found-link">
          <button className="not-found-button">Go Home</button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;