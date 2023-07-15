var apiKey = '8c1111d0cda691e591dcf0850684c969';
var city = "Sydney";
var isReturned = false;
var getCurrentWeather = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=Imperial&appid=' + apiKey;
    fetch(apiUrl, { cache: 'reload' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentWeather(data);
                    isReturned = true;
                });
            } else {
                var myModal = new bootstrap.Modal($('#modal-city-name'), {
                    focus: true
                });
                $('.modal-body').text(response.statusText);
                $('.modal-title').text("Error ");
                myModal.show();
                // isReturned=false;
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
    var icon = weather.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    var currentTemp = weather.main.temp;
    var humidity = weather.main.humidity;
    var wind = weather.wind.speed;
    var currentTime = weather.dt;
    var date = dayjs.unix(currentTime).format("DD/MM/YYYY");
    var city = weather.name;
    var currentWeatherEl = $('#current-weather');
    currentWeatherEl.html("");
    var cityEl = $('<p style="margin-top:20px">').append($('<h4 style="margin-top:10px; display:inline;">').text(city + '(' + date + ')').addClass('left-margin fw-bolder'));
    var imgEl = $('<img style="display:inline width:30px; height:30px">').attr('src', iconUrl);
    cityEl.append(imgEl);
    var tempEl = $('<p>').text("Temp : " + Math.round(currentTemp) + " °F").addClass('left-margin');
    var windEl = $('<p>').text("Wind  : " + wind + " MPH").addClass('left-margin');
    var humidityEl = $('<p>').text("Humidity  : " + humidity + '%').addClass('left-margin');
    currentWeatherEl.append(cityEl);
    currentWeatherEl.append(tempEl);
    currentWeatherEl.append(windEl);
    currentWeatherEl.append(humidityEl);
    getFiveDayForecast(lon, lat);
    addToLocalStorage();
}

//search button click event

var btnSearchEl = $('#btn-search');
btnSearchEl.on('click', function (event) {
    event.preventDefault();

    var searchEl = $('#username');
    if (searchEl.val()) {
        var cities = [];
        city = searchEl.val();
        getCurrentWeather(city);
        console.log(isReturned);

    }
    else {
        var myModal = new bootstrap.Modal($('#modal-city-name'), {
            focus: true
        });
        $('.modal-title').text("Required ");
        $('.modal-body').text("Please enter city name ! ");
        myModal.show();
    }

});
function addToLocalStorage() {
    var searchedCities = localStorage.getItem("cities");
    var cities=[];
    if (searchedCities !== null) {
        cities = JSON.parse(searchedCities);
        if (cities.indexOf(city) === -1) {
            // cities.push(city);
            cities.splice(0,0,city);
            if (isReturned === true) {

                
                // var cityArray = [];
                // var j = 0;
                // for (var i = 1; i <= cities.length; i++) {
                //     cityArray[j] = cities[cities.length - i];
                //     j++;
                // }
                localStorage.setItem("cities", JSON.stringify(cities));
            }
        }
    }
    else {
       
        cities.push(city);
        if (isReturned === true) {
           
            // var cityArray = [];
            // var j = 0;
            // for (var i = 1; i <= cities.length; i++) {
            //     cityArray[j] = cities[cities.length - i];
            //     j++;
            // }
            localStorage.setItem("cities", JSON.stringify(cities));
        }
    }
    createBtnSearchedCity();
}
function createBtnSearchedCity() {

    var cities = JSON.parse(localStorage.getItem("cities"));
    var citybtnsEl = $('#city-buttons');
    citybtnsEl.empty();
    if (cities != null) {
        for (var i = 0; i < cities.length; i++) {
            var btnCity = $('<button id="' + cities[i] + '" type="submit" class="btn btnSearch" >' + cities[i] + '</button>');
            citybtnsEl.append(btnCity);
        }
    }
}

var getFiveDayForecast = function (lon, lat) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=Imperial&appid=' + apiKey;
    // var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=51.5073219&lon=-0.1276474&units=Imperial&appid=8c1111d0cda691e591dcf0850684c969';
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
    var day1Date, day2Date, day3Date, day4Date, day5Date;
    var firstDayWeather = [[], [], [], []];
    var secondDayWeather = [[], [], [], []];
    var thirdDayWeather = [[], [], [], []];
    var fourthDayWeather = [[], [], [], []];
    var fifthDayWeather = [[], [], [], []];

    var today = dayjs().format("YYYY-MM-DD");
    for (var i = 0; i < list.length; i++) {

        var icon = list[i].weather[0].icon;
        var temperature = list[i].main.temp;
        var humidity = list[i].main.humidity;
        var wind = list[i].wind.speed;
        var forecastTime = list[i].dt;
        var forecastDate = dayjs.unix(forecastTime).format("YYYY-MM-DD");
        // var date = new Date((list[i].dt)* 1000).toLocaleDateString();
        console.log("dt field  " + forecastDate);
        // console.log("dt_txt field  "+list[i].dt_txt);
        // console.log("date "+date);
        const date1 = dayjs(forecastDate);
        const date2 = dayjs(today);
        var diffInDays = date1.diff(date2, 'day');
        // console.log(diffInDays);
        switch (diffInDays) {
            case 1: firstDayWeather[0].push(temperature);
                firstDayWeather[1].push(wind);
                firstDayWeather[2].push(humidity);
                firstDayWeather[3].push(icon);
                day1Date = dayjs(forecastDate).format("DD/MM/YYYY");
                break;
            case 2: secondDayWeather[0].push(temperature);
                secondDayWeather[1].push(wind);
                secondDayWeather[2].push(humidity);
                secondDayWeather[3].push(icon);
                day2Date = dayjs(forecastDate).format("DD/MM/YYYY");
                break;
            case 3: thirdDayWeather[0].push(temperature);
                thirdDayWeather[1].push(wind);
                thirdDayWeather[2].push(humidity);
                thirdDayWeather[3].push(icon);
                day3Date = dayjs(forecastDate).format("DD/MM/YYYY");
                break;
            case 4: fourthDayWeather[0].push(temperature);
                fourthDayWeather[1].push(wind);
                fourthDayWeather[2].push(humidity);
                fourthDayWeather[3].push(icon);
                day4Date = dayjs(forecastDate).format("DD/MM/YYYY");
                break;
            case 5: fifthDayWeather[0].push(temperature);
                fifthDayWeather[1].push(wind);
                fifthDayWeather[2].push(humidity);
                fifthDayWeather[3].push(icon);
                day5Date = dayjs(forecastDate).format("DD/MM/YYYY");
                break;
            default: break;
        }

    }
    // console.log(firstDayWeather[3]);
    // console.log(secondDayWeather[3]);
    // console.log(thirdDayWeather[3]);
    // console.log(fourthDayWeather[3]);
    // console.log(fifthDayWeather[3]);
    for (i = 1; i < 6; i++) {
        switch (i) {
            case 1:
                displayWeather(firstDayWeather, "#day1-weather", day1Date);
                break;
            case 2:
                displayWeather(secondDayWeather, "#day2-weather", day2Date);
                break;
            case 3:
                displayWeather(thirdDayWeather, "#day3-weather", day3Date);
                break;
            case 4:
                displayWeather(fourthDayWeather, "#day4-weather", day4Date);
                break;
            case 5:
                if (fifthDayWeather[0].length !== 0) {
                    displayWeather(fifthDayWeather, "#day5-weather", day5Date);
                }
                else {
                    // when the user searches for weather at 12.00 am  or just after  12.00 a.m , then data wont be available for 5 th day. 
                    //The time stamps(total count 40) start with the current day.So all the first 8 time stamps in the response of forecast falls under current day. 
                    //So no data will be available for 5 th day.
                    var weatherEl = $('#day5-weather');
                    var dt = dayjs().format("DD");
                    var dayFive = parseInt(dt) + 5;
                    var month = dayjs().format("MM");
                    var year = dayjs().format("YYYY");
                    var date = dayFive + '/' + month + '/' + year;
                    var dateEl = $('<p style="margin-top:20px">').append($('<h5 style="margin-top:10px; display:inline;color:#dee8f2">').text(date).addClass('left-margin'));
                    //adding text "No Data Available"
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
function displayWeather(weatherArray, weatherElId, date) {
    var maxTemp = Math.max(...weatherArray[0]);
    var maxWind = Math.max(...weatherArray[1]);
    var index = weatherArray[0].indexOf(maxTemp);
    var icon = weatherArray[3][index];
    var humidity = weatherArray[2][index];
    var iconPath = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    var weatherEl = $(weatherElId);
    weatherEl.html("");
    var dateEl = $('<p  style="margin-top:20px">').append($('<h5 style="margin-top:10px; display:inline; color:#dee8f2">').text(date).addClass('left-margin'));
    var imgEl = $('<img style="width:30px; height:30px">').attr('src', iconPath).addClass("mx-3");
    var tempEl = $('<p>').text("Temp : " + Math.round(maxTemp) + " °F").addClass('left-margin');
    var windEl = $('<p>').text("Wind  : " + maxWind + " MPH").addClass('left-margin');
    var humidityEl = $('<p>').text("Humidity  : " + humidity + '%').addClass('left-margin');
    weatherEl.append(dateEl);
    weatherEl.append(imgEl);
    weatherEl.append(tempEl);
    weatherEl.append(windEl);
    weatherEl.append(humidityEl);
}

function init() {
    getCurrentWeather(city);
    createBtnSearchedCity();
}
init();