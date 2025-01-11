import React, { useState, useEffect } from 'react';

import LoginButton from './Login';
import Callback from './Callback';
import Dashboard from './Dashboard';

function App() {
  const [tokenData, setTokenData] = useState(() => {
    // load token from localStorage on app start
    const savedToken = localStorage.getItem('tokenData');
    return savedToken ? JSON.parse(savedToken) : null;
  });

  useEffect(() => {
    // save token to localStorage when it changes
    if (tokenData) {
      localStorage.setItem('tokenData', JSON.stringify(tokenData));
    }
  }, [tokenData]);

  const renderContent = () => {
    const path = window.location.pathname;

    if (path === '/callback') {
      // if logged in, redirect to dashboard
      if (tokenData) {
        window.location.href = '/dashboard';
        return null;
      }
      return <Callback onToken={(data) => setTokenData(data)} />;
    }

    if (path === '/dashboard') {
      if (!tokenData) {
        // if not logged in, redirect to root
        window.location.href = '/';
        return null;
      }
      return <Dashboard tokenData={tokenData} />;
    }

    // default route to root
    if (tokenData) {
      window.location.href = '/dashboard'; // redirect to dashboard if logged in
      return null;
    }

    return <LoginButton />;
  };

  return <div>{renderContent()}</div>;
}

export default App;