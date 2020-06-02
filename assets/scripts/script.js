// Weather Dashboard Javascript

const apiKey = `1ce59021adc60bfb56bfd66711ffdf31`

function generateAPI(city){
    return `api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
}
async function fetchWeatherData(city){
    const result = await fetch(generateAPI(city)).then(result => result.json())
    return result
}

generateAPI('Toronto')

let defaultHistory = ['Toronto', 
    'Ottawa', 
    'Washington', 
    'Santiago', 
    'Quebec City', 
    'New York',
    'Tokyo',
    'Osaka',
    'Cavity City',
    'Bacoor']
let cityHistory = localStorage.cityHistory ? JSON.parse(localStorage.cityHistory) : defaultHistory

function buildHistoryTabs(){
    historyTabsEl = document.querySelector('#history-tabs')
    historyTabsEl.innerHTML = `<a 
        class="nav-link active" 
        id="v-pills-home-tab" 
        data-toggle="pill" 
        href="#v-pills-home" 
        role="tab" 
        aria-controls="v-pills-home" 
        aria-selected="true">${cityHistory[0]}</a>`
    for (i=1; i < cityHistory.length; i++){
        historyTabsEl.innerHTML += `<a 
            class="nav-link" 
            id="v-pills-profile-tab" 
            data-toggle="pill" 
            href="#v-pills-profile" 
            role="tab" 
            aria-controls="v-pills-profile" 
            aria-selected="false">${cityHistory[i]}</a>`
    }
}

buildHistoryTabs()

// buildContent(){

}

function getWeather(event){
    event.preventDefault()
    searchQuery = document.querySelector('#searchCity').value
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
    
    
}
