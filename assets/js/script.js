var apiKey='8c1111d0cda691e591dcf0850684c969';

var getCurrentWeather = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city +'&appid='+ apiKey;
    fetch(apiUrl, { cache: 'reload' })
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    displayCurrentWeather(data);
                });
            } else {

               
            }
        })
        .catch(function (error) {

        });
};
var displayCurrentWeather = function (weather) {

    if (weather.length === 0) {
        return;
    }
    var lon=weather.coord.lon;
    var lat=weather.coord.lat;
    var currentWeather=weather.weather.main;
    var icon=weather.weather.icon;
    var currentTemp=weather.main.temp;
    var humidity=weather.main.humidity;
    var wind=weather.wind.speed;
    console.log(lon);
    console.log(lat);
    console.log(currentWeather);
    console.log(icon);
    console.log(currentTemp);
    console.log(humidity);
    console.log(wind);
}