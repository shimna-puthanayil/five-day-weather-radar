var apiKey = '8c1111d0cda691e591dcf0850684c969';
// var city = "London";
var city = "Sydney";
var getCurrentWeather = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=Imperial&appid=' + apiKey;
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
    var lon = weather.coord.lon;
    var lat = weather.coord.lat;
    var currentWeather = weather.weather[0].main;
    var icon = weather.weather[0].icon;
    var currentTemp = weather.main.temp;
    var humidity = weather.main.humidity;
    var wind = weather.wind.speed;
    var currentTime = weather.dt;
    var date = dayjs.unix(currentTime).format("DD/MM/YYYY");
    var city=weather.name;
    // console.log(lon);
    // console.log(lat);
    // console.log(currentWeather);
    // console.log(icon);
    // console.log(currentTemp);
    // console.log(humidity);
    // console.log(wind);
    // console.log(city);

    var currentWeatherEl = $('#current-weather');
    currentWeatherEl.html("");
    var cityEl = $('<p>').append($('<h4 style="margin-top:10px; display:inline;">').text(city + '(' + date + ')').addClass('left-margin'));
    var imgEl = $('<img style="display:inline width:30px; height:40px">').attr('src', "https://openweathermap.org/img/wn/" + icon + "@2x.png");
    cityEl.append(imgEl);
    var tempEl = $('<p>').text("Temp : " + Math.round(currentTemp) + " °F").addClass('left-margin');
    var windEl = $('<p>').text("Wind  : " + wind + " MPH").addClass('left-margin');
    var humidityEl = $('<p>').text("Humidity  : " + humidity + '%').addClass('left-margin');
    currentWeatherEl.append(cityEl);
    currentWeatherEl.append(tempEl);
    currentWeatherEl.append(windEl);
    currentWeatherEl.append(humidityEl);

}
getCurrentWeather(city);
var btnSearchEl = $('#btn-search');
btnSearchEl.on('click', function (event) {
    event.preventDefault();
    var searchEl = $('#username');
    if (searchEl.val()) {
       
        city=searchEl.val();
        getCurrentWeather(city);
    }
    else {
        var myModal = new bootstrap.Modal($('#modal-city-name'),{
            focus: true
          });
        myModal.show();
    }

})
