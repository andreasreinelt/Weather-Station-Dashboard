import React from 'react';
import ReactDOM from 'react-dom/client';

import './style.css';

import App from './router';

// npm run dev
// npx eslint .

// .jsx: Use this when the file contains JSX syntax (standard in React projects)
// .js: Use this for plain JavaScript

// got confused by create-react-app and error messages, now using vite

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);