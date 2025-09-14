/**
 * WeatherSection.jsx - Weather Information & Activity Recommendations
 * 
 * Features:
 * - Current weather data from OpenWeatherMap API
 * - Activity recommendations based on weather conditions
 * - 5-day weather forecast
 * - Weather-based clothing suggestions
 * - Beautiful weather icons and animations
 */

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const WeatherSection = ({ location = 'New York', isPreview = false }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // OpenWeatherMap API key - In production, use environment variables
  const API_KEY = 'demo'; // Replace with actual API key
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Fetch weather data
  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, using mock data since API key is needed
      // In production, uncomment the real API calls below
      
      /*
      const currentResponse = await fetch(
        `${BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Weather data not available');
      }
      
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      */
      
      // Mock data for demo
      const currentData = {
        name: location,
        main: {
          temp: 22,
          feels_like: 24,
          humidity: 65,
          pressure: 1013
        },
        weather: [{
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        wind: {
          speed: 3.5
        },
        visibility: 10000
      };
      
      const forecastData = {
        list: [
          { dt: Date.now() / 1000, main: { temp: 25 }, weather: [{ main: 'Sunny', icon: '01d' }] },
          { dt: (Date.now() / 1000) + 86400, main: { temp: 23 }, weather: [{ main: 'Cloudy', icon: '02d' }] },
          { dt: (Date.now() / 1000) + 172800, main: { temp: 18 }, weather: [{ main: 'Rain', icon: '09d' }] },
          { dt: (Date.now() / 1000) + 259200, main: { temp: 20 }, weather: [{ main: 'Cloudy', icon: '03d' }] },
          { dt: (Date.now() / 1000) + 345600, main: { temp: 26 }, weather: [{ main: 'Sunny', icon: '01d' }] }
        ]
      };
      
      setWeatherData(currentData);
      setForecast(forecastData);
    } catch (err) {
      setError('Unable to fetch weather data. Please check your API key and try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  // Get weather icon component
  const getWeatherIcon = (condition, size = 'w-8 h-8') => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className={`${size} text-blue-500`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  // Generate activity recommendations based on weather
  const getActivityRecommendations = (weather) => {
    if (!weather) return [];
    
    const temp = weather.main.temp;
    const condition = weather.weather[0].main.toLowerCase();
    const recommendations = [];

    if (condition === 'clear' && temp > 20) {
      recommendations.push(
        { activity: '🚶‍♀️ Go for a walk', reason: 'Perfect weather for outdoor activities' },
        { activity: '🏃‍♂️ Outdoor jogging', reason: 'Great temperature for running' },
        { activity: '📚 Read outside', reason: 'Enjoy the sunshine while reading' }
      );
    } else if (condition === 'rain') {
      recommendations.push(
        { activity: '🧘‍♀️ Indoor yoga', reason: 'Perfect for indoor mindfulness' },
        { activity: '📖 Read a book', reason: 'Cozy weather for indoor activities' },
        { activity: '☕ Enjoy hot tea', reason: 'Warm up with a hot beverage' }
      );
    } else if (temp < 10) {
      recommendations.push(
        { activity: '🧥 Layer up', reason: 'Cold weather requires warm clothing' },
        { activity: '🏠 Indoor workout', reason: 'Stay warm with indoor exercise' },
        { activity: '🍲 Hot soup', reason: 'Warm food for cold weather' }
      );
    } else {
      recommendations.push(
        { activity: '🚶‍♀️ Light walk', reason: 'Mild weather for gentle activities' },
        { activity: '🌱 Gardening', reason: 'Good conditions for outdoor tasks' }
      );
    }

    return recommendations;
  };

  // Preview version for dashboard
  if (isPreview) {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center text-sm">{error}</div>;
    
    return (
      <div className="text-center">
        <div className="text-2xl mb-4">🌤️</div>
        <h3 className="font-semibold text-gray-800 mb-3">Weather Insights</h3>
        {weatherData && (
          <div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getWeatherIcon(weatherData.weather[0].main, 'w-5 h-5')}
              <span className="text-sm text-gray-700">{Math.round(weatherData.main.temp)}°C</span>
            </div>
            <p className="text-xs text-gray-600 capitalize">{weatherData.weather[0].description}</p>
            <p className="text-xs text-emerald-600 mt-2">Great for outdoor activities!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Weather & Activity Guide</h2>
        <p className="text-gray-600">Plan your day based on current conditions</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading weather data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">⛈️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchWeatherData}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : weatherData ? (
        <>
          {/* Current Weather Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Weather Info */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                  {getWeatherIcon(weatherData.weather[0].main, 'w-16 h-16')}
                  <div>
                    <h3 className="text-4xl font-bold text-gray-800">
                      {Math.round(weatherData.main.temp)}°C
                    </h3>
                    <p className="text-gray-600 capitalize">
                      {weatherData.weather[0].description}
                    </p>
                  </div>
                </div>
                <div className="text-lg text-gray-700 mb-2">
                  📍 {weatherData.name}
                </div>
                <div className="text-sm text-gray-600">
                  Feels like {Math.round(weatherData.main.feels_like)}°C
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {weatherData.main.humidity}%
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <Wind className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Wind</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {weatherData.wind.speed} m/s
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Pressure</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {weatherData.main.pressure} hPa
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Visibility</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {(weatherData.visibility / 1000).toFixed(1)} km
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Recommendations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recommended Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getActivityRecommendations(weatherData).map((rec, index) => (
                <div
                  key={index}
                  className="bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors"
                >
                  <div className="text-lg font-medium text-gray-800 mb-1">
                    {rec.activity}
                  </div>
                  <div className="text-sm text-gray-600">
                    {rec.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Forecast */}
          {forecast && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                5-Day Forecast
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {forecast.list.slice(0, 5).map((day, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <div className="text-xs text-gray-600 mb-2">
                      {index === 0 ? 'Today' : 
                       new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.weather[0].main, 'w-6 h-6')}
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {Math.round(day.main.temp)}°C
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {day.weather[0].main}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default WeatherSection;