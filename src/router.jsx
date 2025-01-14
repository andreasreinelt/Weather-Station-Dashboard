import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Callback from './Callback.jsx';
import Dashboard from './Dashboard.jsx';

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

  // router configuration
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard tokenData={tokenData} />,
    },
    {
      path: '/callback',
      element: <Callback onToken={data => setTokenData(data)} />,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;