import { CLIENT_ID, CLIENT_SECRET, } from './config.js';
import * as helpers from './helpers.js';

// Exchange authorization code for an access token
export async function exchangeCodeForToken(code) {
  const response = await fetch('https://api.netatmo.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: `${window.location.origin}/callback`,
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
  console.log('Attempting to refresh token with refresh_token:', refreshToken);

  const response = await fetch('https://api.netatmo.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const errorDetails = await response.clone().text();

  if (!response.ok) {
    console.error('Error during token refresh:', errorDetails);

    // if refresh token is to old, redirect to login page
    if (errorDetails.includes('invalid_grant')) {
      console.error('refresh_token is invalid. redirecting to login page...');
      localStorage.removeItem('tokenData'); // remove invalid token
      window.location.href = '/'; // redirect to login
      return;
    }

    throw new Error('Error during token refresh');
  }

  const data = await response.json();
  console.log('Token data after refresh:', data);

  // check if refresh_token changed
  if (data.refresh_token && data.refresh_token !== refreshToken) {
    console.log('Netatmo returned a new refresh token:', data.refresh_token);
  } else {
    console.log('Netatmo returned the same refresh token');
  }

  const updatedTokenData = {
    ...data,
    expiryTime: Date.now() + data.expires_in * 1000, // update expiry time
  };

  // save updated token data
  localStorage.setItem('tokenData', JSON.stringify(updatedTokenData));
  return updatedTokenData;
}

// ensure the token is valid and refresh if needed
export async function refreshAccessTokenIfNeeded(tokenData) {
  if (!tokenData) {
    throw new Error('no token data available');
  }

  const { refresh_token, expiryTime } = tokenData;

  console.log('refresh_token expiry time:', helpers.prettifyDate(expiryTime, true, true), 'and current time:', helpers.prettifyDate(Date.now(), true, true));

  // check if token is still valid
  if (Date.now() < expiryTime - 2 * 60 * 60 * 1000) {
    console.log('Token is still valid');
    return tokenData;
  }

  console.log('Access token expired, refreshing...');
  const refreshedData = await refreshAccessToken(refresh_token);
  return refreshedData;
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