// Hotel cost estimates by city tier
// Based on average mid-range (3-star) nightly hotel rates
// Organized by city for accuracy, with regional fallbacks

const CITY_RATES = {
  // North America
  "new york": 220, "new york city": 220, "nyc": 220,
  "los angeles": 190, "la": 190,
  "san francisco": 210, "miami": 185, "chicago": 175,
  "las vegas": 130, "orlando": 120, "washington": 180,
  "washington dc": 180, "boston": 195, "seattle": 185,
  "nashville": 160, "austin": 165, "denver": 155,
  "new orleans": 155, "atlanta": 150, "portland": 155,
  "san diego": 175, "phoenix": 130, "dallas": 145,
  "houston": 140, "charlotte": 135, "minneapolis": 140,
  "honolulu": 230, "toronto": 170, "vancouver": 175,
  "montreal": 150, "mexico city": 90, "cancun": 110,

  // Europe
  "london": 195, "paris": 185, "rome": 160,
  "barcelona": 150, "madrid": 140, "amsterdam": 170,
  "berlin": 130, "prague": 90, "vienna": 145,
  "lisbon": 120, "athens": 110, "budapest": 85,
  "dublin": 175, "edinburgh": 160, "copenhagen": 185,
  "stockholm": 180, "oslo": 210, "helsinki": 165,
  "zurich": 240, "geneva": 235, "milan": 165,
  "venice": 185, "florence": 155, "munich": 160,
  "brussels": 145, "porto": 105, "seville": 120,
  "dubrovnik": 130, "santorini": 175, "mykonos": 190,
  "reykjavik": 200, "warsaw": 85, "krakow": 75,

  // Asia
  "tokyo": 165, "kyoto": 145, "osaka": 130,
  "beijing": 110, "shanghai": 120, "hong kong": 180,
  "singapore": 195, "bangkok": 65, "phuket": 75,
  "bali": 70, "jakarta": 75, "kuala lumpur": 80,
  "seoul": 130, "taipei": 100, "manila": 70,
  "dubai": 175, "abu dhabi": 160, "doha": 155,
  "istanbul": 95, "tel aviv": 165, "jerusalem": 140,
  "mumbai": 100, "delhi": 85, "bangalore": 90,
  "kathmandu": 55,

  // Oceania
  "sydney": 190, "melbourne": 175, "brisbane": 155,
  "auckland": 165, "queenstown": 155,

  // South America
  "buenos aires": 90, "rio de janeiro": 100,
  "sao paulo": 95, "lima": 85, "bogota": 75,
  "cartagena": 95, "cusco": 80, "santiago": 100,

  // Africa
  "cape town": 110, "marrakech": 85, "cairo": 75,
  "nairobi": 90,
};

// Regional fallbacks (rough averages by region)
const REGION_FALLBACKS = {
  "western europe": 155,
  "eastern europe": 85,
  "north america": 160,
  "southeast asia": 75,
  "east asia": 140,
  "middle east": 150,
  "south america": 90,
  "africa": 90,
  "oceania": 175,
  "default": 120,
};

function getHotelRate(city) {
  if (!city) return REGION_FALLBACKS.default;
  const lower = city.toLowerCase().trim();
  // Direct match
  if (CITY_RATES[lower]) return CITY_RATES[lower];
  // Partial match
  for (const [key, rate] of Object.entries(CITY_RATES)) {
    if (lower.includes(key) || key.includes(lower)) return rate;
  }
  return REGION_FALLBACKS.default;
}

export default async function handler(req, res) {
  const { city, nights } = req.query;

  if (!city) {
    return res.status(400).json({ error: "Missing city parameter" });
  }

  const nightsNum = parseInt(nights) || 1;
  const nightly = getHotelRate(city);
  const total = nightly * nightsNum;

  // Provide context on the estimate
  const cityLower = city.toLowerCase();
  let priceContext = "mid-range estimate";
  if (nightly >= 200) priceContext = "expensive city — prices vary widely";
  else if (nightly >= 150) priceContext = "above average city costs";
  else if (nightly <= 80) priceContext = "affordable destination";

  res.status(200).json({
    nightly,
    total,
    nights: nightsNum,
    city,
    note: `~$${nightly}/night · ${priceContext}`,
    source: "estimate", // flag that this is an estimate, not live data
  });
}