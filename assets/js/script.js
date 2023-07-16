var apiKey = '8c1111d0cda691e591dcf0850684c969';
var city = "";
var isReturned = false;
var lat = 0;
var lon = 0;
var cityName = "";

// To get the geographic coordinates of the searched city.

var getGeoCoordinates = function (city) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    if (data.length) {
                        lat = data[0].lat;
                        lon = data[0].lon;
                        getCurrentWeather(lat, lon);
                        if (data[0].local_names) {
                            if (data[0].local_names.en) {
                                cityName = data[0].local_names.en;
                            }
                            else {
                                cityName = data[0].name;
                            }
                        }
                        else {
                            cityName = data[0].name;
                        }
                    }
                });
            } else {
                var myModal = new bootstrap.Modal($('#modal-city-name'), {
                    focus: true
                });
                $('.modal-body').text(response.statusText);
                $('.modal-title').text("Error ");
                myModal.show();
            }
        })
        .catch(function (error) {

        });
};

// Fetches the current weather conditions of the searched city.

var getCurrentWeather = function (lat, lon) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=Imperial&appid=' + apiKey;
    fetch(apiUrl, { cache: 'reload' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    isReturned = true;
                    displayCurrentWeather(data);
                });
            } else {
                var myModal = new bootstrap.Modal($('#modal-city-name'), {
                    focus: true
                });
                $('.modal-body').text(response.statusText);
                $('.modal-title').text("Error ");
                myModal.show();
            }
        })
        .catch(function (error) {
        });
};

//Displays the current weather of the searched city.

var displayCurrentWeather = function (weather) {

    if (weather.length === 0) {
        return;
    }
    var icon = weather.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    var currentTemp = weather.main.temp;
    var humidity = weather.main.humidity;
    var wind = weather.wind.speed;
    var currentTime = weather.dt;
    var date = dayjs.unix(currentTime).format("DD/MM/YYYY");
    city = weather.name;
    var currentWeatherEl = $('#div-current');
    currentWeatherEl.html("");
    var divCardDayEl = $('<div class="card current-weather">');
    var divCardTextDayEl = $('<p id="current-weather" class="card-text">');
    divCardTextDayEl.html("");
    var cityEl = $('<p style="margin-top:20px">').append($('<h4 style="margin-top:10px; display:inline;">').text(cityName + '(' + date + ')').addClass('left-margin fw-bolder'));
    var imgEl = $('<img style="display:inline width:30px; height:30px">').attr('src', iconUrl);
    cityEl.append(imgEl);
    var tempEl = $('<p>').text("Temp : " + Math.round(currentTemp) + " °F").addClass('left-margin');
    var windEl = $('<p>').text("Wind  : " + wind + " MPH").addClass('left-margin');
    var humidityEl = $('<p>').text("Humidity  : " + humidity + '%').addClass('left-margin');
    divCardTextDayEl.append(cityEl);
    divCardTextDayEl.append(tempEl);
    divCardTextDayEl.append(windEl);
    divCardTextDayEl.append(humidityEl);
    divCardDayEl.append(divCardTextDayEl);
    currentWeatherEl.append(divCardDayEl);
    var forecastHeadingEl = $('<h5 class="ms-2 mt-3 fw-bolder">').text("5-Day Forecast");
    currentWeatherEl.append(forecastHeadingEl);
    getFiveDayForecast(lon, lat);
    addToLocalStorage();
}

//search button - click event

var btnSearchEl = $('#btn-search');
btnSearchEl.on('click', function (event) {
    event.preventDefault();

    var searchEl = $('#username');
    if (searchEl.val()) {
        city = searchEl.val();
        getGeoCoordinates(city);
        searchEl.val("");
    }
    else {
        var myModal = new bootstrap.Modal($('#modal-city-name'), {
            focus: true
        });
        $('.modal-title').text("Required ");
        $('.modal-body').text("Please enter city name . ");
        myModal.show();
    }

});

//Adds the city to local storage

function addToLocalStorage() {
    var searchedCities = localStorage.getItem("cities");
    var cities = [];
    if (searchedCities !== null) {
        cities = JSON.parse(searchedCities);
        if (cities.indexOf(cityName) === -1) {

            if (isReturned === true) {

                cities.splice(0, 0, cityName);
                //limits the no of searched cities to 10 (local storage is keeping 10 last searched city names. )
                if (cities.length > 10) {
                    cities.splice(cities.length - 1, 1);
                }
                localStorage.setItem("cities", JSON.stringify(cities));
            }
        }
    }
    else {
        if (isReturned === true) {
            cities.push(cityName);
            localStorage.setItem("cities", JSON.stringify(cities));
        }
    }
    createBtnSearchedCity();
}

//Function to create searched city buttons

function createBtnSearchedCity() {

    var cities = JSON.parse(localStorage.getItem("cities"));
    var citybtnsEl = $('#city-buttons');
    citybtnsEl.empty();
    if (cities != null) {
        for (var i = 0; i < cities.length; i++) {
            var btnCity = $('<button data-city="' + cities[i] + '" type="submit" class="btn" >' + cities[i] + '</button>');
            citybtnsEl.append(btnCity);
        }
    }
}

//Click event of the searched city buttons

var cityButtonEl = $("#city-buttons");
cityButtonEl.on('click', function (event) {
    var clickedCity = event.target.getAttribute('data-city');

    if (clickedCity) {
        getGeoCoordinates(clickedCity);
    }
});

//Fetches the 5 day forecast 

var getFiveDayForecast = function (lon, lat) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=Imperial&appid=' + apiKey;
    fetch(apiUrl, { cache: 'reload' })
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    displayFiveDayForecast(data.list);
                });
            } else {
            }
        })
        .catch(function (error) {

        });
};

//Displays forecast data  for 5 days 

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
        const date1 = dayjs(forecastDate);
        const date2 = dayjs(today);
        var diffInDays = date1.diff(date2, 'day');
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
    for (i = 1; i < 6; i++) {
        switch (i) {
            case 1:
                displayWeather(firstDayWeather, "#div-day1", "#day1-weather", day1Date);
                break;
            case 2:
                displayWeather(secondDayWeather, "#div-day2", "#day2-weather", day2Date);
                break;
            case 3:
                displayWeather(thirdDayWeather, "#div-day3", "#day3-weather", day3Date);
                break;
            case 4:
                displayWeather(fourthDayWeather, "#div-day4", "#day4-weather", day4Date);
                break;
            case 5:
                if (fifthDayWeather[0].length !== 0) {
                    displayWeather(fifthDayWeather, "#div-day5", "#day5-weather", day5Date);
                }
                else {
                    // when the user searches for weather at 12.00 am  or just after  12.00 a.m , then data wont be available for 5 th day. 
                    //The time stamps(total count 40) start with the current day.So all the first 8 time stamps in the response of forecast falls under current day. 
                    //So no data will be available for 5 th day.
                    var weatherEl = $('#day5-weather');
                    weatherEl.html("");
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

//Dynamically creates elements to display weather data for next 5 days depending on the parameters passed.

function displayWeather(weatherArray, divElId, weatherElId, date) {
    var maxTemp = Math.max(...weatherArray[0]);
    var maxWind = Math.max(...weatherArray[1]);
    var index = weatherArray[0].indexOf(maxTemp);
    var icon = weatherArray[3][index];
    var humidity = weatherArray[2][index];
    var iconPath = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    var divEl = $(divElId);
    divEl.html("");
    var divCardDayEl = $('<div class="card width-card">');
    var divCardBodyDayEl = $('<div class="card-body">');
    var divCardTextDayEl = $('<p id="' + weatherElId + '" class="card-text">');
    divCardTextDayEl.html("");
    var dateEl = $('<p  style="margin-top:20px">').append($('<h5 style="margin-top:10px; display:inline; color:#dee8f2">').text(date).addClass('left-margin'));
    var imgEl = $('<img style="width:30px; height:30px">').attr('src', iconPath).addClass("mx-3");
    var tempEl = $('<p>').text("Temp : " + Math.round(maxTemp) + " °F").addClass('left-margin');
    var windEl = $('<p>').text("Wind  : " + maxWind + " MPH").addClass('left-margin');
    var humidityEl = $('<p>').text("Humidity  : " + humidity + '%').addClass('left-margin');
    divCardTextDayEl.append(dateEl);
    divCardTextDayEl.append(imgEl);
    divCardTextDayEl.append(tempEl);
    divCardTextDayEl.append(windEl);
    divCardTextDayEl.append(humidityEl);
    divCardBodyDayEl.append(divCardTextDayEl);
    divCardDayEl.append(divCardBodyDayEl);
    divEl.append(divCardDayEl);
}

//Initialization function

function init() {
    createBtnSearchedCity();
}
init();