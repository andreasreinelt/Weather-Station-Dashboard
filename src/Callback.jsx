import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { exchangeCodeForToken } from './netatmoService.js';

const Callback = ({ onToken }) => {
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const navigate = useNavigate();

  useEffect(() => {

    if (errorParam) {
      setError(`Login failed: ${error}`);
      return;
    }

    if (codeParam) {
      const fetchToken = async () => {
        try {
          const data = await exchangeCodeForToken(codeParam);
          // console.log('token response:', data);
          onToken(data);
          navigate('/'); // redirect to dashboard after got token
        } catch (err) {
          // console.log('Failed to exchange token:', err.message);
          setError('Failed to exchange token', err);
        }
      };

      fetchToken();
    }
  }, [codeParam, errorParam, onToken, navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Waiting for token...</div>;
};

Callback.propTypes = {
  onToken: PropTypes.func.isRequired,
};

export default Callback;