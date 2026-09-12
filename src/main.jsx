/**
 * Application Entry Point - Mounts the root React application into the DOM tree.
 * Communicates with: React DOM, src/App.jsx, and src/index.css.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
