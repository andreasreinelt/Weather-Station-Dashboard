import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getStationData } from './netatmoService.js';
import { CLIENT_ID, } from './config.js';
import * as helpers from './helpers.js';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const Dashboard = ({ tokenData }) => {
  const [stationData, setStationData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [layout, setLayout] = useState(() => {
    // loads dashboardLayout or uses default settings
    const savedLayout = localStorage.getItem('dashboardLayout');
    return savedLayout
      ? JSON.parse(savedLayout)
      : [
        { i: 'login', x: 0, y: 0, w: 1, h: 1, static: true },
        { i: 'error', x: 0, y: 1, w: 1, h: 1, static: true },
        { i: 'loading', x: 0, y: 2, w: 1, h: 1, static: true },
        { i: 'temperature', x: 0, y: 1, w: 1, h: 1 },
        { i: 'humidity', x: 1, y: 2, w: 1, h: 1 },
        { i: 'time', x: 2, y: 2, w: 1, h: 1 },
        { i: 'pressure', x: 0, y: 3, w: 1, h: 1 },
        { i: 'co2', x: 1, y: 3, w: 1, h: 1 },
        { i: 'noise', x: 2, y: 3, w: 1, h: 1 },
      ];
  });

  // Save Layout if something changed
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  };

  useEffect(() => {
    if (!tokenData) return;
    let intervalId;

    const fetchData = async () => {
      try {
        console.log('Fetching station data...');
        // simulate error: uncomment next line
        // throw new Error('Test error: Unable to fetch data');
        const data = await getStationData(tokenData);
        // simulate Loading error: comment next line
        setStationData(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Station Data Error:', err.message);

        if (err.message.includes('Session expired')) {
          console.log('Redirecting to login page...');
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('tokenData');
          navigate('/');
        } else {
          setError('No Station Data');
        }
      }
    };

    fetchData();

    intervalId = setInterval(fetchData, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [tokenData]);

  useEffect(() => {
    // to make sure the clock updates every full minute (instead of 1 minute after loading the page)
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

  return (
    <div className="dashboard-container">
      <GridLayout
        className="grid-container"
        layout={layout}
        cols={3}
        rowHeight={150}
        width={1200}
        isDraggable={true}
        isResizable={false}
        draggableHandle=".grid-item"
        onLayoutChange={handleLayoutChange}
        compactType="vertical"
      >
        {!tokenData && (
          <div key="login" className="grid-item">
            <div className="value-row">
              <span className="value">
                <a href={`https://api.netatmo.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
                  `${window.location.origin}/callback`
                )}&scope=read_station&state=12345`} >
                  <button>Login with Netatmo</button>
                </a>
              </span>
            </div>
            <div className="label">Login</div>
          </div>
        )}

        {error && (
          <div key="error" className="grid-item">
            <div className="value-row">
              <span className="value">{error}</span>
            </div>
            <div className="label">Error</div>
          </div>
        )}
        {!stationData && !error && tokenData && (
          <div key="loading" className="grid-item">
            <div className="value-row">
              <span className="value">Loading...</span>
            </div>
            <div className="label">Please wait</div>
          </div>
        )}
        <div key="temperature" className="grid-item">
          <div className="value-row">
            <span className="value">{helpers.getValueOrPlaceholder(stationData?.dashboard_data?.Temperature, '°C')}</span>
            <span className="trend">
              {stationData ? helpers.getTrendSymbol(stationData.dashboard_data.temp_trend) : ''}
            </span>
          </div>
          <div className="label">Temperature</div>
        </div>
        <div key="humidity" className="grid-item">
          <div className="value-row">
            <span className="value">{helpers.getValueOrPlaceholder(stationData?.dashboard_data?.Humidity, '%')}</span>
          </div>
          <div className="label">Humidity</div>
        </div>
        <div key="time" className="grid-item">
          <div className="value-row">
            <span className="value">
              {helpers.prettifyDate(currentTime, true, false, false, false)}
            </span>
          </div>
          <div className="label">
            {helpers.prettifyDate(currentTime, false, false, true, true)}
          </div>
        </div>
        <div key="pressure" className="grid-item">
          <div className="value-row">
            <span className="value">{helpers.getValueOrPlaceholder(stationData?.dashboard_data?.Pressure, 'hPa')}</span>
            <span className="trend">
              {stationData ? helpers.getTrendSymbol(stationData.dashboard_data.pressure_trend) : ''}
            </span>
          </div>
          <div className="label">Air Pressure</div>
        </div>
        <div key="co2" className="grid-item">
          <div className="value-row">
            <span className="value">{helpers.getValueOrPlaceholder(stationData?.dashboard_data?.CO2, 'ppm')}</span>
          </div>
          <div className="label">CO2 Level</div>
        </div>
        <div key="noise" className="grid-item">
          <div className="value-row">
            <span className="value">{helpers.getValueOrPlaceholder(stationData?.dashboard_data?.Noise, 'dB')}</span>
          </div>
          <div className="label">Noise Level</div>
        </div>
      </GridLayout>
      {lastUpdated && (
        <div className="last-updated">
          Last updated at: {helpers.prettifyDate(lastUpdated, true, true, false, false)}
        </div>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  tokenData: PropTypes.func.isRequired,
};

export default Dashboard;