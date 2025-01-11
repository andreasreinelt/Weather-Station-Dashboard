import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from './config.js';

function prettifyDate(date) {
  const timestamp = date ? new Date(date) : new Date();
  return timestamp.toLocaleTimeString('de-DE', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

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
    console.error('Error during getting the token:', errorDetails);
    throw new Error('Error during getting the token');
  }

  const data = await response.json();
  console.log('Token data after exchange:', data);
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
    console.error('Error during token refresh:', errorDetails);
    throw new Error('Error during token refresh');
  }

  const data = await response.json();
  console.log('Token data after refresh:', data);
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

  const { refresh_token, expiryTime } = tokenData;

  console.log('Current token expiry time:', prettifyDate(expiryTime), 'Current time:', prettifyDate(Date.now()));

  if (Date.now() < expiryTime) {
    console.log('Token is still valid');
    return tokenData;
  }

  console.log('Access token expired, refreshing...');
  try {
    const refreshedData = await refreshAccessToken(refresh_token);
    console.log('Refreshed token data:', refreshedData);

    return {
      ...refreshedData,
      expiryTime: Date.now() + (refreshedData.expires_in * 1000),
    };
  } catch (error) {
    if (error.message.includes('invalid_grant')) {
      console.error('Refresh token is invalid. User must log in again');
      throw new Error('Refresh token is invalid. User must log in again');
    }
    throw error;
  }
}

// fetch station data from the Netatmo weather station
export async function getStationData(tokenData) {
  const validTokenData = await refreshAccessTokenIfNeeded(tokenData);
  const response = await fetch('https://api.netatmo.com/api/getstationsdata', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${validTokenData.access_token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error('Error fetching station data:', errorDetails);
    throw new Error('Error fetching station data');
  }

  const data = await response.json();
  console.log('Fetched station data:', data.body.devices[0]);
  return data.body.devices[0]; // return the main device
}