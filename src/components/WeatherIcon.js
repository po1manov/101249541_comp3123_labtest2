import React from 'react';

const WeatherIcon = ({ iconCode }) => {
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    return <img src={iconUrl} alt="Weather Icon" />;
};

export default WeatherIcon;
