import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherIcon from './WeatherIcon';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeatherDisplay = () => {
    const [city, setCity] = useState('');
    const [inputCity, setInputCity] = useState('');
    const [weeklyForecast, setWeeklyForecast] = useState([]);
    const [error, setError] = useState('');
    const [expandedDay, setExpandedDay] = useState(null);

    useEffect(() => {
        if (city) {
            const API_KEY = '129db7af364a9d1444cea27281dd75fa';
            const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=7&appid=${API_KEY}`;

            axios.get(url)
                .then(response => {
                    const dailyData = processWeeklyData(response.data.list);
                    setWeeklyForecast(dailyData);
                    setError('');
                })
                .catch(error => {
                    setError('We are not able to get the weather data for the specified city.');
                    console.error('Error fetching the weather data:', error);
                });
        }
    }, [city]);

    const processWeeklyData = (data) => {
        const today = new Date().getDay();

        return data.map((forecast, index) => {
            const dayIndex = (today + index) % 7;
            const dayName = dayNames[dayIndex];

            const avgTempK = forecast.main.temp;
            const avgTempC = Math.round(avgTempK - 273.15);
            const humidity = Math.round(forecast.main.humidity);
            const windSpeed = Math.round(forecast.wind.speed);

            return {
                dayName,
                avgTemp: avgTempC,
                iconCode: forecast.weather[0].icon,
                description: forecast.weather[0].description,
                humidity: humidity,
                windSpeed: windSpeed
            };
        });
    };

    const handleSearch = () => {
        setCity(inputCity);
    };

    const toggleDayDetails = (index) => {
        setExpandedDay(expandedDay === index ? null : index);
    };

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    placeholder="Enter city name"
                />
                <button onClick={handleSearch}>Get Weather</button>
                {error && <p className="error-message">{error}</p>}
            </div>

            {city && (
                <div>
                    <h2 className="App-header">Weekly Weather Forecast in {city}</h2>
                    {weeklyForecast.map((forecast, index) => (
                        <div key={index} className="weather-card">
                            <div className="weather-day" onClick={() => toggleDayDetails(index)}>
                                {forecast.dayName}
                            </div>
                            {expandedDay === index && (
                                <div>
                                    <div className="weather-temp">{forecast.avgTemp} °C</div>
                                    <WeatherIcon iconCode={forecast.iconCode} className="weather-icon" />
                                    <p>Description: {forecast.description}</p>
                                    <p>Humidity: {forecast.humidity}%</p>
                                    <p>Wind Speed: {forecast.windSpeed} m/s</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherDisplay;