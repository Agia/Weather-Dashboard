// let cityName;
let searchButton = document.querySelector("#button-search");

searchButton.addEventListener("click", function (event) {
    event.preventDefault();

    getCityGeocodes();

})

function getCityGeocodes () {
    let cityName = document.querySelector("#search").value;
    let geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=c1055e335571b836bde1ca735096c6bc`;

    fetch(geoURL)
    .then(response => response.json())
    .then(function(data) {
  
        console.log(geoURL);
        let lon = data[0].lon;
        console.log(data[0].lon);
        let lat = data[0].lat;
        console.log(data[0].lat);

        let cityURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c1055e335571b836bde1ca735096c6bc`;

        getWeather(cityURL);
      
      })
}

function getWeather(cityURL) {
    fetch(cityURL)
    .then (response => response.json())
    .then (function (data) {
        console.log(cityURL);
        console.log(data);
    })
}


// ? API Reference
// main.temp
// main.humidity
// weather.description (overcast clouds)
// weather.main (cloudy)
// weather.icon (04n)
// wind.speed
// name (London)