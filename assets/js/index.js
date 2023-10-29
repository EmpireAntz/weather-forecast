var openWeatherAPIKey = 'a0d3f129408d5612ac665943f7214076'
var openWeatherBaseURL = 'https://api.openweathermap.org/data/2.5/forecast?'
var geocodingBaseURL = 'https://api.openweathermap.org/geo/1.0/direct?q='
var searchBtn = document.getElementById("search-weather")

loadCityHistory()

searchBtn.addEventListener('submit', function(e) {
    e.preventDefault()

    var cityName = document.getElementById('city-input').value.trim()
    var geocodingURL = `${geocodingBaseURL}${cityName}&limit=1&appid=${openWeatherAPIKey}`

    fetch(geocodingURL)
        .then (function(resp){

            return resp.json()
        })

        .then (function(data) {
                lat = data[0].lat
                lon = data[0].lon
                var fullURL = (`${openWeatherBaseURL}lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}`)
                return fetch(fullURL)
        })

        .then (function(resp){
            return resp.json()
        })
    
        .then (function(data){
            console.log(data)
            addWeatherCards(data)
            updateCityInfo(data)
            addCityToLocalStorage(data)
        })
})

function addWeatherCards(data) {
    var cardContainer = document.getElementById('weather-card-container')
    cardContainer.innerHTML = `
    <h2>5-Day Forecast</h2>
    `

    for (i= 0; i < 40; i+= 8) {
        var fiveDayData = data.list[i]
        console.log(fiveDayData)

        var date = fiveDayData.dt_txt.split(' ')[0]
        var weatherIcon = fiveDayData.weather[0].icon
        var dayDescription = fiveDayData.weather[0].description.charAt(0).toUpperCase() + fiveDayData.weather[0].description.slice(1)
        var tempinK = fiveDayData.main.temp
        var tempinF = ((tempinK - 273.15) * 9/5 + 32).toFixed(0)
        var windInMPS = fiveDayData.wind.speed
        var windInMPH = (windInMPS * 2.23694).toFixed(0)
        var humidity = fiveDayData.main.humidity
        var iconUrl = `https://openweathermap.org/img/w/${weatherIcon}.png`

        var cardinnerHTML = `
        <div class="card text-bg-primary mb-3" style="max-width: 11rem;">
            <div class="card-header">${date}</div>
            <div class="card-body">
                <img src="${iconUrl}"/>
                <p class="card-text">${dayDescription}</p>
                <p class="card-text">Temp: ${tempinF} °F</p>
                <p class="card-text">Wind: ${windInMPH} MPH</p>
                <p class="card-text">Humidity: ${humidity} %</p>
            </div>
        </div>
    `

    cardContainer.innerHTML += cardinnerHTML
    }
}

function updateCityInfo(data) {
    var cityContainer = document.getElementById('city-container')
    cityContainer.innerHTML = ''
    var todaysData = data.list[0]
    var city = data.city.name
    var date = todaysData.dt_txt.split(' ')[0]
    var tempinK = todaysData.main.temp
    var tempinF = ((tempinK - 273.15) * 9/5 + 32).toFixed(0)
    var windInMPS = todaysData.wind.speed
    var windInMPH = (windInMPS * 2.23694).toFixed(0)
    var humidity = todaysData.main.humidity
    var cityInfoHTML = `  
    <h2>${city} ${date}</h2>
    <p>Temp: ${tempinF} °F</p>
    <p>Wind: ${windInMPH} MPH</p>
    <p>Humidity: ${humidity} %</p>
    `
    cityContainer.innerHTML = cityInfoHTML
}

function addCityToLocalStorage() {
    var userInput = document.getElementById('city-input').value
    console.log(userInput)
    var cities = JSON.parse(localStorage.getItem('cities') || '[]')
    if (!cities.includes(userInput)) {
        cities.push(userInput)
        localStorage.setItem('cities', JSON.stringify(cities))
        displayCity(userInput)
    }

}
function displayCity(cityName) {
    var cityHistory = document.getElementById('city-history')
    var cityHistBtn = document.createElement("button")
    cityHistBtn.className = "btn btn-secondary"
    cityHistBtn.innerText = cityName

    cityHistBtn.addEventListener('click', function() {
        document.getElementById('city-input').value = cityName
        searchBtn.click()
    })

    cityHistory.appendChild(cityHistBtn)
}

function loadCityHistory() {
    var cities = JSON.parse(localStorage.getItem('cities') || '[]')
    cities.forEach(function(cityName) {
        displayCity(cityName)
    })
}
