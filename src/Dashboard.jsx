import React, { useState, useEffect } from 'react';
import { getStationData } from './netatmoService.js';
import { prettifyDate, getTrendSymbol } from './helpers.js';

const Dashboard = ({ tokenData }) => {
  const [stationData, setStationData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState(null);

  // fetch station data
  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        console.log('Fetching station data...');
        const data = await getStationData(tokenData);
        setStationData(data);
        setLastUpdated(new Date());
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

    fetchData();

    intervalId = setInterval(fetchData, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [tokenData]);

  // update the current time every minute
  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date());
  
    const now = new Date();
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
  
    const timeoutId = setTimeout(() => {
      updateClock();
      const intervalId = setInterval(updateClock, 60000); 
  
      return () => clearInterval(intervalId);
    }, delay);
  
    return () => clearTimeout(timeoutId);
  }, []);
  

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!stationData) {
    return <div className="loading">Loading station data...</div>;
  }

  const dashboard = stationData.dashboard_data;

  return (
    <div className="dashboard-container">
      <div className="grid-container">

        <div className="grid-item">
          <div className="value-row">
            <span className="value">{dashboard.Temperature} °C</span>
            <span className="trend">{getTrendSymbol(dashboard.temp_trend)}</span>
          </div>
          <div className="label">Temperature</div>
        </div>
        <div className="grid-item">
          <div className="value-row">
            <span className="value">{dashboard.Humidity} %</span>
          </div>
          <div className="label">Humidity</div>
        </div>
        <div className="grid-item">
          <div className="value-row">
            <span className="value">{prettifyDate(currentTime, true, false, false, false)}</span>
          </div>
          <div className="label">
            {prettifyDate(currentTime, false, false, true, true)}
          </div>
        </div>

        <div className="grid-item">
          <div className="value-row">
            <span className="value">{dashboard.Pressure} hPa</span>
            <span className="trend">{getTrendSymbol(dashboard.pressure_trend)}</span>
          </div>
          <div className="label">Air Pressure</div>
        </div>
        <div className="grid-item">
          <div className="value-row">
            <span className="value">{dashboard.CO2} ppm</span>
          </div>
          <div className="label">CO2 Level</div>
        </div>
        <div className="grid-item">
          <div className="value-row">
            <span className="value">{dashboard.Noise} dB</span>
          </div>
          <div className="label">Noise Level</div>
        </div>
      </div>
      {lastUpdated && (
        <div className="last-updated">
          Last updated at: {prettifyDate(lastUpdated, true, true, false, false)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;