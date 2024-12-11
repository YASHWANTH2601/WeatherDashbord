// Weather Dashboard implementation in React using Fetch API instead of Axios

import React, { useState } from "react";
// import "./WeatherDashboard.css"; // Assume this file contains required styles

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState(null);
  const [favoriteCities, setFavoriteCities] = useState([]);

  // const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${
          process.env.API_KEY
        }&q=${city}&units=${unit === "C" ? "metric" : "imperial"}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C");
  };

  const saveCity = () => {
    if (city && !favoriteCities.includes(city)) {
      const updatedFavorites = [...favoriteCities, city];
      setFavoriteCities(updatedFavorites);
      localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    }
  };

  const loadFavoriteCity = (favoriteCity) => {
    setCity(favoriteCity);
    fetchWeather(favoriteCity);
  };

  React.useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteCities")) || [];
    setFavoriteCities(storedFavorites);
  }, []);

  return (
    <div className="weather-dashboard">
      <h1>Weather Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={saveCity}>Save</button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {weatherData && (
        <div className="weather-card">
          <h2>{weatherData.location.name}</h2>
          <p>
            Temperature: {weatherData.current.temp_c}°{unit}
          </p>
          <p>Humidity: {weatherData.current.humidity}%</p>
          <p>Wind Speed: {weatherData.current.wind_kph} kph</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
        </div>
      )}

      <div className="unit-toggle">
        <button onClick={toggleUnit}>
          Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
        </button>
      </div>

      <div className="favorites">
        <h3>Favorite Cities</h3>
        {favoriteCities.length > 0 ? (
          <ul>
            {favoriteCities.map((favCity) => (
              <li key={favCity} onClick={() => loadFavoriteCity(favCity)}>
                {favCity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite cities yet.</p>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
