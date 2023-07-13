var apiKey = '8c1111d0cda691e591dcf0850684c969';
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
    // var currentWeather = weather.weather[0].main;
    var icon = weather.weather[0].icon;
    var currentTemp = weather.main.temp;
    var humidity = weather.main.humidity;
    var wind = weather.wind.speed;
    var currentTime = weather.dt;
    var date = dayjs.unix(currentTime).format("DD/MM/YYYY");
    var city = weather.name;
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
    getFiveDayForecast(lon, lat);
}
getCurrentWeather(city);
var btnSearchEl = $('#btn-search');
btnSearchEl.on('click', function (event) {
    event.preventDefault();
    var searchEl = $('#username');
    if (searchEl.val()) {

        city = searchEl.val();
        getCurrentWeather(city);
    }
    else {
        var myModal = new bootstrap.Modal($('#modal-city-name'), {
            focus: true
        });
        myModal.show();
    }

})
var getFiveDayForecast = function (lon, lat) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=Imperial&appid=' + apiKey;
    fetch(apiUrl, { cache: 'reload' })
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    console.log(data);
                    displayFiveDayForecast(data.list);
                });
            } else {
            }
        })
        .catch(function (error) {

        });
};
var displayFiveDayForecast = function (list) {
    if (list.length === 0) {
        return;
    }
    var forecastDay = 0;
    var firstDayWeather = [[], [], []];
    var secondDayWeather = [[], [], []];
    var thirdDayWeather = [[], [], []];
    var fourthDayWeather = [[], [], []];
    var fifthDayWeather = [[], [], []];

    var today = dayjs().format("YYYY-MM-DD");
    // console.log(today);
    for (var i = 0; i < list.length; i++) {

        var icon = list[i].icon;
        var temperature = list[i].main.temp;
        var humidity = list[i].main.humidity;
        var wind = list[i].wind.speed;
        var forecastTime = list[i].dt;
        var forecastDate = dayjs.unix(forecastTime).format("YYYY-MM-DD");
        console.log(forecastDate);

        const date1 = dayjs(forecastDate);
        const date2 = dayjs(today);
        var diffInDays = date1.diff(date2, 'day');
        console.log(diffInDays);
        switch (diffInDays) {
            case 1: firstDayWeather[0].push(temperature);
                firstDayWeather[1].push(wind);
                firstDayWeather[2].push(humidity);
                break;
            case 2: secondDayWeather[0].push(temperature);
                secondDayWeather[1].push(wind);
                secondDayWeather[2].push(humidity);
                break;
            case 3: thirdDayWeather[0].push(temperature);
                thirdDayWeather[1].push(wind);
                thirdDayWeather[2].push(humidity);
                break;
            case 4: fourthDayWeather[0].push(temperature);
                fourthDayWeather[1].push(wind);
                fourthDayWeather[2].push(humidity);
                break;
            case 5: fifthDayWeather[0].push(temperature);
                fifthDayWeather[1].push(wind);
                fifthDayWeather[2].push(humidity);
                break;
            default: break;
        }

    }
    for (i = 1; i < 6; i++) {
        switch (i) {
            case 1:
                var maxTemp = Math.max(...firstDayWeather[0]);
                var maxWind= Math.max(...firstDayWeather[1]);
                var maxHumidity= Math.max(...firstDayWeather[2]);

                break;
            case 2:

                break;
            case 3:

                break;
            case 4:

                break;
            case 5:

                break;

            default:
                break;
        }


    }
   
}