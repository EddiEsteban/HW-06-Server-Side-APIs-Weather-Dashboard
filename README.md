# Weather Dashboard

This app allows you to retrieve weather and 5-day forecast information for a given location. Retrieves information from [OpenWeather's API](https://openweathermap.org/api). The 10 most recent search queries are locally saved, and revisiting the site will return these 10 in history sidebar; the weather and forecast content for the most recently searched item will be displayed immediately. The weather and forecast information can be quickly re-retrieved from these recent search queries by clicking them in the history sidebar.

## Usage

![Demo of usage](./assets/img/demo_weatherDashboard.gif)

Submit a city (or other valid location) in the field to find a retrieve weather information. 

The weather section retrieves weather information for the exact time of query at the specified location. The information it displays includes the following:
* Icon representing weather conditions
* Temperature in Celsius
* Humidity
* Wind Speed
* UV Index
    * Low (UVI ≤ 2): Green
    * Moderate (2 < UVI ≤ 5): Yellow
    * High (5 < UVI ≤ 7): Orange
    * Very High (7 < UVI ≤ 10): Red
    * Extreme (UVI > 10): Purple

The forecast section retrieves weather information for the nearest available logged forecast time for the first (current) day, and in 24 hours intervals away for subsequent forecasted days. The information displayed for each forecasted day includes the following:
* Icon representing weather conditions
* Temperature in Celsius
* Humidity