import React from 'react';
import { CLIENT_ID, } from './config.js';

const LoginButton = () => {
  const tokenData = localStorage.getItem('tokenData');

  if (tokenData) {
    // redirect to dashboard if already logged in
    window.location.href = '/dashboard';
    return null;
  }

  const AUTH_URL = `https://api.netatmo.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    `${window.location.origin}/callback`
  )}&scope=read_station&state=12345`;

  return (
    <a href={AUTH_URL}>
      <button>Login with Netatmo</button>
    </a>
  );
};

export default LoginButton;