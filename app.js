


const currentDate = document.querySelector(".date-and-time .date");
const currentTime = document.querySelector(".date-and-time .day-of-the-week");

currentDate.innerHTML = `${new Date().toLocaleString("en-GB", {month: "long",})}  ${new Date().getDate()}`;
currentTime.innerHTML = `${new Date().toLocaleString("en-GB", {weekday: "long",})}`;


/* get the city */

const userCityInput = document.querySelector(".location-input input");
const userCityBtn = document.querySelector(".location-input .btn-srch");
const userCurLocBtn = document.querySelector(".location-input .btn-cur-loc");

const cityLocation = document.querySelector(".city-location");
const temperature = document.querySelector(".current-temperature");
const feelsLikeTemperature = document.querySelector(".feels-like");
const weatherGenImg = document.querySelector(".weather-img");
const weatherGenDesc = document.querySelector(".gen-desc");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");
const windDirection = document.querySelector(".wind-direction");

let userCity = "KYIV";

function getTheCity() {
  userCity = userCityInput.value.toUpperCase();
    console.log(userCity);
}

function degToCompass(num) {
    const val = Math.floor((num / 45) + 0.5);
    const arr = [
      "North",
      "North-East",
      "East",
      "South-East",
      "South",
      "South-West",
      "West",
      "North-West",
    ];
    return arr[(val % 8)]
}

userCityInput.addEventListener("keypress", function (event) {
  
  if (event.key === "Enter") {
    event.preventDefault();
    userCityBtn.click();
  }
});

userCityBtn.addEventListener("click", function(){
    getTheCity();
    getWeather(`q=${userCity}`);
});

userCurLocBtn.addEventListener("click", function () {
    let lat;
    let lon;
    navigator.geolocation.getCurrentPosition(
      function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        getWeather(`lat=${lat}&lon=${lon}`);
      },
      function (error) {
          alert("Please, allow access to your current location first.")
      }
    );
    
});

getWeather(`q=${userCity}`);

function getWeather(userLocationForm) {

    fetch(
      `http://api.openweathermap.org/data/2.5/weather?${userLocationForm}&units=metric&APPID=5d066958a60d315387d9492393935c19`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
          if (data.cod.toString().startsWith("4")) {
              alert(data.message);
          } else {
              let {
                  name,
                  sys: { country },
                  main,
                  wind,
                  weather: [{ description, icon }],
              } = data;

              cityLocation.innerHTML = `
                <span class="material-symbols-outlined">
                    location_on
                </span> ${name}, ${country}
                `;
              temperature.innerHTML = `${Math.round(main.temp)}&deg`;
              feelsLikeTemperature.innerHTML = `Feels like ${Math.round(
                main.feels_like
              )}&deg`;
              weatherGenImg.src = `http://openweathermap.org/img/w/${icon}.png`;
              weatherGenDesc.innerHTML = `${description}`;
              pressure.innerHTML = `
                <span class="material-symbols-outlined">
                    thermometer
                </span>
                ${main.pressure} mb
                `;
              humidity.innerHTML = `
                <span class="material-symbols-outlined">
                    humidity_low
                </span>
                ${main.humidity}%
                `;
              windSpeed.innerHTML = `
                <span class="material-symbols-outlined">
                    air
                </span>
                ${wind.speed} m/s
                `;
              windDirection.innerHTML = `
                <span class="material-symbols-outlined">
                    explore
                </span>
                ${degToCompass(wind.deg)}
                `;
          }
      })
        .catch((e) => {
            console.log(e);
        });

}



