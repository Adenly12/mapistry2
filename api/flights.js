const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_KEY;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

const IATA_LOOKUP = {
  // Virginia / DMV area
  "ronald reagan":"DCA","reagan":"DCA","washington national":"DCA","dca":"DCA",
  "dulles":"IAD","washington dulles":"IAD","iad":"IAD",
  "baltimore washington":"BWI","baltimore":"BWI","bwi":"BWI",
  "richmond":"RIC","richmond international":"RIC","ric":"RIC",
  "norfolk":"ORF","norfolk international":"ORF",
  "charlottesville":"CHO","albemarle":"CHO",
  "roanoke":"ROA","roanoke regional":"ROA",
  "shenandoah valley":"SHD","hagerstown":"HGR",
  // Major US
  "john f kennedy":"JFK","jfk":"JFK","laguardia":"LGA","newark":"EWR",
  "los angeles":"LAX","chicago o'hare":"ORD","ohare":"ORD","midway":"MDW",
  "san francisco":"SFO","miami":"MIA","dallas fort worth":"DFW","dallas":"DFW",
  "hartsfield":"ATL","atlanta":"ATL","boston logan":"BOS","logan":"BOS","boston":"BOS",
  "seattle tacoma":"SEA","seattle":"SEA","denver":"DEN","phoenix sky harbor":"PHX",
  "phoenix":"PHX","las vegas":"LAS","mccarran":"LAS","harry reid":"LAS",
  "houston george bush":"IAH","houston":"IAH","hobby":"HOU",
  "minneapolis":"MSP","portland":"PDX","san diego":"SAN","orlando":"MCO",
  "tampa":"TPA","fort lauderdale":"FLL","nashville":"BNA","charlotte":"CLT",
  "philadelphia":"PHL","detroit":"DTW","new orleans":"MSY","austin":"AUS",
  "san antonio":"SAT","kansas city":"MCI","st louis":"STL","raleigh":"RDU",
  "memphis":"MEM","pittsburgh":"PIT","cleveland":"CLE","indianapolis":"IND",
  "columbus":"CMH","buffalo":"BUF","honolulu":"HNL","maui":"OGG","anchorage":"ANC",
  "toronto pearson":"YYZ","toronto":"YYZ","vancouver":"YVR","montreal":"YUL",
  "calgary":"YYC","mexico city":"MEX","cancun":"CUN",
  // Europe
  "heathrow":"LHR","london heathrow":"LHR","gatwick":"LGW","stansted":"STN","london":"LHR",
  "paris charles de gaulle":"CDG","charles de gaulle":"CDG","orly":"ORY","paris":"CDG",
  "amsterdam schiphol":"AMS","schiphol":"AMS","amsterdam":"AMS",
  "frankfurt":"FRA","munich":"MUC","berlin":"BER","berlin brandenburg":"BER",
  "madrid barajas":"MAD","madrid":"MAD","barcelona":"BCN",
  "rome fiumicino":"FCO","fiumicino":"FCO","rome":"FCO",
  "milan malpensa":"MXP","malpensa":"MXP","milan":"MXP",
  "zurich":"ZRH","vienna":"VIE","brussels":"BRU","lisbon":"LIS","porto":"OPO",
  "athens":"ATH","istanbul":"IST","prague":"PRG","warsaw":"WAW","budapest":"BUD",
  "stockholm arlanda":"ARN","stockholm":"ARN","oslo gardermoen":"OSL","oslo":"OSL",
  "copenhagen":"CPH","helsinki":"HEL","dublin":"DUB","edinburgh":"EDI","manchester":"MAN",
  "nice":"NCE","lyon":"LYS","geneva":"GVA",
  // Asia
  "tokyo narita":"NRT","narita":"NRT","haneda":"HND","tokyo":"NRT",
  "osaka kansai":"KIX","kansai":"KIX","osaka":"KIX","kyoto":"KIX",
  "beijing capital":"PEK","beijing":"PEK","shanghai pudong":"PVG","shanghai":"PVG",
  "hong kong":"HKG","singapore changi":"SIN","changi":"SIN","singapore":"SIN",
  "bangkok suvarnabhumi":"BKK","suvarnabhumi":"BKK","bangkok":"BKK",
  "bali denpasar":"DPS","denpasar":"DPS","bali":"DPS","kuala lumpur":"KUL",
  "seoul incheon":"ICN","incheon":"ICN","seoul":"ICN","taipei":"TPE",
  "manila ninoy":"MNL","manila":"MNL","dubai":"DXB","abu dhabi":"AUH","doha":"DOH",
  "tel aviv":"TLV","ben gurion":"TLV","mumbai":"BOM","delhi":"DEL","bangalore":"BLR",
  "jakarta":"CGK","ho chi minh":"SGN","hanoi":"HAN",
  // Oceania
  "sydney":"SYD","melbourne":"MEL","brisbane":"BNE","perth":"PER",
  "auckland":"AKL","christchurch":"CHC","queenstown":"ZQN",
  // South America
  "buenos aires":"EZE","sao paulo":"GRU","rio de janeiro":"GIG",
  "lima":"LIM","bogota":"BOG","santiago":"SCL",
  // Africa
  "johannesburg":"JNB","cape town":"CPT","nairobi":"NBO",
  "cairo":"CAI","casablanca":"CMN","lagos":"LOS","marrakech":"RAK",
};

function findIataCode(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const [key, code] of Object.entries(IATA_LOOKUP)) {
    if (lower.includes(key)) return code;
  }
  return null;
}

async function getAirportForCity(cityName) {
  // Strategy 1: direct lookup — handles major cities instantly
  const directCode = findIataCode(cityName);
  if (directCode) return { code: directCode, name: cityName, method: "direct" };

  if (!GOOGLE_KEY) return null;

  try {
    // Geocode the city to get coordinates
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${GOOGLE_KEY}`
    );
    const geoData = await geoRes.json();
    if (!geoData.results?.length) return null;

    const { lat, lng } = geoData.results[0].geometry.location;
    const countryCode = geoData.results[0].address_components
      ?.find(c => c.types.includes("country"))?.short_name || "";

    // Strategy 2: nearby search with 150km radius — catches airports near small towns
    const radii = [50000, 100000, 150000];
    for (const radius of radii) {
      const placesRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=airport&key=${GOOGLE_KEY}`
      );
      const placesData = await placesRes.json();
      if (placesData.results?.length) {
        for (const place of placesData.results.slice(0, 10)) {
          const code = findIataCode(place.name);
          if (code) return { code, name: place.name, method: `places_${radius/1000}km` };
        }
      }
    }

    // Strategy 3: text search for "international airport near [city]"
    const textRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=international+airport+near+${encodeURIComponent(cityName)}&key=${GOOGLE_KEY}`
    );
    const textData = await textRes.json();
    if (textData.results?.length) {
      for (const place of textData.results.slice(0, 8)) {
        const code = findIataCode(place.name);
        if (code) return { code, name: place.name, method: "textsearch" };
      }
    }

    // Strategy 4: if US city, try searching the state capital or nearest major city
    if (countryCode === "US") {
      // Extract state from geocode result
      const state = geoData.results[0].address_components
        ?.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "";
      if (state) {
        const stateCode = findIataCode(state);
        if (stateCode) return { code: stateCode, name: `Nearest airport (${state})`, method: "state_fallback" };
        // Try text search for state capital airport
        const stateRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=major+airport+${encodeURIComponent(state)}&key=${GOOGLE_KEY}`
        );
        const stateData = await stateRes.json();
        if (stateData.results?.length) {
          for (const place of stateData.results.slice(0, 5)) {
            const code = findIataCode(place.name);
            if (code) return { code, name: place.name, method: "state_search" };
          }
        }
      }
    }

  } catch (e) {
    console.error("getAirportForCity error:", e);
  }

  return null;
}

export default async function handler(req, res) {
  const { origin, destination, depart_date, return_date } = req.query;

  if (!destination || !depart_date || !return_date) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  if (!SERPAPI_KEY) return res.status(500).json({ error: "Serpapi key not configured" });

  try {
    const [originAirport, destAirport] = await Promise.all([
      origin ? getAirportForCity(origin) : Promise.resolve(null),
      getAirportForCity(destination),
    ]);

    if (!destAirport) {
      return res.status(200).json({ error: `Could not find an airport near ${destination}`, price: null });
    }
    if (origin && !originAirport) {
      return res.status(200).json({ error: `Could not find an airport near ${origin}`, price: null });
    }
    if (!originAirport) {
      return res.status(200).json({
        price: null,
        error: "Add an origin city to see flight prices",
        dest_code: destAirport.code,
        dest_airport: destAirport.name,
      });
    }

    const params = new URLSearchParams({
      engine: "google_flights",
      departure_id: originAirport.code,
      arrival_id: destAirport.code,
      outbound_date: depart_date,
      return_date: return_date,
      currency: "USD",
      hl: "en",
      type: "1",
      travel_class: "1",
      api_key: SERPAPI_KEY,
    });

    const flightRes = await fetch(`https://serpapi.com/search.json?${params}`);
    const data = await flightRes.json();

    if (data.error) {
      return res.status(200).json({
        error: data.error,
        price: null,
        origin_code: originAirport.code,
        dest_code: destAirport.code,
      });
    }

    const allFlights = [...(data.best_flights || []), ...(data.other_flights || [])];
    if (!allFlights.length) {
      return res.status(200).json({
        price: null,
        error: "No flights found for these dates",
        origin_code: originAirport.code,
        dest_code: destAirport.code,
      });
    }

    allFlights.sort((a, b) => (a.price || 999999) - (b.price || 999999));
    const cheapest = allFlights[0];
    const insights = data.price_insights || null;

    res.status(200).json({
      price: cheapest.price,
      airline: cheapest.flights?.[0]?.airline || null,
      airline_logo: cheapest.flights?.[0]?.airline_logo || null,
      origin_code: originAirport.code,
      dest_code: destAirport.code,
      origin_airport: originAirport.name,
      dest_airport: destAirport.name,
      price_level: insights?.price_level || null,
      typical_range: insights?.typical_price_range || null,
      total_duration: cheapest.total_duration || null,
      stops: cheapest.flights?.length > 1 ? cheapest.flights.length - 1 : 0,
    });

  } catch (e) {
    console.error("flights.js error:", e);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
}