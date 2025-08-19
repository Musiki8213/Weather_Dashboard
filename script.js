// API key
const API_KEY = "9ede1ca0aa1349d0eb56ce38c0323dee";

// Greeting based on time
const greeting = document.getElementById("greeting");
const hour = new Date().getHours();
if (hour < 12) greeting.textContent = "Good Morning";
else if (hour < 18) greeting.textContent = "Good Afternoon";
else greeting.textContent = "Good Evening";

// Display full date
const nowDate = new Date();
const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
document.getElementById("fullDate").innerHTML = `<h3>${nowDate.toLocaleDateString("en-UG", options)}</h3>`;

// Unified function to get current weather + 7-day forecast
function getWeatherByCoords(lat, lon) {
  const weatherDiv = document.getElementById("weather");
  const forecastDiv = document.getElementById("forecast");

  // Current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => {
      if (!res.ok) throw new Error("Cannot fetch current weather!");
      return res.json();
    })
    .then(data => {
      const weatherMain = data.weather[0].main.toLowerCase();
      const temp = data.main.temp;
      let iconSrc = "";
      if (weatherMain === "clear") iconSrc = "assets/sunny.png";
      else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
      else if (weatherMain === "rain" || weatherMain === "drizzle") iconSrc = "assets/rain.png";
      else if (weatherMain === "snow") iconSrc = "assets/snow.png";
      else iconSrc = "assets/cloudy.png";

      weatherDiv.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p><img src="${iconSrc}" alt="${weatherMain}" width="150"/></p>
        <p id="temperature">${temp}°C</p>
        <p id="description">${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
    })
    .catch(err => {
      weatherDiv.innerHTML = "";
      document.getElementById("error").textContent = err.message;
      console.error(err);
    });

  // 7-day forecast
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      forecastDiv.innerHTML = "<h3>7-Day Forecast</h3>";
      data.daily.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const weatherMain = day.weather[0].main.toLowerCase();
        let iconSrc = "";
        if (weatherMain === "clear") iconSrc = "assets/sunny.png";
        else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
        else if (weatherMain === "rain" || weatherMain === "drizzle") iconSrc = "assets/rain.png";
        else if (weatherMain === "snow") iconSrc = "assets/snow.png";
        else iconSrc = "assets/cloudy.png";

        forecastDiv.innerHTML += `
          <div class="forecast-day">
            <p>${dayName}</p>
            <img src="${iconSrc}" width="50"/>
            <p>${day.temp.day.toFixed(0)}°C</p>
          </div>
        `;
      });
    })
    .catch(err => console.error(err));
}

// Automatically get weather on page load
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
    err => {
      document.getElementById("error").textContent = "Could not get your location!";
      console.error(err);
    }
  );
} else {
  document.getElementById("error").textContent = "Geolocation is not supported by your browser.";
}

// Search weather by city
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function () {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("error").textContent = "Please enter a city name!";
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => {
      if (!res.ok) throw new Error("City not found or invalid API key!");
      return res.json();
    })
    .then(data => {
      const weatherMain = data.weather[0].main.toLowerCase();
      const temp = data.main.temp;
      let iconSrc = "";
      if (weatherMain === "clear") iconSrc = "assets/sunny.png";
      else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
      else if (weatherMain === "rain" || weatherMain === "drizzle") iconSrc = "assets/rain.png";
      else if (weatherMain === "snow") iconSrc = "assets/snow.png";
      else iconSrc = "assets/cloudy.png";

      document.getElementById("weather").innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p><img src="${iconSrc}" alt="${weatherMain}" width="150"/></p>
        <p id="temperature">${temp}°C</p>
        <p id="description">${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
      document.getElementById("error").textContent = "";
      document.getElementById("cityInput").value = "";
    })
    .catch(err => document.getElementById("error").textContent = err.message);
});

// Search on Enter key
const cityInput = document.getElementById("cityInput");
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") searchBtn.click();
});
