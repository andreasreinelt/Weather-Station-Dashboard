import React, { useState, useEffect } from 'react';

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
      
      return <Callback onToken={(data) => setTokenData(data)} />;
    }

    return <Dashboard tokenData={tokenData} />;

  };

  return <div>{renderContent()}</div>;
}

export default App;