var openWeatherAPIKey = 'a0d3f129408d5612ac665943f7214076'
var openWeatherBaseURL = 'https://api.openweathermap.org/data/2.5/forecast?'
var geocodingBaseURL = 'http://api.openweathermap.org/geo/1.0/direct?q='
var lat = 49
var lon = 10
var fullURL = (`${openWeatherBaseURL}lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}`)

fetch(fullURL)
    .then (function(resp){
        return resp.json()
    })

    .then (function(data){
        console.log(data)
        addWeatherCards(data)
    })

function addWeatherCards(data) {
    var cardContainer = document.getElementById('weather-card-container')

    for (i= 0; i < 5; i++) {
        var fiveDayData = data.list[i]
        console.log(fiveDayData)

        var date = fiveDayData.dt_txt.split(' ')[0]
        console.log(date)
        var weatherIcon = fiveDayData.weather[0].icon
        console.log(weatherIcon)
        var temp = fiveDayData.main.temp
        console.log(temp)
        var wind = fiveDayData.wind.speed
        console.log(wind)
        var humidity = fiveDayData.main.humidity
        console.log(humidity)
        var iconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`

        var cardinnerHTML = `
        <div class="card text-bg-primary mb-3" style="max-width: 11rem;">
            <div class="card-header">${date}</div>
            <div class="card-body">
                <img src="${iconUrl}"/>
                <p class="card-text">Temp: ${temp}°C</p>
                <p class="card-text">Wind: ${wind} m/s</p>
                <p class="card-text">Humidity: ${humidity}%</p>
            </div>
        </div>
    `

    cardContainer.innerHTML += cardinnerHTML
    }
}
