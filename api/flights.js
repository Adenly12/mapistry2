export default async function handler(req, res) {
  const { origin, destination, depart_date, return_date } = req.query;
  const key = process.env.SERPAPI_KEY;

  if (!origin || !destination || !depart_date || !return_date) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Step 1: Convert city names to IATA codes using autocomplete
    async function getAirportCode(cityName) {
      const r = await fetch(
        `https://serpapi.com/search.json?engine=google_flights_autocomplete&q=${encodeURIComponent(cityName)}&api_key=${key}`
      );
      const d = await r.json();
      // Find first airport suggestion
      const suggestions = d.suggestions || [];
      const airport = suggestions.find(s => s.type === "airport" || s.id?.length === 3);
      if (airport) return airport.id;
      // Fallback: first suggestion id
      return suggestions[0]?.id || null;
    }

    const [originCode, destCode] = await Promise.all([
      getAirportCode(origin),
      getAirportCode(destination),
    ]);

    if (!originCode || !destCode) {
      return res.status(200).json({
        error: "Could not find airport codes",
        price: null,
        airline: null,
        origin_code: originCode,
        dest_code: destCode,
      });
    }

    // Step 2: Search for flights
    const params = new URLSearchParams({
      engine: "google_flights",
      departure_id: originCode,
      arrival_id: destCode,
      outbound_date: depart_date,
      return_date: return_date,
      currency: "USD",
      hl: "en",
      type: "1", // round trip
      travel_class: "1", // economy
      api_key: key,
    });

    const r = await fetch(`https://serpapi.com/search.json?${params}`);
    const data = await r.json();

    if (data.error) {
      return res.status(200).json({ error: data.error, price: null });
    }

    // Get cheapest price from best_flights or other_flights
    const allFlights = [
      ...(data.best_flights || []),
      ...(data.other_flights || []),
    ];

    if (!allFlights.length) {
      return res.status(200).json({ price: null, error: "No flights found" });
    }

    // Sort by price and return the cheapest
    allFlights.sort((a, b) => (a.price || 999999) - (b.price || 999999));
    const cheapest = allFlights[0];
    const airline = cheapest.flights?.[0]?.airline || null;
    const airline_logo = cheapest.flights?.[0]?.airline_logo || null;

    // Also get price insights if available
    const insights = data.price_insights || null;

    res.status(200).json({
      price: cheapest.price,
      airline,
      airline_logo,
      origin_code: originCode,
      dest_code: destCode,
      price_level: insights?.price_level || null, // "low", "typical", "high"
      typical_range: insights?.typical_price_range || null,
      total_duration: cheapest.total_duration || null,
      stops: cheapest.flights?.length > 1 ? cheapest.flights.length - 1 : 0,
    });

  } catch (e) {
    console.error("flights.js error:", e);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
}