'use strict';




// For converting °K -> °C : °C = °K - 273.15
const ZERO_ABS = -273.15;

/**
 * Make some usefull conversions
 */
const CONV = {
    /**
     * Convert °K -> °C
     */
    k_a_c: k => (k + ZERO_ABS).toFixed(1),
    k_a_f: k => ((K + ZERO_ABS) * 9/5 + 32) .toFixed(1),

    /**
     * Provides time with format hh:mm from timestamp
     */
    dt_a_hm: dt => {
        let date = new Date(dt * 1000);
        return ("0" + date.getHours()).substr(-2) + "h" + (date.getMinutes() + "0").substr(0, 2);
    }

}

const OW_API = {
    base_api_url: 'http://api.openweathermap.org/data/2.5/', // getting the URl 
    base_icon_url: 'http://openweathermap.org/img/w/',  // getting URL for the icon 
    weather: 'weather?q={city}',  // getting URL of weather by city name
    forecast: 'forecast?q={city}&cnt=24', // getting URL for forecast for 3 days
    key: '&APPID=d372021858e26c181fc642ca0f0dbd18',


    //http://api.openweathermap.org/data/2.5/weather?lat=45.508320&lon=-73.566431&appid=d372021858e26c181fc642ca0f0dbd18
    get_weather_url: function (city) {
        return this.base_api_url + this.weather.replace('{city}', city) + this.key;
    },

    //http://api.openweathermap.org/data/2.5/forecast?lat=45.508320&lon=-73.566431&appid=d372021858e26c181fc642ca0f0dbd18
    get_forecast_url: function (city) {
        return this.base_api_url + this.forecast.replace('{city}', city) + this.key;
    },

    //http://openweathermap.org/img/w/10d.png
    get_icon_url: function (icon_id) {
        return this.base_icon_url + icon_id + ".png";
    },
};
document.getElementById("search").addEventListener("click", function () {
    let temperature = document.getElementById("temperature").value;
    let city = document.getElementById('city_name').value;
    console.log(temperature);

    //for current weather
    fetch(OW_API.get_weather_url(city)) // fetch the API,URL by call to city
        .then(function (response) {
            return response.json(); // getting a response using JSON
        })
        .then(function (obj) {
            console.log(obj);
            let main = obj.main;
            console.log(main);
            let weather = obj.weather;
            console.log(main.temperature + "° K");
            console.log(weather[0].description);
            console.log(weather[0].icon);
            if (temperature === 'c') {   // using loop getting the value of temperature
                document.querySelector(".temperature .value").textContent = CONV.k_a_c(main.temp);
            }
            else {
                document.querySelector(".temperature .value").textContent = CONV.k_a_f(main.temp);
            }
            document.querySelector(".description .value").textContent = weather[0].description;
            document.querySelector(".icon img").src = OW_API.get_icon_url(weather[0].icon);
        });




    //for forecast for 3 days, 8 forecasts per day
    fetch(OW_API.get_forecast_url(city))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let trow = document.getElementById("tb_forecast").getElementsByClassName("model")[0];
            console.log(trow);
            let tbody = document.getElementById("tb_forecast").getElementsByTagName("tbody")[0];
            console.log(tbody);
            for (let l of data.list) {
                let cln = trow.cloneNode(true); // creaing a clone 
                cln.classList.remove("model");  //remove our model class
                tbody.appendChild(cln);
                console.log(cln);
                document.querySelector("#tb_forecast tbody tr .hour").textContent = l.dt_txt;
                console.log(l.main);
                // alert(l.main.temp);
                if (temperature === 'c') { //using loop getting the forecast 
                    document.querySelector(" #tb_forecast tbody tr .temperature").textContent = CONV.k_a_c(l.main.temp) + "";
                }
                else {
                    document.querySelector("#tb_forecast tbody tr .temperature").textContent = CONV.k_a_f(l.main.temp) + "";
                }
                document.querySelector("#tb_forecast tbody tr img").src = OW_API.get_icon_url(l.weather[0].icon);
                document.querySelector("#tb_forecast tbody tr .description").textContent = l.weather[0].description;
            }

        });

});
