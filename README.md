# Weather Dashboard

This app allows you to retrieve weather and 5-day forecast information for a given location.

## Usage

![Demo of usage](./assets/img/demo_weatherDashboard.gif)

Submit a city (or other valid location) in the field to find a retrieve weather information. 

The weather section retrieves weather information for the exact time of query at the specified location. The information it displays includes the following:
* Icon representing weather conditions
* Temperature in Celsius
* Humidity
* Wind Speed
* UV Index
    * Green: UVI ≤ 2
    * Yellow: 2 < UVI ≤ 5
    * Orange: 5 < UVI ≤ 7
    * Red: 7 < UVI ≤ 10
    * Purple: UVI > 10
