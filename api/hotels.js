const SERPAPI_KEY = process.env.SERPAPI_KEY;

// ── KNOWN CITY RATES (instant, no API call) ──────────────────
const CITY_RATES = {
  // Virginia / DMV
  "charlottesville":110,"richmond":120,"norfolk":105,"virginia beach":115,
  "roanoke":95,"washington dc":180,"washington":180,"arlington":165,
  "alexandria":155,"lorton":120,"fairfax":140,"tysons":150,
  // North America
  "new york":220,"new york city":220,"nyc":220,
  "los angeles":190,"san francisco":210,"miami":185,"chicago":175,
  "las vegas":130,"orlando":120,"boston":195,"seattle":185,
  "nashville":160,"austin":165,"denver":155,"new orleans":155,
  "atlanta":150,"portland":155,"san diego":175,"phoenix":130,
  "dallas":145,"houston":140,"charlotte":135,"minneapolis":140,
  "honolulu":230,"toronto":170,"vancouver":175,"montreal":150,
  "mexico city":90,"cancun":110,"guadalajara":80,
  // Europe
  "london":195,"paris":185,"rome":160,"barcelona":150,
  "madrid":140,"amsterdam":170,"berlin":130,"prague":90,
  "vienna":145,"lisbon":120,"athens":110,"budapest":85,
  "dublin":175,"edinburgh":160,"copenhagen":185,
  "stockholm":180,"oslo":210,"helsinki":165,"zurich":240,
  "geneva":235,"milan":165,"venice":185,"florence":155,
  "munich":160,"brussels":145,"porto":105,"seville":120,
  "dubrovnik":130,"santorini":175,"mykonos":190,
  "reykjavik":200,"warsaw":85,"krakow":75,"riga":70,
  "tallinn":80,"vilnius":70,"sofia":60,"bucharest":65,
  "belgrade":70,"zagreb":80,"sarajevo":65,
  // Asia
  "tokyo":165,"kyoto":145,"osaka":130,"beijing":110,
  "shanghai":120,"hong kong":180,"singapore":195,
  "bangkok":65,"phuket":75,"bali":70,"jakarta":75,
  "kuala lumpur":80,"seoul":130,"taipei":100,"manila":70,
  "dubai":175,"abu dhabi":160,"doha":155,"istanbul":95,
  "tel aviv":165,"mumbai":100,"delhi":85,"bangalore":90,
  "kathmandu":55,"colombo":70,"yangon":60,"phnom penh":55,
  "vientiane":50,"hanoi":60,"ho chi minh":65,
  // Oceania
  "sydney":190,"melbourne":175,"brisbane":155,
  "auckland":165,"queenstown":155,"christchurch":130,
  // South America
  "buenos aires":90,"rio de janeiro":100,"sao paulo":95,
  "lima":85,"bogota":75,"cartagena":95,"cusco":80,"santiago":100,
  // Africa
  "cape town":110,"marrakech":85,"cairo":75,
  "nairobi":90,"casablanca":80,"lagos":70,
};

// Regional fallbacks by country code
const COUNTRY_RATES = {
  "US":140,"CA":155,"MX":80,"GB":170,"FR":155,"DE":130,"IT":140,
  "ES":125,"PT":110,"NL":155,"BE":135,"CH":210,"AT":135,"GR":100,
  "PL":75,"CZ":80,"HU":80,"RO":60,"BG":55,"HR":90,"RS":65,
  "SE":160,"NO":190,"DK":170,"FI":150,"IE":160,"IS":180,
  "TR":85,"IL":150,"AE":165,"QA":145,"SA":110,"JO":90,"LB":95,
  "JP":150,"CN":105,"HK":175,"SG":190,"TH":65,"ID":65,"MY":75,
  "PH":65,"VN":60,"KH":50,"LA":50,"MM":55,"KR":125,"TW":95,
  "IN":80,"LK":65,"NP":50,"PK":60,"BD":55,"AU":175,"NZ":155,
  "AR":85,"BR":90,"CL":95,"CO":70,"PE":80,"EC":65,"BO":55,
  "PY":55,"UY":85,"VE":50,
  "ZA":95,"KE":80,"TZ":70,"ET":60,"GH":65,"SN":60,"CI":65,
  "MA":80,"EG":70,"TN":65,"NG":65,"RW":80,"UG":60,
  "RU":80,"UA":55,"KZ":70,"UZ":50,"GE":75,"AM":65,"AZ":70,
};

function getKnownRate(city) {
  if (!city) return null;
  const lower = city.toLowerCase().trim();
  if (CITY_RATES[lower]) return { rate: CITY_RATES[lower], method: "exact" };
  for (const [key, rate] of Object.entries(CITY_RATES)) {
    if (lower.includes(key) || key.includes(lower)) return { rate, method: "partial" };
  }
  return null;
}

async function getLiveHotelRate(city, checkIn, checkOut) {
  if (!SERPAPI_KEY) return null;
  try {
    const params = new URLSearchParams({
      engine: "google_hotels",
      q: `hotels in ${city}`,
      check_in_date: checkIn,
      check_out_date: checkOut,
      currency: "USD",
      hl: "en",
      gl: "us",
      api_key: SERPAPI_KEY,
    });

    const res = await fetch(`https://serpapi.com/search.json?${params}`);
    const data = await res.json();

    if (data.error || !data.properties?.length) return null;

    // Collect nightly rates from mid-range properties
    // Filter out extreme outliers (hostels <$20, ultra-luxury >$800)
    const rates = data.properties
      .map(p => p.rate_per_night?.extracted_lowest || p.rate_per_night?.lowest)
      .filter(r => typeof r === "number" && r >= 20 && r <= 800);

    if (!rates.length) return null;

    // Sort and take the middle 60% to get a representative mid-range average
    rates.sort((a, b) => a - b);
    const trim = Math.floor(rates.length * 0.2);
    const midRates = rates.slice(trim, rates.length - trim);
    const avg = Math.round(midRates.reduce((s, r) => s + r, 0) / midRates.length);

    return { rate: avg, count: rates.length, method: "live" };
  } catch (e) {
    console.error("getLiveHotelRate error:", e);
    return null;
  }
}

export default async function handler(req, res) {
  const { city, nights, check_in_date, check_out_date } = req.query;
  const country_code = req.query.country_code || "";

  if (!city) return res.status(400).json({ error: "Missing city" });

  const nightsNum = parseInt(nights) || 1;

  // Strategy 1: Known city table — instant, no API
  const known = getKnownRate(city);
  if (known) {
    return res.status(200).json({
      nightly: known.rate,
      total: known.rate * nightsNum,
      nights: nightsNum,
      city,
      note: `~$${known.rate}/night · mid-range estimate`,
      source: "estimate",
      method: known.method,
    });
  }

  // Strategy 2: Live Serpapi Google Hotels data
  if (check_in_date && check_out_date) {
    const live = await getLiveHotelRate(city, check_in_date, check_out_date);
    if (live) {
      return res.status(200).json({
        nightly: live.rate,
        total: live.rate * nightsNum,
        nights: nightsNum,
        city,
        note: `~$${live.rate}/night · avg of ${live.count} hotels`,
        source: "live",
        method: "serpapi",
      });
    }
  }

  // Strategy 3: Country-based fallback
  const countryRate = country_code ? COUNTRY_RATES[country_code.toUpperCase()] : null;
  if (countryRate) {
    return res.status(200).json({
      nightly: countryRate,
      total: countryRate * nightsNum,
      nights: nightsNum,
      city,
      note: `~$${countryRate}/night · regional estimate`,
      source: "estimate",
      method: "country",
    });
  }

  // Strategy 4: Global default
  const defaultRate = 120;
  res.status(200).json({
    nightly: defaultRate,
    total: defaultRate * nightsNum,
    nights: nightsNum,
    city,
    note: `~$${defaultRate}/night · global average estimate`,
    source: "estimate",
    method: "default",
  });
}