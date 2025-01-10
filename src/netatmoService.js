import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from './config.js';

// exchange authorization code for an access token
export async function exchangeCodeForToken(code) {
  const response = await fetch('https://api.netatmo.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.log('Error during getting the token:', errorDetails);
    throw new Error('Error during getting the token');
  }

  const data = await response.json();
  return {
    ...data,
    expiryTime: Date.now() + data.expires_in * 1000, // calculate token expiry time
  };
}

// refresh the access token using the refresh token
export async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://api.netatmo.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.log('Error during token refresh:', errorDetails);
    throw new Error('Error during token refresh');
  }

  const data = await response.json();
  return {
    ...data,
    expiryTime: Date.now() + data.expires_in * 1000, // update expiry time
  };
}

// ensure the token is valid and refresh if needed
export async function refreshAccessTokenIfNeeded(tokenData) {
  if (!tokenData) {
    throw new Error('no token data available');
  }

  const { refresh_token, expiryTime } = tokenData; // remove access_token as it's unused

  // check if the token is still valid
  if (Date.now() < expiryTime) {
    return tokenData; // return current token if still valid
  }

  console.log('Access token expired, refreshing...');
  const refreshedData = await refreshAccessToken(refresh_token);
  return {
    ...refreshedData,
    expiryTime: Date.now() + refreshedData.expires_in * 1000, // update expiry time
  };
}

// fetch temperature from the Netatmo weather station
export async function getTemperature(accessToken) {
  const response = await fetch('https://api.netatmo.com/api/getstationsdata', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.log('Error fetching temperature data:', errorDetails);
    throw new Error('Error fetching temperature data');
  }

  const data = await response.json();
  const mainDevice = data.body.devices[0];

  /*  console.log(mainDevice.dashboard_data); -> data I can get an display
  AbsolutePressure: 1003.1
CO2: 1156
Humidity: 47
Noise: 31
Pressure: 1008.9
Temperature: 21.6
date_max_temp: 1736416732
date_min_temp: 1736422477
max_temp: 22.2
min_temp: 18
pressure_trend: "up"
temp_trend: "stable"
time_utc: 1736450908 */

  return mainDevice.dashboard_data.Temperature;
}