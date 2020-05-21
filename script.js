//DOM Selector -> Variable setup
const zipBtn = document.getElementById('zip-search');
const zipInput = document.getElementById('zip-input');
const cityBtn = document.getElementById('city-search');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const backBtn = document.getElementById('back-btn');
const locLabel = document.getElementById('location-label');
const body = document.body;
const currentWeather = document.getElementById('current-weather');
const currentTempTable = document.getElementById('current-temp-table');
const currentTemp = document.getElementById('current-temp');
const dailyForecast = document.getElementById('daily-forecast-table');
const day1 = document.getElementById('one-day');
const day2 = document.getElementById('two-day');
const day3 = document.getElementById('three-day');
const day4 = document.getElementById('four-day');
const day5 = document.getElementById('five-day');


// Other important variables and arrays
const days = [day1, day2, day3, day4, day5];
var date = new Date();
var dayNum = date.getDay();
const weekDayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];




// OpenWeather API Key
var apiKey = "";
// OpenWeather API call for Current Weather by city name
//`api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
//`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${apiKey}`

// OpenWeather API call for Current Weather by zip code
//`api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}`
//`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?zip=38018,US&appid={apiKey}`

// OpenWeather API onetime call (only accessible through geographical coordinates)
// `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`



// Fetch weather data for search query from OpenWeather
function getWeather() {
    if (zipInput.value.length == 0) {
        var loc = cityInput.value;
        fetch(`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${apiKey}`)
            .then(result => { return result.json() })
            .then(data => {
                displayInfo(data);
                fetchWeather(data);
            })
            .catch(error => console.log(error));

    } else {
        var loc = zipInput.value;
        fetch(`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?zip=${loc}&appid=${apiKey}`)
            .then(result => { return result.json() })
            .then(data => {
                displayInfo(data);
                fetchWeather(data);
            })
            .catch(error => console.log(error));
    }



}

// Fetch weather function (called after fetching geographical coordinates from location info after the current weather fetch)
function fetchWeather(data) {
    fetch(`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`)
        .then(result => { return result.json() })
        .then(data => displayWeather(data))
        .catch(error => console.log(error));
}






// Convert API temp (K) to Farenheit (F)
function tempConvert(temp) {
    var faren = Math.floor((temp - 273.15) * (9 / 5) + 32);
    return faren;
}

//Display location information and current weather
function displayInfo(data) {
    // console.log(data); -- logs the entire data object from the first API fetch
    locLabel.innerHTML = (`${data.name}, ${data.sys.country}`);
    currentTempTable.classList.remove("hidden");
    currentTemp.innerHTML = (`
    <td>${tempConvert(data.main.temp)}&#8457</td>
    <td>${tempConvert(data.main.feels_like)}&#8457</td>
    <td>${data.main.humidity}&#x25`);

    if (data.weather[0].main == "Clouds") {
        body.style.backgroundImage = 'url("./images/overcast.jpg")';
        currentWeather.innerHTML = (`<i class="fas fa-cloud-sun"></i> </br> Partly Cloudy`);
    } else if (data.weather[0].main == "Rain") {
        body.style.backgroundImage = 'url("./images/rain.jpg")';
        if (data.weather[0].description == "heavy intensity rain") {
            currentWeather.innerHTML = (`<i class="fas fa-cloud-showers-heavy"></i> </br> Heavy Rain`);
        } else {
            currentWeather.innerHTML = (`<i class="fas fa-cloud-showers-heavy"></i> </br> Light Rain`);
        }
    } else if (data.weather[0].main == "Snow") {
        body.style.backgroundImage = 'url("./images/snowy.jpg")';
        currentWeather.innerHTML = ('<i class="far fa-snowflake"></i> </br> Snowy');
    } else {
        body.style.backgroundImage = 'url("./images/sunny.jpg")';
        currentWeather.innerHTML = (`<i class="fas fa-sun"></i> </br> Clear Skies`);
    };
};

//Display weather forecast for the next 5 days
function displayWeather(data) {
    //console.log(data); -- logs the entire data object from the second API fetch
    currentTemp.innerHTML += (`
    <td>${tempConvert(data.daily[0].temp.min)}&#8457</td>
    <td>${tempConvert(data.daily[0].temp.max)}&#8457</td>`);
    dailyForecast.classList.remove("hidden");

    for (i = 1; i < 6; i++) {
        days[i-1].innerHTML = (`<th scope="row">${weekDayArr[dayNum+i]}</th>`);

        if (data.daily[i].weather[0].main == "Clouds") {
            days[i-1].innerHTML += (`<td><i class="fas fa-cloud-sun"></i></td>`);
        } else if (data.daily[i].weather[0].main == "Rain") {
            days[i-1].innerHTML += (`<td><i class="fas fa-cloud-showers-heavy"></i></td>`);
        } else if (data.daily[i].weather[0].main == "Snow") {
            days[i-1].innerHTML += (`<td><i class="far fa-snowflake"></i></td>`);
        } else {
            days[i-1].innerHTML += (`<td><i class="fas fa-sun"></i></td>`);
        };

        days[i-1].innerHTML += (`
        <td>${tempConvert(data.daily[i].temp.max)}&#8457</td>
        <td>${tempConvert(data.daily[i].temp.min)}&#8457</td>
        <td>${data.daily[i].humidity}&#x25</td>
        `);
    }

    
};


//************* DOM EVENT HANDLERS *************//

// Set up event listener for the the 'Search' button
document.getElementById("search-btn").onclick = getWeather;

//Event listener for Zip/Postal Code Search option
zipBtn.onclick = function () {
    zipBtn.classList.add("hidden");
    cityBtn.classList.add("hidden");
    zipInput.classList.remove("hidden");
    searchBtn.classList.remove("hidden");
    backBtn.classList.remove("hidden");
};

// Event listener for City Name Search option
cityBtn.onclick = function () {
    zipBtn.classList.add("hidden");
    cityBtn.classList.add("hidden");
    cityInput.classList.remove("hidden");
    searchBtn.classList.remove("hidden");
    backBtn.classList.remove("hidden");
};

//Event listener to allow user to return to search options
backBtn.onclick = function () {
    location.reload();
};

// Set up even listener for the 'Enter' key
cityInput.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("search-btn").click();
    }
});

zipInput.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("search-btn").click();
    }
});



