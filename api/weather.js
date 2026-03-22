export default async function handler(req, res) {
  const { city, lat, lon, days } = req.query;
  const key = process.env.OPENWEATHER_KEY;
  if (!key) return res.status(500).json({ error: "OpenWeather key not configured" });

  try {
    // Get coordinates if not provided
    let latitude = lat, longitude = lon;
    if (!latitude || !longitude) {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${key}`
      );
      const geoData = await geoRes.json();
      if (!geoData?.length) return res.status(200).json({ error: "City not found" });
      latitude = geoData[0].lat;
      longitude = geoData[0].lon;
    }

    // Get 5-day forecast (free tier gives 5 days / 3hr intervals)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`
    );
    const forecastData = await forecastRes.json();
    if (forecastData.cod !== "200") return res.status(200).json({ error: forecastData.message });

    // Group by day and pick midday reading
    const byDay = {};
    for (const item of forecastData.list) {
      const date = item.dt_txt.split(" ")[0];
      const hour = parseInt(item.dt_txt.split(" ")[1]);
      if (!byDay[date] || Math.abs(hour - 12) < Math.abs(parseInt(byDay[date].dt_txt.split(" ")[1]) - 12)) {
        byDay[date] = item;
      }
    }

    const numDays = parseInt(days) || 5;
    const forecast = Object.values(byDay).slice(0, numDays).map(item => ({
      date: item.dt_txt.split(" ")[0],
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      main: item.weather[0].main, // Rain, Clear, Clouds etc
      humidity: item.main.humidity,
      wind: Math.round(item.wind.speed),
    }));

    res.status(200).json({ forecast, city: forecastData.city.name });
  } catch (e) {
    console.error("weather.js error:", e);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
}