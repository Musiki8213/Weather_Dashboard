// ======================= API KEY ==========================
const API_KEY = "9ede1ca0aa1349d0eb56ce38c0323dee";

// ======================= DOM ELEMENTS =====================
const greeting = document.getElementById("greeting");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecastDays");
const offlineIndicator = document.getElementById("offline-indicator");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const themeToggle = document.getElementById("theme-toggle");
const lastUpdatedEl = document.getElementById("last-updated");
const errorDiv = document.getElementById("error");

// ======================= GREETING =========================
const hour = new Date().getHours();
greeting.textContent = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

// ======================= DATE =============================
const nowDate = new Date();
const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
document.getElementById("fullDate").innerHTML = `<h3>${nowDate.toLocaleDateString("en-UG", options)}</h3>`;

// ======================= NETWORK STATUS ===================
function isOnline() {
  return navigator.onLine;
}
function setOfflineMode(offline) {
  if (offlineIndicator) offlineIndicator.style.display = offline ? "block" : "none";
}

// ======================= LOCAL STORAGE ===================
function cacheWeather(key, data) {
  try {
    const cache = JSON.parse(localStorage.getItem("weatherCache") || "{}");
    cache[key] = { data, timestamp: new Date().getTime() };
    localStorage.setItem("weatherCache", JSON.stringify(cache));
  } catch (e) {
    console.warn("LocalStorage quota exceeded:", e);
  }
}

function getCachedWeather(key) {
  try {
    const cache = JSON.parse(localStorage.getItem("weatherCache") || "{}");
    return cache[key] || null;
  } catch {
    return null;
  }
}

// ======================= DISPLAY ==========================
function displayWeather(key, data) {
  if (!weatherDiv) return;
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
    <p>${temp}°C</p>
    <p>${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;

  if (lastUpdatedEl) lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

// ======================= DISPLAY FORECAST ==================
function displayForecast(data) {
  if (!forecastDiv) return;
  forecastDiv.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000).toLocaleDateString("en-UG", { weekday: "long" });
    const temp = forecast.main.temp;
    const weatherMain = forecast.weather[0].main.toLowerCase();
    let iconSrc = "";

    if (weatherMain === "clear") iconSrc = "assets/sunny.png";
    else if (weatherMain === "clouds") iconSrc = "assets/cloudy.png";
    else if (weatherMain === "rain" || weatherMain === "drizzle") iconSrc = "assets/rain.png";
    else if (weatherMain === "snow") iconSrc = "assets/snow.png";
    else iconSrc = "assets/cloudy.png";

    forecastDiv.innerHTML += `
      <div class="forecast-card">
        <h4>${date}</h4>
        <img src="${iconSrc}" alt="${weatherMain}" width="80"/>
        <p>${temp}°C</p>
        <p>${forecast.weather[0].description}</p>
      </div>
    `;
  }
}

// ======================= FETCH WEATHER BY CITY =============
async function fetchWeatherByCity(city) {
  if (!city) return;
  const cachedWeather = getCachedWeather(city);
  const cachedForecast = getCachedWeather(city + "_forecast");

  if (!isOnline()) {
    if (cachedWeather) displayWeather(city, cachedWeather.data);
    if (cachedForecast) displayForecast(cachedForecast.data);
    setOfflineMode(true);
    if (!cachedWeather && !cachedForecast) errorDiv.textContent = "No internet and no cached data.";
    else errorDiv.textContent = "Offline: showing cached data";
    return;
  }

  try {
    const resWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!resWeather.ok) throw new Error("City not found or API error");
    const weatherData = await resWeather.json();
    cacheWeather(city, weatherData);
    displayWeather(city, weatherData);

    const resForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!resForecast.ok) throw new Error("Forecast not found");
    const forecastData = await resForecast.json();
    cacheWeather(city + "_forecast", forecastData);
    displayForecast(forecastData);

    setOfflineMode(false);
    errorDiv.textContent = "";
  } catch (err) {
    errorDiv.textContent = err.message;
    if (cachedWeather) displayWeather(city, cachedWeather.data);
    if (cachedForecast) displayForecast(cachedForecast.data);
  }
}

// ======================= FETCH WEATHER BY COORDS ==========
function fetchWeatherByCoords(lat, lon) {
  if (!lat || !lon) return;

  const cachedWeather = getCachedWeather("geolocation");
  const cachedForecast = getCachedWeather("geolocation_forecast");

  if (!isOnline()) {
    if (cachedWeather) displayWeather("geolocation", cachedWeather.data);
    if (cachedForecast) displayForecast(cachedForecast.data);
    setOfflineMode(true);
    errorDiv.textContent = "Offline: showing cached data";
    return;
  }

  // Online fetch
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      cacheWeather("geolocation", data);
      displayWeather("geolocation", data);
      setOfflineMode(false);
      errorDiv.textContent = "";
    })
    .catch(err => {
      if (cachedWeather) displayWeather("geolocation", cachedWeather.data);
      console.error(err);
    });

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      cacheWeather("geolocation_forecast", data);
      displayForecast(data);
    })
    .catch(err => {
      if (cachedForecast) displayForecast(cachedForecast.data);
      console.error(err);
    });
}

// ======================= INITIAL LOAD ======================
document.addEventListener("DOMContentLoaded", () => {
  // Show cached data immediately if exists
  const cachedWeather = getCachedWeather("geolocation");
  const cachedForecast = getCachedWeather("geolocation_forecast");
  if (cachedWeather) displayWeather("geolocation", cachedWeather.data);
  if (cachedForecast) displayForecast(cachedForecast.data);

  if (!isOnline()) {
    setOfflineMode(true);
    errorDiv.textContent = "Offline: showing cached data";
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      err => errorDiv.textContent = "Could not get location"
    );
  }
});

// ======================= SEARCH ===========================
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    errorDiv.textContent = "Please enter a city name!";
    return;
  }
  fetchWeatherByCity(city);
  cityInput.value = "";
});

cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBtn.click();
});

// ======================= THEME TOGGLE =====================
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
}

// ======================= ONLINE/OFFLINE EVENTS =============
window.addEventListener("online", () => {
  setOfflineMode(false);
  errorDiv.textContent = "";
});
window.addEventListener("offline", () => {
  setOfflineMode(true);
  errorDiv.textContent = "You are offline";
});
