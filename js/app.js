let histories = [];

let weather = {
    "apiKey": "3d1d22fa9f3fdc267f07adb7bc963172",
    
    fetchGeoloaction: function(city) {
        fetch(
            "https://api.openweathermap.org/geo/1.0/direct?q="
            + city
            + "&limit=&appid="
            + this.apiKey,
        )
        .then((response) => response.json())
        //.then((data[0]) => console.log(data))
        .then((data) => {
            this.fetchWeather(data[0], data[0].name)
        })
    },
    fetchWeather: function (data, name) {
        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat="
             + data.lat
             + "&lon="
             + data.lon 
             + "&units=imperial&exclude=minutely,hourly&appid="
             + this.apiKey,
        )
        .then((response) => response.json())
        .then(data =>  {
            //console.log(data)
            //console.log(data.current)
            this.displayWeather(data.current, name)
            this.fivedayForecast(data.daily)
        });
    },
    displayWeather: function(data, name) {
        const { icon, description } = data.weather[0];
        const { temp, humidity, uvi, wind_speed } = data;

        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = "Temp: " + temp + "°F";
        document.querySelector(".uvi").innerText = "UVI: " + uvi;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind: " + wind_speed + "mph";
        document.querySelector(".Dashboard").style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";

        if(uvi < 3) {
            document.querySelector(".uvi").classList.add('bg-green-400')
        } else if (uvi > 3 && uvi < 7) {
            document.querySelector(".uvi").classList.add("bg-yellow-400");
        } else if (uvi > 7){
            document.querySelector(".uvi").classList.add("bg-red-400");
        }
    },
    save: function (city) {
        histories.push(city);
        document.querySelector(".search-bar").value="";
        localStorage.setItem('SearchHistory', JSON.stringify(histories))
    
        let historical = window.localStorage.getItem('SearchHistory');
        let historian = JSON.parse(historical);
        const index = document.querySelector('.index');
        let generateHTML = '';
        for (let h = 0; h < historian.length; h++){
            generateHTML += 
            `
                <div class="w-48 h-12 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-xl text-center capitalize" id="search-index" onclick="startIndex()">${historian[h]}</div>
            `;
        }
        index.innerHTML = generateHTML; 
    },
    fivedayForecast: function(daily) {
        const cards = document.querySelector('.cards');
        let generateHTML = '';

        for(let i=1; i < 6; i++){
            const { icon, description } = daily[i].weather[0];
            const { humidity,wind_speed, dt } = daily[i]; 
            const { day, night } = daily[i].temp;

                generateHTML += 
                `
                    <div class="w-52 h-72 rounded overflow-hidden shadow-md shadow-gray-400 rounded-2xl bg-slate-500 text-white">
                        <div class="px-6 py-4 flex flex-col justify-center items-center">
                        <div class="Dat font-bold text-xl mb-2">${moment.unix(dt).format("MM/DD/YYYY")}</div>
                        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
                        <p class="Des text-base">${description}</p>
                        <p class="Tem text-base">Temp: ${day}°F</p>
                        <p class="Win text-base">Wind: ${wind_speed} MPH</p>
                        <p class="Hum text-base">Humidity: ${humidity}%</p>
                        </div>
                    </div>
                `; 
        }
        cards.innerHTML = generateHTML;
    }
    
};

window.onload = (event) => {
        let historical = window.localStorage.getItem('SearchHistory');
        let historian = JSON.parse(historical);
        const index = document.querySelector('.index');
        let generateHTML = '';
        if (!historian) {
            return;
        } else {
            for (let h = 0; h < historian.length; h++){
                generateHTML += 
                `
                    <div class="dexer w-48 h-12 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-xl text-center capitalize" id="search-index" onclick="startIndex()">${historian[h]}</div>
                `;
            }
            index.innerHTML = generateHTML; 
        }
};

function startIndex(e) {
    window.onclick = e => {
        let indexKey = e.target.innerText;
        console.log("Index was successfully clicked!");
        console.log(indexKey);
        weather.fetchGeoloaction(indexKey);
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    const city = 'Austin';
    weather.fetchGeoloaction(city);
    document.querySelector(".search-bar").addEventListener('keyup', function(event) {
        event.preventDefault();
        let city = document.querySelector(".search-bar").value;
        if(event.key == "Enter") {
            if(city == '') {
                alert("Must enter a city in the search box");
                return;
            } else {
                //weather.search();
                weather.fetchGeoloaction(city);
                weather.save(city);
            }
        }
    });
    
    document.querySelector(".btn").addEventListener('click', function(){
        localStorage.removeItem('SearchHistory');
        document.querySelector(".index").innerHTML="";
    });
    
});
