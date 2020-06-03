// Weather Dashboard Javascript

const apiKey = `1ce59021adc60bfb56bfd66711ffdf31`

function generateApiObject(city){
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    // let coord = await fetchCoords(city)
    // const uvAPI = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${coord.lat}&lon=${coord.lon}`
    // console.log(uvAPI)
    return {weather: weatherAPI, forecast: forecastAPI}
}
async function fetchData(city, property){
    uvObj = await fetchUv(city)
    return await fetch(generateApiObject(city)[property])
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .catch(error => console.warn(error))
}

var coords

async function fetchUv(city){
    // retrieve coordinates from weather API
    // then retrieve UV API
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    
    var coords
    return await fetch(weatherAPI)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(function(dataCoordsSource){
            console.log(dataCoordsSource.coord.lat)
            console.log({lat: dataCoordsSource.coord.lat, lon: dataCoordsSource.coord.lon})
            coords = {lat: dataCoordsSource.coord.lat, lon: dataCoordsSource.coord.lon}
            return fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${coords.lat}&lon=${coords.lon}`)
        }
        )
        .then(response => response.ok ? response.json() : Promise.reject(response))
        // .then(result => console.log(result))
        .catch(error => console.warn(error))
    
}

fetchUv('Toronto')

let defaultHistory = ['Toronto', 
    'Ottawa', 
    'Washington', 
    'Santiago', 
    'Quebec City', 
    'New York',
    'Tokyo',
    'Osaka',
    'Yellowknife',
    'Bacoor']


let cityHistory = localStorage.cityHistory ? JSON.parse(localStorage.cityHistory) : defaultHistory

// initial content

const historyTabsEl = document.querySelector('#history-tabs')
const historyTabsContentEl = document.querySelector('#history-tabsContent')

function tabBuild(focus, selfIndex, targetIndex=selfIndex){
    return `<a 
    class="nav-link${focus ? ' active' : ''}" 
    id="tab-${selfIndex}" 
    data-toggle="pill" 
    href="#tabContent-${targetIndex}" 
    role="tab" 
    aria-controls="tabContent-${targetIndex}" 
    aria-selected="${focus ? 'true' : 'false'}">${cityHistory[selfIndex]}</a>`

}
function contentBuild(focus, selfIndex, sourceIndex, weatherContent='', forecastContent=''){
    
    return `<div 
    class="tab-pane fade${focus ? ' show active' : ''}" 
    id="tabContent-${selfIndex}" 
    role="tabpanel" 
    aria-labelledby="tab-${sourceIndex}">`
        + `<article id='weather-report-${selfIndex}'>`
            + `${weatherContent}`
        + `</article>`
        + `<section id='forecast-${selfIndex}'>`
            + `${forecastContent}`
        + `</section>`
    + `</div>`
}

async function weatherContentBuild(selectionTarget){
    // city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
    let weatherObj = await fetchData(selectionTarget, 'weather')
    return `<div><hgroup><h5 id='cityName'>${weatherObj.name}</h5><h6 id='date'>${moment.unix(weatherObj.dt).format("MM/DD/YYYY")}</h6></hgroup></div>`
        +`<img id='icon' src='http://openweathermap.org/img/wn/${weatherObj.weather[0].icon}@2x.png' alt='${weatherObj.weather[0].main}: ${weatherObj.weather[0].description}'>`
        +`<div id='temp'>${Math.round(weatherObj.main.temp - 273.15)}°C</div>`
        +`<div id='humidity'>${weatherObj.main.humidity}%</div>`
        +`<div id='wind-speed'>${weatherObj.wind.speed}km/h</div>`
        +`<div id='uv-index'></div>`
}

async function forecastContentBuild(selectionTarget){
    let forecastObj = await fetchData(selectionTarget, 'forecast')
    function buildForecastCard(forecastObj, index){
        return `<div class="card text-white bg-primary mb-3"` 
        + `style="max-width: 18rem;"`
        + `id='forecast-${index}'>`
            + `<div class="card-header">${forecastObj[index]}</div>`
            + `<div class="card-body">`
                + `<h5 class="card-title">Primary card title</h5>`
                + `<p class="card-text">${forecastObj[index]}</p>`
                + `</div>`
        + `</div>`
    }
    cards = ''
    for (i = 0; i < 5; i++) {cards += buildForecastCard(forecastObj, i)}
    return `<div>`
        + cards
        +`</div>`
}

async function buildHistoryTabs(){
    
    historyTabsEl.innerHTML = tabBuild(true, 0)
    for (i=1; i < cityHistory.length; i++){
        historyTabsEl.innerHTML += tabBuild(false, i, 0)
    }
    
}

buildHistoryTabs()
updateContent()

function getWeatherBySearch(event){
    event.preventDefault()
    inputEl = document.querySelector('#searchCity')
    searchQuery = inputEl.value
    inputEl.focus() 
    if (inputEl.value == '') return
    inputEl.value = ''

    // standard capitalization
    searchQuery = searchQuery.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    
    if (!cityHistory.includes(searchQuery)){
        cityHistory.unshift(searchQuery)
        cityHistory.pop()
    } else {
        oldIndex = cityHistory.indexOf(searchQuery)
        cityHistory.unshift(searchQuery)
        console.log('else: ', JSON.stringify(cityHistory))
        cityHistory.splice(oldIndex + 1, 1)
        console.log('else: ', JSON.stringify(cityHistory))
    }
    
    buildHistoryTabs()
    localStorage.cityHistory = JSON.stringify(cityHistory)
    updateContent()
    
}

async function getWeatherByHistory(event){
    if (event.target.matches('a')){
        event.preventDefault()
        clickQuery = event.target.innerHTML
        console.log(clickQuery)
        await updateContent(clickQuery)
    }
}

async function updateContent(query=false){
    const selectionTarget = cityHistory[query != false ? cityHistory.indexOf(query) : 0]
    let weatherFocus = await weatherContentBuild(selectionTarget)
    let forecastFocus = await forecastContentBuild(selectionTarget)
    historyTabsContentEl.innerHTML = contentBuild(true, 0, 0, weatherFocus, forecastFocus)
}