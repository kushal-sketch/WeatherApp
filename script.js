const apiKey = '961d2fae58014065dcc065ef64727b2a'; // 🔑 Replace with your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById('city').value.trim();
  const loadingEl = document.getElementById('loading');
  const weatherBox = document.getElementById('weather-info');

  if (!city) {
    alert('Please enter a city name');
    return;
  }

  const useFahrenheit = document.getElementById('unitToggle').checked;
  const units = useFahrenheit ? 'imperial' : 'metric';

  loadingEl.classList.remove('hidden');
  weatherBox.classList.add('hidden');

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=${units}`
    );

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();
    displayWeather(data, units);
  } catch (error) {
    alert(error.message);
  } finally {
    loadingEl.classList.add('hidden');
  }
}

function displayWeather(data, units) {
  const { name, main, weather, wind } = data;

  document.getElementById('location').textContent = name;
  document.getElementById('temp').textContent = `Temperature: ${main.temp} ${units === 'metric' ? '°C' : '°F'}`;
  document.getElementById('desc').textContent = weather[0].description;
  document.getElementById('icon').src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
  document.getElementById('wind').textContent = `Wind Speed: ${wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`;

  changeBackground(weather[0].main);

  document.getElementById('weather-info').classList.remove('hidden');
}

function changeBackground(condition) {
  let bgColor = '#f1f9ff';
  const cond = condition.toLowerCase();

  if (cond.includes('cloud')) bgColor = '#d3d3d3';
  else if (cond.includes('rain')) bgColor = '#a3c9e2';
  else if (cond.includes('clear')) bgColor = '#ffe680';
  else if (cond.includes('snow')) bgColor = '#f0f8ff';
  else if (cond.includes('thunderstorm')) bgColor = '#cccccc';

  document.body.style.backgroundColor = bgColor;
}

function getWeatherByLocation(lat, lon) {
  const useFahrenheit = document.getElementById('unitToggle').checked;
  const units = useFahrenheit ? 'imperial' : 'metric';
  const loadingEl = document.getElementById('loading');
  const weatherBox = document.getElementById('weather-info');

  loadingEl.classList.remove('hidden');
  weatherBox.classList.add('hidden');

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`
  )
    .then(res => res.json())
    .then(data => displayWeather(data, units))
    .catch(() => alert('Failed to get location weather'))
    .finally(() => loadingEl.classList.add('hidden'));
}

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      getWeatherByLocation(position.coords.latitude, position.coords.longitude);
    });
  }
};
