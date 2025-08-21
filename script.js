// API key
const API_KEY = "9ede1ca0aa1349d0eb56ce38c0323dee";

// Greeting based on time
const greeting = document.getElementById("greeting");
const hour = new Date().getHours();
if (hour < 12) greeting.textContent = " Morning";
else if (hour < 18) greeting.textContent = " Afternoon";
else greeting.textContent = " Evening";

// Display full date
const nowDate = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
document.getElementById(
  "fullDate"
).innerHTML = `<h3>${nowDate.toLocaleDateString("en-UG", options)}</h3>`;

const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");

//========================Current weather function=========================================================================
function getWeatherByCoords(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Cannot fetch current weather!");
      return res.json();
    })
    .then((data) => {
      const weatherMain = data.weather[0].main.toLowerCase();
      const temp = data.main.temp;
      let iconSrc = "";
      if (weatherMain === "clear") iconSrc = "assets/sunny.png";
      else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
      else if (weatherMain === "rain" || weatherMain === "drizzle")
        iconSrc = "assets/rain.png";
      else if (weatherMain === "snow") iconSrc = "assets/snow.png";
      else iconSrc = "assets/cloudy.png";

      weatherDiv.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p><img src="${iconSrc}" alt="${weatherMain}" width="150"/></p>
        <p id="temperature">${temp}°C</p>
        <p id="description">${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
      document.getElementById("error").textContent = "";
    })
    .catch((err) => {
      weatherDiv.innerHTML = "";
      document.getElementById("error").textContent = err.message;
      console.error(err);
    });
}
//================================================================================================================================

//============Automatically get weather on page load==============================================================================
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) =>
      getWeatherByCoords(position.coords.latitude, position.coords.longitude),
    (err) => {
      document.getElementById("error").textContent =
        "Could not get your location!";
      console.error(err);
    }
  );
} else {
  document.getElementById("error").textContent =
    "Geolocation is not supported by your browser.";
}
//=================================================================================================================================

//==============================Current weather FORECAST=========================================================================

function getForecastByCoords(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then((res) => {
      if (!res.ok) throw new Error("City not found or invalid API key!");
      return res.json();
    })
    .then((data) => {
      // Loop through forecast list
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString("en-UG", {weekday: "long",
        });
        const temp = forecast.main.temp;
        const weatherMain = forecast.weather[0].main.toLowerCase();

        let iconSrc = "";
        if (weatherMain === "clear") iconSrc = "assets/sunny.png";
        else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
        else if (weatherMain === "rain" || weatherMain === "drizzle")
          iconSrc = "assets/rain.png";
        else if (weatherMain === "snow") iconSrc = "assets/snow.png";
        else iconSrc = "assets/cloudy.png";

        const cardHTML = `
    <div class="forecast-card">
      <h4>${date}</h4>
      <img src="${iconSrc}" alt="${weatherMain}" width="80"/>
      <p>${temp}°C</p>
      <p>${forecast.weather[0].description}</p>
    </div>
  `;

        document.getElementById("forecastDays").innerHTML += cardHTML;
      }
    })
    .catch(
      (err) => (document.getElementById("error").textContent = err.message)
    );
}
//=================================================================================================================================

//============Automatically get weather on page load==============================================================================
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) =>
      getForecastByCoords(position.coords.latitude, position.coords.longitude),
    (err) => {
      document.getElementById("error").textContent =
        "Could not get your location!";
      console.error(err);
    }
  );
} else {
  document.getElementById("error").textContent =
    "Geolocation is not supported by your browser.";
}
//=================================================================================================================================

//============Search weather by city====================================================================

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function () {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("error").textContent = "Please enter a city name!";
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  )
    .then((res) => {
      if (!res.ok) {
        document.getElementById("weather").innerHTML = `
        <h2>"City not found!!"</h2>
        <h2>"Please Search Another city"</h2>`;
        throw new Error("City not found or invalid API key!");
      }
      return res.json();
    })
    .then((data) => {
      const weatherMain = data.weather[0].main.toLowerCase();
      const temp = data.main.temp;
      let iconSrc = "";
      if (weatherMain === "clear") iconSrc = "assets/sunny.png";
      else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
      else if (weatherMain === "rain" || weatherMain === "drizzle")
        iconSrc = "assets/rain.png";
      else if (weatherMain === "snow") iconSrc = "assets/snow.png";
      else iconSrc = "assets/cloudy.png";

      document.getElementById("weather").innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p><img src="${iconSrc}" alt="${weatherMain}" width="150"/></p>
        <p id="temperature">${temp}°C</p>
        <p id="description">${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
      document.getElementById("forecastDays").innerHTML = "";
      document.getElementById("error").textContent = "";
      document.getElementById("cityInput").value = "";
    })
    .catch(
      (err) => (document.getElementById("error").textContent = err.message)
    );

  //===================FORECAST==========

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  )
    .then((res) => {
      if (!res.ok) throw new Error("City not found or invalid API key!");
      return res.json();
    })
    .then((data) => {
      //document.getElementById("foreH3Div").innerHTML = `
      // <h3 id="forecastHead">5-Day Forecast:</h3>
      // `;

      // Loop through forecast list
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString("en-UG", {weekday: "long",
        });
        const temp = forecast.main.temp;
        const weatherMain = forecast.weather[0].main.toLowerCase();

        let iconSrc = "";
        if (weatherMain === "clear") iconSrc = "assets/sunny.png";
        else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
        else if (weatherMain === "rain" || weatherMain === "drizzle")
          iconSrc = "assets/rain.png";
        else if (weatherMain === "snow") iconSrc = "assets/snow.png";
        else iconSrc = "assets/cloudy.png";

        const cardHTML = `
    <div class="forecast-card">
      <h4>${date}</h4>
      <img src="${iconSrc}" alt="${weatherMain}" width="80"/>
      <p>${temp}°C</p>
      <p>${forecast.weather[0].description}</p>
    </div>
  `;

        document.getElementById("forecastDays").innerHTML += cardHTML;
      }
    })
    .catch(
      (err) => (document.getElementById("error").textContent = err.message)
    );
  document.getElementById("forecastDays").innerHTML = "";
});

//======================================

//Search on Enter key
const cityInput = document.getElementById("cityInput");
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") searchBtn.click();
});


// ==================== Dark / Light Mode Toggle ====================
const themeToggle = document.getElementById("theme-toggle");

// Apply saved preference on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
