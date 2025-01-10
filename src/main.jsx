import React from 'react';
import ReactDOM from 'react-dom/client';

import './style.css';

import App from './App';

// npm run dev

// .jsx: Verwenden, wenn JSX-Syntax enthalten ist (Standard in React-Projekten).
// .js: Verwenden für reines JavaScript

// got confused by create-react-app and error messages, now using vite

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);