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

### v0.1.0 - 09.01.25
* Initial release
* Features:
  * Login with Netatmo credentials
  * See the temperature of the main weather Station
  * refreshes the data every 10 minutes
* Known bugs:
  * After 3 hours a new token is not recived and nothing works till cookies are removed

![Picture of v0.1.0](/README_assets/v0.1.0.png)