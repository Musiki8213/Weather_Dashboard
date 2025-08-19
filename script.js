//===============================================================
//Greeting according to time
const greeting = document.getElementById("greeting");
const hour = new Date().getHours();

if (hour < 12) {
  greeting.textContent = " Morning";
} else if (hour < 18) {
  greeting.textContent = " Afternoon";
} else {
  greeting.textContent = " Evening ";
}


     const nowDate = new Date();

      // Format the date 
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = nowDate.toLocaleDateString("en-UG", options);

      
      document.getElementById("fullDate").innerHTML = `<h3>${formattedDate}</h3>`;
//=================================================================





//=====================================================================






//======================================================================





//Function to automatically get the weather in my location
function getWeatherByCoords(lat, lon) {
 

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Cannot fetch weather!");
      return res.json();
    })
    .then(data => {


//Icons for weather

let weatherMain = data.weather[0].main.toLowerCase(); // e.g., "clear", "rain"
let temp = data.main.temp; // temperature in °C
let iconSrc = "";

if (weatherMain === "clear") {
  iconSrc = "assets/sunny.png";
} else if (weatherMain === "clouds") {
  iconSrc = "assets/cloudy.png";
} else if (weatherMain === "rain" || weatherMain === "drizzle") {
  iconSrc = "assets/rain.png";
} else if (weatherMain === "snow") {
  iconSrc = "assets/snow.png";
} else {
  iconSrc = "assets/cloudy.png"; // default
}
//=====


document.getElementById("weather").innerHTML = `
  <h3>${data.name}, ${data.sys.country}</h3>
  <p>Temperature: ${temp}°C</p>
  <p>
    <img src="${iconSrc}" alt="${weatherMain}" width="50" />
    ${data.weather[0].description}
  </p>
  <p>Humidity: ${data.main.humidity}%</p>
`;




    

      console.log("Weather data:", data);
    })
    .catch(err => {
      document.getElementById("error").textContent = err.message;
      console.error(err);
    });
}


// Automatically get weather when page loads
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












//=======================================================
//OpenWeather API
const API_KEY = "9ede1ca0aa1349d0eb56ce38c0323dee";
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function () {
    
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("error").textContent = "Please enter a city name!";
    console.log("No city entered.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  // Clear previous results and errors
  document.getElementById("weather").innerHTML = "";
  document.getElementById("error").textContent = "";
  document.getElementById("cityInput").value= "";

  console.log(`Fetching weather for: ${city}`);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found or invalid API key!");
      }
      return response.json();
    })
    .then((data) => {

      
    
//Icons for weather

let weatherMain = data.weather[0].main.toLowerCase(); // e.g., "clear", "rain"
let temp = data.main.temp; // temperature in °C
let iconSrc = "";

if (weatherMain === "clear") {
  iconSrc = "assets/sunny.png";
} else if (weatherMain === "clouds") {
  iconSrc = "assets/cloudy.png";
} else if (weatherMain === "rain" || weatherMain === "drizzle") {
  iconSrc = "assets/rain.png";
} else if (weatherMain === "snow") {
  iconSrc = "assets/snow.png";
} else {
  iconSrc = "assets/cloudy.png"; // default
}
//=====


document.getElementById("weather").innerHTML = `
  <h3>${data.name}, ${data.sys.country}</h3>
  <p>Temperature: ${temp}°C</p>
  <p>
    <img src="${iconSrc}" alt="${weatherMain}" width="50" />
    ${data.weather[0].description}
  </p>
  <p>Humidity: ${data.main.humidity}%</p>
`;



    })
    .catch((err) => {
      console.error("Fetch error:", err); // log any fetch errors
      document.getElementById("error").textContent = err.message;
    });
});
//========================================================================


