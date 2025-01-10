import React, { useEffect, useState } from 'react';
import { exchangeCodeForToken } from './netatmoService';

const Callback = ({ onToken }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setError(`Login failed: ${error}`);
      return;
    }

    if (code) {
      const fetchToken = async () => {
        try {
          const data = await exchangeCodeForToken(code);
          console.log('token response:', data);
          onToken(data);
          window.location.href = '/dashboard'; // redirect to dashboard after got token
        } catch (err) {
          console.log('Failed to exchange token:', err.message);
          setError('Failed to exchange token');
        }
      };

      fetchToken();
    }
  }, [onToken]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Waiting for token...</div>;
};

export default Callback;