// ** VARIABLES (Elements) ** //
// Search button element
let searchButton = document.querySelector("#button-search");

// ** VARIABLES (Data) ** //
// Assign the #search input value to a variable
let cityInput;

// Variables to store the return API values for their respective names
let currentTemp;
let currentHumidity;
let currentWind;
let iconCode;
let description;
let iconURL;
// Variables to store the future daily forecasts data
let futureDayTemp;
let futureDayHumidity;
let futureDayWind;
let futureDayIconCode;
let futureDayDescription;
let futureDayIconURL;

// Array to store searched locations
let cityHistory = [];



// ** EVENT LISTENERS ** //
// Adds an eventListener, on click, to the search button
searchButton.addEventListener("click", function (event) {
    // Prevents default action
    event.preventDefault();

    cityInput = document.querySelector("#search").value;

    // TODO: Considering clearing current displayed if null input
    // Checks that there is input and returns if not
    if (cityInput !== "") {
        // Calls the function to convert string user input to lat/lon
        getCityGeocodes();
    } else {
        return;
    }

})



// ** FUNCTIONS ** //

// Function to convert the string input from user (city) to it's geocode equivalent, using the OpenWeather API
function getCityGeocodes() {


    // Assign the API URL, with the dynamic value of cityInput, to a variable
    let geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=5&appid=c1055e335571b836bde1ca735096c6bc`;

    // Create a fetch request to the geocoding API, passing in geoURL, and returning (and storing) the longitude and latitude of the response
    fetch(geoURL)
        .then(response => response.json())
        .then(function (data) {

            // Set the longitude and latitude return from the API to variables
            let lon = data[0].lon;
            let lat = data[0].lat;

            // Sets the URL based on the variables above, and request metric output
            let cityURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c1055e335571b836bde1ca735096c6bc`;

            let fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=c1055e335571b836bde1ca735096c6bc`

            // Call the functions, current and 5 day forecast, to get data from API passing the URL saved to cityURL, as a parameter
            getCurrentWeather(cityURL);
            getNextFourDaysForecast(fiveDayURL);

        })
}



// Function that takes a correctly formatted URL and assigns parts of the response to variables
function getCurrentWeather(cityURL) {
    fetch(cityURL)
        .then(response => response.json())
        .then(function (data) {

            // Stores the description of weather condition
            description = (data.weather[0].description);
            // Stores the icon code of the weather condition
            iconCode = data.weather[0].icon;
            // Stores the current temperature, and rounds it to the nearest integer
            currentTemp = Math.round(data.main.temp);
            //Stores the current humidity (as a percentage)
            currentHumidity = data.main.humidity;
            // Stores the wind speed (as meter/sec)
            currentWind = data.wind.speed;
            // Stores the location name
            cityTitle = data.name;
            // Stores the URL of the icon image corresponding to the retrieved iconCode, previously stored
            iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

            // Calls the function to render the information to the page
            renderCurrentWeatherInfo();

        })
}



// Function to retrive and store the data for the 4 day future forecast (i.e. not today)
function getNextFourDaysForecast(fiveDayURL) {
    fetch(fiveDayURL)
        .then(response => response.json())
        .then(function (data) {

            // Create an empty array to hold API data
            let weatherData = [];
            // Push the relevant indices to the weatherData array
            weatherData.push(data.list[7], data.list[15], data.list[22], data.list[30]);

            // For loop to retrieve and assign data to be later rendered on page
            for (let i = 0; i < weatherData.length; i++) {
                const index = weatherData[i];

                // Variable storing their respective data, for future forecast days (4 not including current)
                futureDayHumidity = index.main.humidity;
                // As above, but output rounded to the nearest integer
                futureDayTemp = Math.round(index.main.temp);
                futureDayWind = index.wind.speed;
                // Stores the relevant code for use in building the correct URL to retrieve the icon
                futureDayIconCode = index.weather[0].icon;
                futureDayDescription = (index.weather[0].description);
                // With the addition of the dynamic variable, it stores the URL for matching icon to weather conditions
                futureDayIconURL = `https://openweathermap.org/img/wn/${futureDayIconCode}@2x.png`;

                // Calls the function to render the information stored above, on the page
                renderFutureWeatherInfo();
            }

        })
}



// Renders the data for the future forecast (i.e. not current / todays) to the page
function renderFutureWeatherInfo() {

    let dailyCollection = document.getElementById("future-forecast");


    for (let i = 0; i < dailyCollection.children.length; i++) {
        const index = dailyCollection.children[i];

        index.innerHTML = `    
                    <div class="card">
                        <div class="card-body p-4">
                          <div class="d-flex">
                                <h4 class="flex-grow-1">${cityTitle}</h4>
                                <img class="icon" src=${futureDayIconURL} alt="Weather icon indicating ${futureDayDescription} conditions" />
                            </div>
  
                    <div class="temp-desc d-flex flex-column text-center mt-5 mb-4">
                        <h5 class="temp display-4 mb-0 font-weight-bold">${futureDayTemp}°C</h5>
                        <span class="small desc">${futureDayDescription}</span>
                    </div>
  
              <div class="d-flex align-items-center further-info">
                <div class="flex-grow-1">
                  <div><i class="bi bi-wind"></i><span> Wind Speed: </span><span class="ms-1">${futureDayWind}m/s</span></div>
                  <div><i class="bi bi-moisture"></i> <span class="ms-1">Humidity: ${futureDayHumidity}%</span>
                  </div>
                </div>
              </div>`

        dailyCollection.appendChild(index);

    }
}


// Render the current / todays weather data to the page
function renderCurrentWeatherInfo() {

    let currentInfoElement = document.getElementById("current-weather");

    // TODO: Update following string literal to fit new design / structure
    currentInfoElement.innerHTML = `<h4 class="city-lg">${cityTitle}</h4>
        
            <p class="temp-lg">${currentTemp}</p>
            <p class="desc-lg">${description}</p>
            <img class="icon-lg" src=${iconURL} alt="Weather icon indicating ${description} conditions" />
            <p class="humidity-lg">${currentHumidity}</p>
            <p class="wind-lg">${currentWind}</p>
            `;
}



function getDay () {
    // TODO: Create function using moment.js, to assign readable day values to the future forecast components
}


function storeSearchHistory () {
    // TODO: Push the users search history of cities to localStorage / array, in the most efficient format to later retrieve when requested
}

function retrieveSearchHistory () {
    // TODO: Retrieve data in localStorage, and render it to page
}

// ? API Reference
// main.temp
// main.humidity (%)
// weather[0].description (overcast clouds)
// weather[0].main (cloudy)
// weather[0].icon (04n)
// wind.speed (meter/sec)
// name (London)

// 0 7 15 22 30