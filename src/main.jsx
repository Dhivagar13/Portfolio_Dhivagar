import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import './style.css';
import './script.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);