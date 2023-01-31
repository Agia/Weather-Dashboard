// ** VARIABLES (Elements) ** //
// Search button element
let searchButton = document.querySelector("#button-search");
// Buttons for search history cities
let cityListButton = document.querySelector(".button-list");
// The area to contain each search history element
let searchList = document.querySelector("#search-list");
// Clear all button element
let clearButton = document.createElement("button");

// ** VARIABLES (Time) ** //
// Today's date, formatted with moment.js
// let today = moment().format('dddd Do MMM');
let now = dayjs().format("D MMM YYYY");
let currentDate;

// ** VARIABLES (Data) ** //
// Assign the #search input value to a variable
let cityInput;

// Variables to store the return API values for their respective names
let currentTemp;
let currentHumidity;
let currentWind;
let iconCode;
let description;
let cityURL;
let iconURL;
// Variables to store the future daily forecasts data
let futureDayTemp;
let futureDayHumidity;
let futureDayWind;
let futureDayIconCode;
let futureDayDescription;
let fiveDayURL;
let futureDayIconURL;
let futureDate;

let weatherData = [];
let searchHistory = [];
let restoreHistory = JSON.parse(localStorage.getItem("city", searchHistory));


// ** EVENT LISTENERS ** //

// Adds an eventListener, on click, to the search button
searchButton.addEventListener("click", function (event) {
    // Prevents default action
    event.preventDefault();

    // Sets variable with value input in search input, with trimmed whitespace
    cityInput = document.querySelector("#search").value.trim();

    // Checks that there is input and returns if not
    if (cityInput !== "") {
        // Calls the function to convert string user input to lat/lon
        
        getCityGeocodes();
        
        // Checks if the array include the user input
        if (!searchHistory.includes(cityInput)) {
            // If it doesn't, user input is pushed to the array
            searchHistory.push(cityInput);
            // Adds the array to localStorage, with key "city"
            localStorage.setItem("city", JSON.stringify(searchHistory));
            
            renderSearchHistory();
        }


        // Removes any value form input field
        document.querySelector("#search").value = "";
        
    } else {
        // Returns from event if input is an empty string
        return;
    }
})


// Event listener for button elements in history lists
searchList.addEventListener("click", function (event) {
    event.preventDefault();

    // Checks which element is source of event
    if (event.target.matches (".button-list")) {
        // Sets the value of that element to the cityInput variable
        cityInput = event.target.textContent;
        // Moves target element to the top of it's parent container
        searchList.prepend(event.target);
        // Calls the function to initial data call for weather data, with the updated variable value above 
        getCityGeocodes();
    }
})


// Event listener for Clear All button, that empties search List contents and localStorage
clearButton.addEventListener("click", function (event) {
    event.preventDefault();
    
    clearAll();
})



// ** FUNCTIONS ** //

// Function that is called on page load
function init () {
    // Checks if array is empty
    if (restoreHistory !== null) {
        // Whilst array length is longer than 5, remove first (i.e. oldest) element
        while (restoreHistory.length > 5) {
            restoreHistory.shift();
        }
        // Iterate through array
        for (let i = 0; i < restoreHistory.length; i++) {
            const index = restoreHistory[i];
            
            searchHistory.push(index);
            // Creates a variable for a button element
            let cityButton = document.createElement("button");
            // Adds class attributes and type attribute
            cityButton.setAttribute("class", "list-group-item list-group-item-action button-list");
            cityButton.setAttribute("type", "button");
            
            // Sets the innerHTML to the value of user input variable
            cityButton.innerHTML = `${index}`;
            // Prepends the new button to the top of the parent element
            searchList.prepend(cityButton);
        }
        
        // Render clear all button
        renderClearButton();
    }
    
}


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
        cityURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c1055e335571b836bde1ca735096c6bc`;
        
        fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=c1055e335571b836bde1ca735096c6bc`
        
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
        
        // Current date
        currentDate = now;
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
        // let weatherData = [];
        // Push the relevant indices to the weatherData array
        weatherData.push(data.list[7], data.list[15], data.list[22], data.list[30]);
        
        // For loop to retrieve and assign data to be later rendered on page
        for (let i = 0; i < weatherData.length; i++) {
            const index = weatherData[i];
            
            
            // Variable storing their respective data, for future forecast days (4 not including current)
            futureDayHumidity = index.main.humidity;
            // As above, but output rounded to the nearest integer
            futureDayTemp = Math.round(index.main.temp);
            // Variable storing wind speed
            futureDayWind = index.wind.speed;
            // Stores the relevant code for use in building the correct URL to retrieve the icon
            futureDayIconCode = index.weather[0].icon;
            // Variable storing weather description
            futureDayDescription = index.weather[0].description;
            // Variable storing the unix datetime and using dayjs to format
            futureDate = dayjs.unix(index.dt).format("D MMM YYYY");
            forecastDates = [];
            
            // With the addition of the dynamic variable, it stores the URL for matching icon to weather conditions
            futureDayIconURL = `https://openweathermap.org/img/wn/${futureDayIconCode}@2x.png`;
            
            // Calls the function to render the information stored above, on the page
            // renderFutureWeatherInfo();

            let dailyCollection = document.getElementById("future-forecast");

            let forecastDayElement = document.createElement("div");
            forecastDayElement.setAttribute("class", "daily-forecast col-md-6 col-lg-3");
  
            forecastDayElement.innerHTML =
            `<div class="card">
            <div class="card-body">
                <div class="d-flex">
                    <h6 class="date">${futureDate}</h6>
            </div>
            
            <div class="temp-desc d-flex flex-column text-center">
            <img class="icon" src=${futureDayIconURL} alt="Weather icon indicating ${futureDayDescription} conditions" />
            <h5 class="temp display-4 mb-0 font-weight-bold">${futureDayTemp}°C</h5>
            <span class="small desc">${futureDayDescription}</span>
            </div>
            
            <div class="d-flex align-items-center further-info text-center">
            <div class="flex-grow-1">
            <div><i class="bi bi-wind"></i><span> Wind Speed: </span><span class="ms-1">${futureDayWind}m/s</span></div>
            <div><i class="bi bi-moisture"></i> <span class="ms-1">Humidity: ${futureDayHumidity}%</span>
            </div>
            </div>`
            
            dailyCollection.append(forecastDayElement);
    
        }
    })
}



// Render the current / todays weather data to the page
function renderCurrentWeatherInfo() {
    
    let currentInfoElement = document.getElementById("current-weather");
    
    currentInfoElement.innerHTML = `<div class="card">
    <div class="card-body">
        <div class="d-flex">
        <h3>${cityTitle}</h3>
    </div>
        
    <div class="temp-desc d-flex flex-column text-center">
    <h5 class="date">${now}</h5>
    <img class="icon" src=${iconURL} alt="Weather icon indicating ${description} conditions" />
    <h5 class="temp display-4 mb-0 font-weight-bold">${currentTemp}°C</h5>
    <span class="small desc">${description}</span>
    </div>
    
    <div class="d-flex align-items-center further-info text-center">
    <div class="flex-grow-1">
    <div><i class="bi bi-wind"></i><span> Wind Speed: </span><span class="ms-1">${currentWind}m/s</span></div>
    <div><i class="bi bi-moisture"></i> <span class="ms-1">Humidity: ${currentHumidity}%</span>
    </div>
    </div>`

}


// Renders the search history area elements
function renderSearchHistory () {
    // Checks if length of searchHistory array is longer than 5
    while (searchHistory.length > 5) {
        // Removes the oldest elements
        searchHistory.shift();
    }
    
    // Whilst the button list has more than 4 buttons
    while (searchList.children.length >= 5) {
        // Remove the last child element
        searchList.removeChild(searchList.lastChild);
    }
    
    // Creates a variable for a button element
    let cityButton = document.createElement("button");
    // Adds class attributes and type attribute
    cityButton.setAttribute("class", "list-group-item list-group-item-action button-list ");
    cityButton.setAttribute("type", "button");
    
    // Sets the innerHTML to the value of user input variable
    cityButton.innerHTML = `${cityInput}`;
    // Prepends the new button to the top of the parent element
    searchList.prepend(cityButton);
    
    // Calls function to render clear all button
    renderClearButton();
    
}


// Renders the clear all button elements, with appropiate attributes
function renderClearButton () {
    clearButton.setAttribute("class", "list-group-item list-group-item-danger");
    clearButton.setAttribute("id", "button-clear")
    clearButton.setAttribute("type", "button");
    clearButton.textContent = "Clear All";
    searchList.append(clearButton);
}


// Clears search history of content, and clears localStorage
function clearAll () {
    if (searchList.children.length > 0) {
        searchList.innerHTML = "";
    }
    localStorage.clear();
}


// Run init() on page load;
init();