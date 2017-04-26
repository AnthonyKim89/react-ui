import React from 'react';

import './LoadingIndicator.css';

const LoadingIndicator = () =>
  <div className="app-loading">
  <div className="app-loading-grid">
    <div className="app-loading-inner">
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    </div>
    </div>
  </div>;

export default LoadingIndicator;
