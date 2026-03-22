export default async function handler(req, res) {
  const { city, days } = req.query;
  const key = process.env.OPENWEATHER_KEY;
  if (!key) return res.status(200).json({ error: "OpenWeather key not configured" });

  try {
    // Step 1: Geocode city name to lat/lng
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${key}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    console.log("Geo response for", city, ":", JSON.stringify(geoData).slice(0, 200));

    if (!Array.isArray(geoData) || !geoData.length) {
      // Try stripping everything after comma (e.g. "Paris, France" -> "Paris")
      const simpleName = city.split(",")[0].trim();
      const geoRes2 = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(simpleName)}&limit=5&appid=${key}`);
      const geoData2 = await geoRes2.json();
      if (!Array.isArray(geoData2) || !geoData2.length) {
        return res.status(200).json({ error: `City not found: ${city}` });
      }
      geoData.push(...geoData2);
    }

    const { lat, lon, name } = geoData[0];

    // Step 2: Get forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    if (forecastData.cod !== "200") {
      return res.status(200).json({ error: forecastData.message || "Forecast failed" });
    }

    // Group readings by date, pick the one closest to noon
    const byDay = {};
    for (const item of forecastData.list) {
      const date = item.dt_txt.split(" ")[0];
      const timePart = item.dt_txt.split(" ")[1] || "00:00:00";
      const hour = parseInt(timePart.split(":")[0]);
      if (!byDay[date]) {
        byDay[date] = { item, hour };
      } else {
        const prevDiff = Math.abs(byDay[date].hour - 12);
        const currDiff = Math.abs(hour - 12);
        if (currDiff < prevDiff) byDay[date] = { item, hour };
      }
    }

    const numDays = Math.min(parseInt(days) || 5, 7);
    const forecast = Object.values(byDay).slice(0, numDays).map(({ item }) => ({
      date: item.dt_txt.split(" ")[0],
      temp: Math.round(item.main.temp),
      low: Math.round(item.main.temp_min),
      high: Math.round(item.main.temp_max),
      feels_like: Math.round(item.main.feels_like),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      main: item.weather[0].main,
      humidity: item.main.humidity,
      wind: Math.round(item.wind.speed),
      pop: Math.round((item.pop || 0) * 100), // probability of precipitation %
    }));

    res.status(200).json({ forecast, city: name || forecastData.city?.name || city });
  } catch (e) {
    console.error("weather.js error:", e);
    res.status(500).json({ error: "Failed to fetch weather: " + e.message });
  }
}