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
    var firstDayWeather = [[], [], [], []];
    var secondDayWeather = [[], [], [], []];
    var thirdDayWeather = [[], [], [], []];
    var fourthDayWeather = [[], [], [], []];
    var fifthDayWeather = [[], [], [], []];

    var today = dayjs().format("YYYY-MM-DD");
    for (var i = 0; i < list.length; i++) {

        var icon = list[i].icon;
        var temperature = list[i].main.temp;
        var humidity = list[i].main.humidity;
        var wind = list[i].wind.speed;
        var forecastTime = list[i].dt;
        var forecastDate = dayjs.unix(forecastTime).format("YYYY-MM-DD");
        const date1 = dayjs(forecastDate);
        const date2 = dayjs(today);
        var diffInDays = date1.diff(date2, 'day');
        console.log(diffInDays);
        switch (diffInDays) {
            case 1: firstDayWeather[0].push(temperature);
                firstDayWeather[1].push(wind);
                firstDayWeather[2].push(humidity);
                firstDayWeather[3].push(forecastDate);
                break;
            case 2: secondDayWeather[0].push(temperature);
                secondDayWeather[1].push(wind);
                secondDayWeather[2].push(humidity);
                secondDayWeather[3].push(forecastDate);
                break;
            case 3: thirdDayWeather[0].push(temperature);
                thirdDayWeather[1].push(wind);
                thirdDayWeather[2].push(humidity);
                thirdDayWeather[3].push(forecastDate);
                break;
            case 4: fourthDayWeather[0].push(temperature);
                fourthDayWeather[1].push(wind);
                fourthDayWeather[2].push(humidity);
                fourthDayWeather[3].push(forecastDate);
                break;
            case 5: fifthDayWeather[0].push(temperature);
                fifthDayWeather[1].push(wind);
                fifthDayWeather[2].push(humidity);
                fifthDayWeather[3].push(forecastDate);

                break;
            default: break;
        }

    }
    console.log(fifthDayWeather[0]);
    for (i = 1; i < 6; i++) {
        switch (i) {
            case 1:
                var maxTemp = Math.max(...firstDayWeather[0]);
                var maxWind = Math.max(...firstDayWeather[1]);
                var maxHumidity = Math.max(...firstDayWeather[2]);
                var weatherEl = $('#day1-weather');
                weatherEl.html("");
                var date = dayjs(firstDayWeather[3][0]).format("DD/MM/YYYY");
                var dateEl = $('<p>').append($('<h4 style="margin-top:10px; display:inline; color:white">').text(date).addClass('left-margin'));
                // var imgEl = $('<img style="display:inline width:30px; height:40px">').attr('src', "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                // cityEl.append(imgEl);
                var tempEl = $('<p>').text("Temp : " + Math.round(maxTemp) + " °F").addClass('left-margin');
                var windEl = $('<p>').text("Wind  : " + maxWind + " MPH").addClass('left-margin');
                var humidityEl = $('<p>').text("Humidity  : " + maxHumidity + '%').addClass('left-margin');
                weatherEl.append(dateEl);
                weatherEl.append(tempEl);
                weatherEl.append(windEl);
                weatherEl.append(humidityEl);

                break;
            case 2:
                var maxTemp = Math.max(...secondDayWeather[0]);
                var maxWind = Math.max(...secondDayWeather[1]);
                var maxHumidity = Math.max(...secondDayWeather[2]);
                var weatherEl = $('#day2-weather');
                weatherEl.html("");
                var date = dayjs(secondDayWeather[3][0]).format("DD/MM/YYYY");
                var dateEl = $('<p>').append($('<h4 style="margin-top:10px; display:inline;color:white">').text(date).addClass('left-margin'));
                // var imgEl = $('<img style="display:inline width:30px; height:40px">').attr('src', "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                // cityEl.append(imgEl);
                var tempEl = $('<p>').text("Temp : " + Math.round(maxTemp) + " °F").addClass('left-margin');
                var windEl = $('<p>').text("Wind  : " + maxWind + " MPH").addClass('left-margin');
                var humidityEl = $('<p>').text("Humidity  : " + maxHumidity + '%').addClass('left-margin');
                weatherEl.append(dateEl);
                weatherEl.append(tempEl);
                weatherEl.append(windEl);
                weatherEl.append(humidityEl);
                break;
            case 3:
                var maxTemp = Math.max(...thirdDayWeather[0]);
                var maxWind = Math.max(...thirdDayWeather[1]);
                var maxHumidity = Math.max(...thirdDayWeather[2]);
                var weatherEl = $('#day3-weather');
                weatherEl.html("");
                var date = dayjs(thirdDayWeather[3][0]).format("DD/MM/YYYY");
                var dateEl = $('<p>').append($('<h4 style="margin-top:10px; display:inline;color:white">').text(date).addClass('left-margin'));
                // var imgEl = $('<img style="display:inline width:30px; height:40px">').attr('src', "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                // cityEl.append(imgEl);
                var tempEl = $('<p>').text("Temp : " + Math.round(maxTemp) + " °F").addClass('left-margin');
                var windEl = $('<p>').text("Wind  : " + maxWind + " MPH").addClass('left-margin');
                var humidityEl = $('<p>').text("Humidity  : " + maxHumidity + '%').addClass('left-margin');
                weatherEl.append(dateEl);
                weatherEl.append(tempEl);
                weatherEl.append(windEl);
                weatherEl.append(humidityEl);
                break;
            case 4:

                var maxTemp = Math.max(...fourthDayWeather[0]);
                var maxWind = Math.max(...fourthDayWeather[1]);
                var maxHumidity = Math.max(...fourthDayWeather[2]);
                var weatherEl = $('#day4-weather');
                weatherEl.html("");
                var date = dayjs(fourthDayWeather[3][0]).format("DD/MM/YYYY");
                var dateEl = $('<p>').append($('<h4 style="margin-top:10px; display:inline;color:white">').text(date).addClass('left-margin'));
                // var imgEl = $('<img style="display:inline width:30px; height:40px">').attr('src', "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                // cityEl.append(imgEl);
                var tempEl = $('<p>').text("Temp : " + Math.round(maxTemp) + " °F").addClass('left-margin');
                var windEl = $('<p>').text("Wind  : " + maxWind + " MPH").addClass('left-margin');
                var humidityEl = $('<p>').text("Humidity  : " + maxHumidity + '%').addClass('left-margin');
                weatherEl.append(dateEl);
                weatherEl.append(tempEl);
                weatherEl.append(windEl);
                weatherEl.append(humidityEl);
                break;
            case 5:
                var weatherEl = $('#day5-weather');
                var date = dayjs(fifthDayWeather[3][0]).format("DD/MM/YYYY");
                if (fifthDayWeather[0].length !== 0) {
                    var maxTemp = Math.max(...fifthDayWeather[0]);
                    var maxWind = Math.max(...fifthDayWeather[1]);
                    var maxHumidity = Math.max(...fifthDayWeather[2]);
                    weatherEl.html("");
                    var dateEl = $('<p>').append($('<h4 style="margin-top:10px; display:inline;color:white">').text(date).addClass('left-margin'));
                    // var imgEl = $('<img style="display:inline width:30px; height:40px">').attr('src', "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                    // cityEl.append(imgEl);
                    var tempEl = $('<p>').text("Temp : " + Math.round(maxTemp) + " °F").addClass('left-margin');
                    var windEl = $('<p>').text("Wind  : " + maxWind + " MPH").addClass('left-margin');
                    var humidityEl = $('<p>').text("Humidity  : " + maxHumidity + '%').addClass('left-margin');
                    weatherEl.append(dateEl);
                    weatherEl.append(tempEl);
                    weatherEl.append(windEl);
                    weatherEl.append(humidityEl);
                }
                else {
                    var dt = dayjs().format("DD");
                    var dayFive = parseInt(dt) + 5;
                    var month = dayjs().format("MM");
                    var year = dayjs().format("YYYY");
                    var date = dayFive + '/' + month + '/' + year;
                    var dateEl = $('<p>').append($('<h4 style="margin-top:10px; display:inline;color:white">').text(date).addClass('left-margin'));
                    var noDataEl = $('<p>').append($('<p>').text("No Data Available").addClass('left-margin'));
                    weatherEl.append(dateEl);
                    weatherEl.append(noDataEl);
                }
                break;
            default:
                break;
        }
    }
}