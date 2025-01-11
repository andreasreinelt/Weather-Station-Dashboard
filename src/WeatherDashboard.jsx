import React, { useState, useEffect } from 'react';
import { getStationData } from './netatmoService.js';

const WeatherDashboard = ({ tokenData }) => {
  const [stationData, setStationData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        console.log('Fetching station data...');
        const data = await getStationData(tokenData);
        setStationData(data);
        setLastUpdated(new Date()); // Update last updated time
      } catch (err) {
        console.error('Error fetching station data:', err.message);

        if (err.message.includes('Session expired')) {
          console.log('Redirecting to login page...');
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('tokenData');
          window.location.href = '/login';
        } else {
          setError('Error fetching station data');
        }
      }
    };

    fetchData(); // Initial fetch

    // Set interval to refresh data every 10 minutes
    intervalId = setInterval(fetchData, 10 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [tokenData]);

  function prettifyDate(date) {
    const timestamp = date ? new Date(date) : new Date();
    return timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function getTrendSymbol(trend) {
    return trend === 'up' ? '▲' : trend === 'down' ? '▼' : trend === 'stable' ? '▬' : '';
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!stationData) {
    return <div>Loading station data...</div>;
  }

  const dashboard = stationData.dashboard_data;

  return (
    <div>
      <h2>Weather Station Dashboard</h2>
      <p>Temperature: {dashboard.Temperature} °C {getTrendSymbol(dashboard.temp_trend)}</p>
      <p>Air Pressure: {dashboard.Pressure} hPa {getTrendSymbol(dashboard.pressure_trend)}</p>
      <p>Humidity: {dashboard.Humidity} %</p>
      <p>CO2 Level: {dashboard.CO2} ppm</p>
      <p>Noise: {dashboard.Noise} dB</p>
      {lastUpdated && <p>Last updated at: {prettifyDate(lastUpdated)}</p>}
    </div>
  );
};

export default WeatherDashboard;
