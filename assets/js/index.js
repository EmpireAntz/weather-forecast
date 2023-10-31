//Variable holds API key for Open Weather
var openWeatherAPIKey = 'a0d3f129408d5612ac665943f7214076'
//Base URL for Open Weather
var openWeatherBaseURL = 'https://api.openweathermap.org/data/2.5/forecast?'
//Base url for geocoding to be used for search by city rather than lat and lon
var geocodingBaseURL = 'https://api.openweathermap.org/geo/1.0/direct?q='
//Grabs all buttons and inputs in the form
var searchBtn = document.getElementById("search-weather")
//Loads our saved local history for cities on page load
loadCityHistory()
//Adds a submit listener to the entire search form so that all buttons and inputs will have the lsitener on them
searchBtn.addEventListener('submit', function(e) {
    //Prevents the page from refreshing on default
    e.preventDefault()
    //Gets the city name from the input field and trims any white space
    var cityName = document.getElementById('city-input').value.trim()
    //Constructs the URL for geocoding API to get the lat and lon of the entered city
    var geocodingURL = `${geocodingBaseURL}${cityName}&limit=1&appid=${openWeatherAPIKey}`
    //Send request with constructed geocoding URL 
    fetch(geocodingURL)
        //Requests a response from the server
        .then (function(resp){
            //If the response is not an OK code it will throw an error
            if (!resp.ok) {
                throw new Error(`HTTP error! Status: ${resp.status}`)
            }
            //Parse the response into JSON data
            return resp.json()
        })
        //Gets our returned repsonse in the form of JSON
        .then (function(data) {
                //Gets the latitude from our pased data 
                lat = data[0].lat
                //Gets the longitude from our parsed data
                lon = data[0].lon
                //Constructs the URL for the weatehrapi to use to display based on the lat and lon we pass into it
                var fullURL = (`${openWeatherBaseURL}lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}`)
                //Starts a new fetch request with the above construced URL
                return fetch(fullURL)
        })
        //Requests new respoonse from the full URL constructed and returned above
        .then (function(resp){
            //Parse response into JSON 
            return resp.json()
        })
        //Gets our returned repsonse in the form of JSON then we update our UI dynamicialy with the below functions
        .then (function(data){
            //Calls a function to display our 5 day forecast in the form of cards for the input city
            addWeatherCards(data)
            //Calls a function that will display todays weather info for the input city
            updateCityInfo(data)
            //Calls a function that will save the entered city to local storage
            addCityToLocalStorage(data)
        })
        //If error is caught the error status will be logged in the console
        .catch (function(error){
            console.error(error, "Could not fetch data")
        })
})
//Function to display our 5 day forecast in the form of cards for the input city
function addWeatherCards(data) {
    //Container that will hold our dynamicially updated weather cards
    var cardContainer = document.getElementById('weather-card-container')
    //Adds a Heading to the contaienr 
    cardContainer.innerHTML = `
    <h2>5-Day Forecast</h2>
    `
    //Iterate through the list in 8 hour intervals to get a 5 day forecast
    for (i= 0; i < 40; i+= 8) {
        //Gets the data for each day
        var fiveDayData = data.list[i]
        //Used to traverse data 
        console.log(fiveDayData)
        //Gets the date for each day, splits it at the space and grabs the first thing at the index which is our date
        var date = fiveDayData.dt_txt.split(' ')[0]
        //Gets the icon that represesnts that days weather 
        var weatherIcon = fiveDayData.weather[0].icon
        //Gets the forecast description for each day and sets the first letter to be capitalized
        var dayDescription = fiveDayData.weather[0].description.charAt(0).toUpperCase() + fiveDayData.weather[0].description.slice(1)
        //Gets the temperature which is formatted in kelvin
        var tempinK = fiveDayData.main.temp
        //Converts kelvin into faranheit and makes it a whole number
        var tempinF = ((tempinK - 273.15) * 9/5 + 32).toFixed(0)
        //Gets the wind formatted in miles per second
        var windInMPS = fiveDayData.wind.speed
        //Converts wind to miles per hour and makes it a whole number
        var windInMPH = (windInMPS * 2.23694).toFixed(0)
        //Gets the humidity for each day
        var humidity = fiveDayData.main.humidity
        //Constructed Url needed for icon to render
        var iconUrl = `https://openweathermap.org/img/w/${weatherIcon}.png`
        //Creates the HTML to dynamicially update cards with the information passed in above
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
    //Adds our created cards to the card container
    cardContainer.innerHTML += cardinnerHTML
    }
}
//Function to dipsplay the weather info for the currently input city 
function updateCityInfo(data) {
    //Gets the container for us to append city info to. this is similar to what i did with the cards but i wanted to avoid too many global variables
    var cityContainer = document.getElementById('city-container')
    //Clears any existin html so that when its called information doesnt stack
    cityContainer.innerHTML = ''
    //The variables below are similar to what we did above exept we just get the first day data and display it rather than iterating over each day
    var todaysData = data.list[0]
    var city = data.city.name
    var date = todaysData.dt_txt.split(' ')[0]
    var tempinK = todaysData.main.temp
    var tempinF = ((tempinK - 273.15) * 9/5 + 32).toFixed(0)
    var windInMPS = todaysData.wind.speed
    var windInMPH = (windInMPS * 2.23694).toFixed(0)
    var humidity = todaysData.main.humidity
    //Creats the html for us to append to our city container
    var cityInfoHTML = `  
    <h2>${city} ${date}</h2>
    <p>Temp: ${tempinF} °F</p>
    <p>Wind: ${windInMPH} MPH</p>
    <p>Humidity: ${humidity} %</p>
    `
    //Adds the above html to our city container 
    cityContainer.innerHTML = cityInfoHTML
}
//Funtion that will save cities searched 
function addCityToLocalStorage() {
    //Gets the use input which should be a city name
    var userInput = document.getElementById('city-input').value
    //Gets the list of previously searched cities from local storage or an empty array if it doesn't exist
    var cities = JSON.parse(localStorage.getItem('cities') || '[]')
    //checks if a searched city is already in the list
    if (!cities.includes(userInput)) {
        //Will push the new city to the list
        cities.push(userInput)
        //Updates local storage with the new list of cities
        localStorage.setItem('cities', JSON.stringify(cities))
        //Calls display city which will add the new city in the form of buttons to the form element
        displayCity(userInput)
    }

}
//Displays the city as buttons with the passed in userInput
function displayCity(cityName) {
    //Gets the container that will hold the list of searched cities
    var cityHistory = document.getElementById('city-history')
    //Creates a button 
    var cityHistBtn = document.createElement("button")
    //Button gets a Bootstrap class of btn and btn-secondary to style it 
    cityHistBtn.className = "btn btn-secondary"
    //Sets the text of the button to the user city input
    cityHistBtn.innerText = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    //Add an event listener to the button container 
    cityHistBtn.addEventListener('click', function() {
        //Sets our input value to the value of the button clicked inner text
        document.getElementById('city-input').value = cityName
        //Used so the user doesnt have to manually click search button after they click a city button
        searchBtn.click()
    })
    //Adds created button to the container
    cityHistory.appendChild(cityHistBtn)
}
//Load and display the list of cities previously searched by the user from local storage
function loadCityHistory() {
    //Gets the list of cities form local storage  or an empty array
    var cities = JSON.parse(localStorage.getItem('cities') || '[]')
    //Iterates over each city in the list
    cities.forEach(function(cityName) {
        //Display the name of each city as a button in the city history section
        displayCity(cityName)
    })
}

