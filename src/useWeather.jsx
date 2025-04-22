import { useState, useEffect } from "react";

const useWeather = (latitude, longitude) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "9a49736e5f974918abb105806252204"; // Replace with your actual WeatherAPI key
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }

        const data = await response.json();

        if (data.error) {
          setError("Failed to fetch weather data.");
        } else {
          setWeather({
            description: data.current.condition.text,
            temperature: data.current.temp_c,
            icon: data.current.condition.icon,
          });
        }
      } catch (err) {
        setError(err.message || "Error fetching weather.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { weather, loading, error };
};

export default useWeather;
