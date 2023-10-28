var openWeatherAPIKey = 'a0d3f129408d5612ac665943f7214076'
var openWeatherBaseURL = 'https://api.openweathermap.org/data/2.5/forecast?'
var geocodingBaseURL = 'http://api.openweathermap.org/geo/1.0/direct?q='
var lat = 20
var lon = 10
var fullURL = (`${openWeatherBaseURL}lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}`)

fetch(fullURL)
    .then (function(resp){
        return resp.json()
    })

    .then (function(data){
        console.log(data)
    })

