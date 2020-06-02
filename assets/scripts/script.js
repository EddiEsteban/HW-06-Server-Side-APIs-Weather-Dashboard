// Weather Dashboard Javascript

const apiKey = `1ce59021adc60bfb56bfd66711ffdf31`

function generateApiObject(city){
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    return {weather: weatherAPI, forecast: forecastAPI}
}
async function fetchData(city, dataType){
    let myData = await fetch(generateApiObject(city)[dataType])
    let result = await myData.json()
    
    return result
}
// async function thing(){
//     const example = await fetchData('Toronto', 'weather')
//     console.log(example)
//     return(example)
// }


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

async function buildHistoryTabs(){
    const weatherObj = await fetchData(cityHistory[0], 'weather')
    const forecastObj = await fetchData(cityHistory[0], 'forecast')
    let weatherFocus = weatherObj.weather[0].main + ' ' + weatherObj.main.temp
    let forecastFocus = forecastObj.list[0].weather[0].main + ' ' + forecastObj.list[0].main.temp
    historyTabsEl.innerHTML = tabBuild(true, 0)
    historyTabsContentEl.innerHTML = contentBuild(true, 0, 0, weatherFocus, forecastFocus)
    for (i=1; i < cityHistory.length; i++){
        historyTabsEl.innerHTML += tabBuild(false, i, 0)
        // historyTabsContentEl.innerHTML += contentBuild(false, 0, 0)
    }
    
}

buildHistoryTabs()

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
    
}

async function getWeatherByHistory(event){
    if (event.target.matches('a')){
        event.preventDefault()
        clickQuery = event.target.innerHTML
        console.log(clickQuery)
        await updateContent(clickQuery)
    }
}

async function updateContent(query){
    const weatherObj = await fetchData(cityHistory[cityHistory.indexOf(query)], 'weather')
    const forecastObj = await fetchData(cityHistory[cityHistory.indexOf(query)], 'forecast')
    let weatherFocus = weatherObj.weather[0].main + ' ' + weatherObj.main.temp
    let forecastFocus = forecastObj.list[0].weather[0].main + ' ' + forecastObj.list[0].main.temp
    historyTabsContentEl.innerHTML = contentBuild(true, 0, 0, weatherFocus, forecastFocus)
}