let timeEl = document.getElementById("time");
let dateEl = document.getElementById("date");
let current_weather_items = document.getElementById("current-weather-items");
let timezone = document.getElementById("time-zone"); 
let country = document.getElementById("country"); 
let current_temp = document.getElementById("current-temp"); 
let weather_forecast = document.getElementById("weather-forecast"); 



const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);
getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;


        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                showWeatherData(data);
            })
            .catch(err => console.log(err));
    })
}
function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    current_weather_items.innerHTML = `
    <div class="weather-item">
                        <p>Humidity</p>
                        <p>${humidity} %</p>
                    </div>
                    <div class="weather-item">
                        <p>Pressure</p>
                        <p>${pressure}</p>
                    </div>
                    <div class="weather-item">
                        <p>Wind Speed</p>
                        <p>${wind_speed}</p>
                    </div>
                    <div class="weather-item">
                        <p>Sunrise</p>
                        <p>${moment(sunrise*1000).format('h:mm a')}</p>
                    </div>
                    <div class="weather-item">
                        <p>Sunset</p>
                        <p>${moment(sunset*1000).format('h:mm a')}</p>
                    </div>

    `;
  
    timezone.innerHTML = data.timezone;
    country.innerHTML = data.lat + ' N  ' + data.lon+' E ';
    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            current_temp.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weather_forecast.innerHTML = otherDayForcast;

}