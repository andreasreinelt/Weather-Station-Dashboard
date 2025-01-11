# Weather station Dashboard with Netatmo

This is my Senior Solo project at Codeworks.
It is a React-based dashboard website to display the temperature, humidity and other values of a Netatmo smart weather station

<span style="color:red">Everything is not finished and not ready to be used</span>

## Configuration

* Go to https://dev.netatmo.com/apps/ and register your App, get your CLIENT_ID and CLIENT_SECRET
* Rename the Example Configuration file to config.js and put in your Information
* Install dependencies with npm install
* Start the development server with npm run dev

## To Do
* Display more Data and more devices (and make it prittier):
  * Humidity / CO2 / Air Pressure
* Maybe give the possibility to display mock Data for users to try without an account

## Changelog

### v0.2.0 - 10.01.25
* New Features:
  * Displays now Temperature, Humidity, Air Pressure, CO2 Level and Noise Level of the main device
  * The API provides a trend for Temperature and Air Pressure, so I display this as well
  * Still refreshes the data every 10 minutes
  * NetatmoService and WeatherDashboard are now better separated. The service fetches the data, the dashboard displays it
  * Added some changes and suggestions I got because of the code review exercise we did
  * Changed the redirect URL and some Vite settings to make everything work on the network
* Fixed bugs:
  * So after 3 hours not using the dashboard you need to login again because of the API, should handle this better now

![Picture of v0.2.0](/README_assets/v0.2.0.png)

### v0.1.0 - 09.01.25
* Initial release
* Features:
  * Login with Netatmo credentials
  * See the temperature of the main weather Station
  * refreshes the data every 10 minutes
* Known bugs:
  * After 3 hours a new token is not recived and nothing works till cookies are removed

![Picture of v0.1.0](/README_assets/v0.1.0.png)