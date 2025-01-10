import React, { useEffect, useState } from 'react';
import { getTemperature, refreshAccessTokenIfNeeded } from './netatmoService.js';

const WeatherDashboard = ({ tokenData }) => {
  const [temperature, setTemperature] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchTemperature = async () => {
      try {
        // ensure token is valid and refresh if needed
        const validTokenData = await refreshAccessTokenIfNeeded(tokenData);
        const temp = await getTemperature(validTokenData.access_token);
        setTemperature(temp);
        setLastUpdated(new Date()); // update the last updated time
      } catch (err) {
        console.log('Error fetching temperature:', err.message);
        setError('Error fetching temperature');
      }
    };

    if (tokenData) {
      fetchTemperature(); // fetch temperature initially
      intervalId = setInterval(fetchTemperature, 10 * 60 * 1000); // update site and temperature every 10 minutes
    }

    return () => clearInterval(intervalId); // cleanup interval on component unmount
  }, [tokenData]);

  function prettifyDate(date) {
    if (!date) return '';
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (temperature === null) {
    return <div>Loading temperature...</div>;
  }

  return (
    <div>
      <h2>Current Temperature:</h2>
      <p>{temperature} °C</p>

      {lastUpdated && ( <p>Last updated at: {prettifyDate(lastUpdated)}</p> )}
    </div>
  );
};

export default WeatherDashboard;