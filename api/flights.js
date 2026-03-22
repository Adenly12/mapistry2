const GOOGLE_KEY = process.env.GOOGLE_KEY;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

const AIRPORTS = [
  // North America - US East
  {code:"JFK",lat:40.6413,lng:-73.7781,name:"New York JFK"},
  {code:"LGA",lat:40.7772,lng:-73.8726,name:"New York LaGuardia"},
  {code:"EWR",lat:40.6895,lng:-74.1745,name:"Newark"},
  {code:"BOS",lat:42.3656,lng:-71.0096,name:"Boston Logan"},
  {code:"PHL",lat:39.8729,lng:-75.2437,name:"Philadelphia"},
  {code:"BWI",lat:39.1754,lng:-76.6683,name:"Baltimore BWI"},
  {code:"DCA",lat:38.8512,lng:-77.0402,name:"Washington Reagan"},
  {code:"IAD",lat:38.9531,lng:-77.4565,name:"Washington Dulles"},
  {code:"RIC",lat:37.5052,lng:-77.3197,name:"Richmond"},
  {code:"CHO",lat:38.1386,lng:-78.4529,name:"Charlottesville"},
  {code:"ORF",lat:36.8976,lng:-76.0173,name:"Norfolk"},
  {code:"ROA",lat:37.3255,lng:-79.9754,name:"Roanoke"},
  {code:"CLT",lat:35.2140,lng:-80.9431,name:"Charlotte"},
  {code:"RDU",lat:35.8776,lng:-78.7875,name:"Raleigh Durham"},
  {code:"ATL",lat:33.6407,lng:-84.4277,name:"Atlanta Hartsfield"},
  {code:"MCO",lat:28.4312,lng:-81.3081,name:"Orlando"},
  {code:"MIA",lat:25.7959,lng:-80.2870,name:"Miami"},
  {code:"FLL",lat:26.0726,lng:-80.1527,name:"Fort Lauderdale"},
  {code:"TPA",lat:27.9755,lng:-82.5332,name:"Tampa"},
  {code:"MSY",lat:29.9934,lng:-90.2580,name:"New Orleans"},
  {code:"BNA",lat:36.1245,lng:-86.6782,name:"Nashville"},
  {code:"MEM",lat:35.0424,lng:-89.9767,name:"Memphis"},
  {code:"JAX",lat:30.4941,lng:-81.6879,name:"Jacksonville"},
  {code:"BHM",lat:33.5629,lng:-86.7535,name:"Birmingham"},
  // North America - US Midwest
  {code:"ORD",lat:41.9742,lng:-87.9073,name:"Chicago O'Hare"},
  {code:"MDW",lat:41.7868,lng:-87.7522,name:"Chicago Midway"},
  {code:"DTW",lat:42.2162,lng:-83.3554,name:"Detroit"},
  {code:"CLE",lat:41.4117,lng:-81.8498,name:"Cleveland"},
  {code:"PIT",lat:40.4915,lng:-80.2329,name:"Pittsburgh"},
  {code:"CMH",lat:39.9980,lng:-82.8919,name:"Columbus"},
  {code:"IND",lat:39.7173,lng:-86.2944,name:"Indianapolis"},
  {code:"CVG",lat:39.0488,lng:-84.6678,name:"Cincinnati"},
  {code:"MKE",lat:42.9472,lng:-87.8966,name:"Milwaukee"},
  {code:"MSP",lat:44.8848,lng:-93.2223,name:"Minneapolis"},
  {code:"STL",lat:38.7487,lng:-90.3700,name:"St Louis"},
  {code:"MCI",lat:39.2976,lng:-94.7139,name:"Kansas City"},
  {code:"OMA",lat:41.3032,lng:-95.8941,name:"Omaha"},
  // North America - US West
  {code:"LAX",lat:33.9425,lng:-118.4081,name:"Los Angeles"},
  {code:"SFO",lat:37.6213,lng:-122.3790,name:"San Francisco"},
  {code:"SJC",lat:37.3626,lng:-121.9290,name:"San Jose"},
  {code:"OAK",lat:37.7213,lng:-122.2208,name:"Oakland"},
  {code:"SEA",lat:47.4502,lng:-122.3088,name:"Seattle Tacoma"},
  {code:"PDX",lat:45.5898,lng:-122.5951,name:"Portland"},
  {code:"LAS",lat:36.0840,lng:-115.1537,name:"Las Vegas"},
  {code:"PHX",lat:33.4373,lng:-112.0078,name:"Phoenix"},
  {code:"DEN",lat:39.8561,lng:-104.6737,name:"Denver"},
  {code:"SLC",lat:40.7899,lng:-111.9791,name:"Salt Lake City"},
  {code:"ABQ",lat:35.0402,lng:-106.6090,name:"Albuquerque"},
  {code:"SAT",lat:29.5337,lng:-98.4698,name:"San Antonio"},
  {code:"AUS",lat:30.1975,lng:-97.6664,name:"Austin"},
  {code:"DFW",lat:32.8998,lng:-97.0403,name:"Dallas Fort Worth"},
  {code:"DAL",lat:32.8471,lng:-96.8518,name:"Dallas Love"},
  {code:"IAH",lat:29.9902,lng:-95.3368,name:"Houston Bush"},
  {code:"HOU",lat:29.6454,lng:-95.2789,name:"Houston Hobby"},
  {code:"SAN",lat:32.7336,lng:-117.1897,name:"San Diego"},
  {code:"SMF",lat:38.6954,lng:-121.5908,name:"Sacramento"},
  {code:"HNL",lat:21.3245,lng:-157.9251,name:"Honolulu"},
  {code:"OGG",lat:20.8986,lng:-156.4305,name:"Maui"},
  {code:"ANC",lat:61.1743,lng:-149.9963,name:"Anchorage"},
  // Canada
  {code:"YYZ",lat:43.6777,lng:-79.6248,name:"Toronto Pearson"},
  {code:"YVR",lat:49.1967,lng:-123.1815,name:"Vancouver"},
  {code:"YUL",lat:45.4706,lng:-73.7408,name:"Montreal"},
  {code:"YYC",lat:51.1315,lng:-114.0106,name:"Calgary"},
  {code:"YEG",lat:53.3097,lng:-113.5827,name:"Edmonton"},
  {code:"YOW",lat:45.3225,lng:-75.6692,name:"Ottawa"},
  {code:"YHZ",lat:44.8808,lng:-63.5086,name:"Halifax"},
  // Mexico & Caribbean
  {code:"MEX",lat:19.4363,lng:-99.0721,name:"Mexico City"},
  {code:"CUN",lat:21.0365,lng:-86.8771,name:"Cancun"},
  {code:"GDL",lat:20.5218,lng:-103.3111,name:"Guadalajara"},
  {code:"MTY",lat:25.7749,lng:-100.1069,name:"Monterrey"},
  {code:"SJD",lat:23.1518,lng:-109.7210,name:"Los Cabos"},
  {code:"PVR",lat:20.6801,lng:-105.2544,name:"Puerto Vallarta"},
  {code:"MBJ",lat:18.5037,lng:-77.9134,name:"Montego Bay"},
  {code:"NAS",lat:25.0390,lng:-77.4662,name:"Nassau"},
  {code:"SJU",lat:18.4394,lng:-66.0018,name:"San Juan"},
  {code:"HAV",lat:22.9892,lng:-82.4091,name:"Havana"},
  // UK & Ireland
  {code:"LHR",lat:51.4700,lng:-0.4543,name:"London Heathrow"},
  {code:"LGW",lat:51.1481,lng:-0.1903,name:"London Gatwick"},
  {code:"STN",lat:51.8850,lng:0.2350,name:"London Stansted"},
  {code:"MAN",lat:53.3537,lng:-2.2750,name:"Manchester"},
  {code:"BHX",lat:52.4539,lng:-1.7480,name:"Birmingham"},
  {code:"EDI",lat:55.9500,lng:-3.3725,name:"Edinburgh"},
  {code:"GLA",lat:55.8719,lng:-4.4331,name:"Glasgow"},
  {code:"DUB",lat:53.4213,lng:-6.2701,name:"Dublin"},
  // France
  {code:"CDG",lat:49.0097,lng:2.5479,name:"Paris Charles de Gaulle"},
  {code:"ORY",lat:48.7233,lng:2.3794,name:"Paris Orly"},
  {code:"NCE",lat:43.6584,lng:7.2159,name:"Nice"},
  {code:"LYS",lat:45.7256,lng:5.0811,name:"Lyon"},
  {code:"MRS",lat:43.4393,lng:5.2214,name:"Marseille"},
  {code:"TLS",lat:43.6293,lng:1.3638,name:"Toulouse"},
  {code:"BOD",lat:44.8283,lng:-0.7156,name:"Bordeaux"},
  // Germany
  {code:"FRA",lat:50.0379,lng:8.5622,name:"Frankfurt"},
  {code:"MUC",lat:48.3537,lng:11.7750,name:"Munich"},
  {code:"BER",lat:52.3667,lng:13.5033,name:"Berlin Brandenburg"},
  {code:"HAM",lat:53.6304,lng:9.9882,name:"Hamburg"},
  {code:"DUS",lat:51.2895,lng:6.7668,name:"Dusseldorf"},
  {code:"STR",lat:48.6899,lng:9.2220,name:"Stuttgart"},
  // Spain & Portugal
  {code:"MAD",lat:40.4839,lng:-3.5680,name:"Madrid Barajas"},
  {code:"BCN",lat:41.2971,lng:2.0785,name:"Barcelona"},
  {code:"AGP",lat:36.6749,lng:-4.4991,name:"Malaga"},
  {code:"PMI",lat:39.5517,lng:2.7388,name:"Palma Mallorca"},
  {code:"VLC",lat:39.4893,lng:-0.4816,name:"Valencia"},
  {code:"SVQ",lat:37.4180,lng:-5.8931,name:"Seville"},
  {code:"LIS",lat:38.7742,lng:-9.1342,name:"Lisbon"},
  {code:"OPO",lat:41.2481,lng:-8.6814,name:"Porto"},
  {code:"FAO",lat:37.0144,lng:-7.9659,name:"Faro"},
  // Italy
  {code:"FCO",lat:41.8003,lng:12.2389,name:"Rome Fiumicino"},
  {code:"MXP",lat:45.6306,lng:8.7281,name:"Milan Malpensa"},
  {code:"LIN",lat:45.4451,lng:9.2765,name:"Milan Linate"},
  {code:"VCE",lat:45.5053,lng:12.3519,name:"Venice"},
  {code:"FLR",lat:43.8100,lng:11.2051,name:"Florence"},
  {code:"NAP",lat:40.8860,lng:14.2908,name:"Naples"},
  {code:"BLQ",lat:44.5354,lng:11.2887,name:"Bologna"},
  // Netherlands, Belgium, Switzerland, Austria
  {code:"AMS",lat:52.3086,lng:4.7639,name:"Amsterdam Schiphol"},
  {code:"BRU",lat:50.9014,lng:4.4844,name:"Brussels"},
  {code:"ZRH",lat:47.4647,lng:8.5492,name:"Zurich"},
  {code:"GVA",lat:46.2381,lng:6.1089,name:"Geneva"},
  {code:"VIE",lat:48.1103,lng:16.5697,name:"Vienna"},
  {code:"SZG",lat:47.7933,lng:13.0043,name:"Salzburg"},
  // Scandinavia
  {code:"ARN",lat:59.6519,lng:17.9186,name:"Stockholm Arlanda"},
  {code:"OSL",lat:60.1939,lng:11.1004,name:"Oslo Gardermoen"},
  {code:"CPH",lat:55.6180,lng:12.6508,name:"Copenhagen"},
  {code:"HEL",lat:60.3172,lng:24.9633,name:"Helsinki"},
  {code:"KEF",lat:63.9850,lng:-22.6057,name:"Reykjavik"},
  // Eastern Europe
  {code:"WAW",lat:52.1657,lng:20.9671,name:"Warsaw"},
  {code:"KRK",lat:50.0777,lng:19.7848,name:"Krakow"},
  {code:"PRG",lat:50.1008,lng:14.2600,name:"Prague"},
  {code:"BUD",lat:47.4298,lng:19.2611,name:"Budapest"},
  {code:"OTP",lat:44.5711,lng:26.0858,name:"Bucharest"},
  {code:"SOF",lat:42.6967,lng:23.4114,name:"Sofia"},
  {code:"ATH",lat:37.9364,lng:23.9445,name:"Athens"},
  {code:"SKG",lat:40.5197,lng:22.9709,name:"Thessaloniki"},
  {code:"ZAG",lat:45.7429,lng:16.0688,name:"Zagreb"},
  {code:"BEG",lat:44.8184,lng:20.3091,name:"Belgrade"},
  {code:"LJU",lat:46.2237,lng:14.4576,name:"Ljubljana"},
  {code:"DBV",lat:42.5614,lng:18.2682,name:"Dubrovnik"},
  {code:"SPU",lat:43.5389,lng:16.2980,name:"Split"},
  {code:"RIX",lat:56.9236,lng:23.9711,name:"Riga"},
  {code:"TLL",lat:59.4133,lng:24.8328,name:"Tallinn"},
  {code:"VNO",lat:54.6341,lng:25.2858,name:"Vilnius"},
  {code:"KBP",lat:50.3450,lng:30.8947,name:"Kyiv"},
  {code:"SVO",lat:55.9726,lng:37.4146,name:"Moscow Sheremetyevo"},
  {code:"LED",lat:59.8003,lng:30.2625,name:"St Petersburg"},
  // Middle East & Turkey
  {code:"IST",lat:41.2608,lng:28.7418,name:"Istanbul"},
  {code:"AYT",lat:36.8987,lng:30.8005,name:"Antalya"},
  {code:"ADB",lat:38.2924,lng:27.1570,name:"Izmir"},
  {code:"DXB",lat:25.2532,lng:55.3657,name:"Dubai"},
  {code:"AUH",lat:24.4330,lng:54.6511,name:"Abu Dhabi"},
  {code:"DOH",lat:25.2731,lng:51.6081,name:"Doha"},
  {code:"KWI",lat:29.2266,lng:47.9689,name:"Kuwait City"},
  {code:"RUH",lat:24.9576,lng:46.6988,name:"Riyadh"},
  {code:"JED",lat:21.6796,lng:39.1565,name:"Jeddah"},
  {code:"AMM",lat:31.7226,lng:35.9932,name:"Amman"},
  {code:"BEY",lat:33.8208,lng:35.4883,name:"Beirut"},
  {code:"TLV",lat:32.0114,lng:34.8867,name:"Tel Aviv"},
  {code:"IKA",lat:35.4161,lng:51.1522,name:"Tehran"},
  // South Asia
  {code:"DEL",lat:28.5562,lng:77.1000,name:"Delhi"},
  {code:"BOM",lat:19.0896,lng:72.8656,name:"Mumbai"},
  {code:"BLR",lat:13.1979,lng:77.7063,name:"Bangalore"},
  {code:"MAA",lat:12.9900,lng:80.1693,name:"Chennai"},
  {code:"HYD",lat:17.2313,lng:78.4298,name:"Hyderabad"},
  {code:"CCU",lat:22.6547,lng:88.4467,name:"Kolkata"},
  {code:"CMB",lat:7.1808,lng:79.8841,name:"Colombo"},
  {code:"KTM",lat:27.6966,lng:85.3591,name:"Kathmandu"},
  {code:"DAC",lat:23.8433,lng:90.3979,name:"Dhaka"},
  {code:"KHI",lat:24.9065,lng:67.1608,name:"Karachi"},
  {code:"ISB",lat:33.6167,lng:73.0997,name:"Islamabad"},
  // East Asia
  {code:"PEK",lat:40.0799,lng:116.6031,name:"Beijing Capital"},
  {code:"PVG",lat:31.1443,lng:121.8083,name:"Shanghai Pudong"},
  {code:"SHA",lat:31.1981,lng:121.3364,name:"Shanghai Hongqiao"},
  {code:"CAN",lat:23.3924,lng:113.2988,name:"Guangzhou"},
  {code:"SZX",lat:22.6393,lng:113.8107,name:"Shenzhen"},
  {code:"CTU",lat:30.5785,lng:103.9470,name:"Chengdu"},
  {code:"HKG",lat:22.3080,lng:113.9185,name:"Hong Kong"},
  {code:"NRT",lat:35.7647,lng:140.3864,name:"Tokyo Narita"},
  {code:"HND",lat:35.5494,lng:139.7798,name:"Tokyo Haneda"},
  {code:"KIX",lat:34.4274,lng:135.2440,name:"Osaka Kansai"},
  {code:"NGO",lat:34.8583,lng:136.8054,name:"Nagoya"},
  {code:"CTS",lat:42.7752,lng:141.6922,name:"Sapporo"},
  {code:"ICN",lat:37.4602,lng:126.4407,name:"Seoul Incheon"},
  {code:"GMP",lat:37.5583,lng:126.7906,name:"Seoul Gimpo"},
  {code:"TPE",lat:25.0777,lng:121.2328,name:"Taipei Taoyuan"},
  {code:"MNL",lat:14.5086,lng:121.0197,name:"Manila"},
  {code:"CEB",lat:10.3075,lng:123.9795,name:"Cebu"},
  // Southeast Asia
  {code:"SIN",lat:1.3644,lng:103.9915,name:"Singapore Changi"},
  {code:"BKK",lat:13.6811,lng:100.7472,name:"Bangkok Suvarnabhumi"},
  {code:"DMK",lat:13.9126,lng:100.6067,name:"Bangkok Don Mueang"},
  {code:"HKT",lat:8.1132,lng:98.3169,name:"Phuket"},
  {code:"CNX",lat:18.7668,lng:98.9626,name:"Chiang Mai"},
  {code:"KUL",lat:2.7456,lng:101.7099,name:"Kuala Lumpur"},
  {code:"CGK",lat:-6.1256,lng:106.6559,name:"Jakarta"},
  {code:"DPS",lat:-8.7482,lng:115.1670,name:"Bali Denpasar"},
  {code:"SGN",lat:10.8188,lng:106.6520,name:"Ho Chi Minh City"},
  {code:"HAN",lat:21.2187,lng:105.8044,name:"Hanoi"},
  {code:"DAD",lat:16.0439,lng:108.1992,name:"Da Nang"},
  {code:"RGN",lat:16.9073,lng:96.1332,name:"Yangon"},
  {code:"PNH",lat:11.5466,lng:104.8440,name:"Phnom Penh"},
  {code:"REP",lat:13.4107,lng:103.8129,name:"Siem Reap"},
  {code:"VTE",lat:17.9883,lng:102.5633,name:"Vientiane"},
  // Central Asia & Caucasus
  {code:"ALA",lat:43.3521,lng:77.0404,name:"Almaty"},
  {code:"TSE",lat:51.0223,lng:71.4669,name:"Astana"},
  {code:"TAS",lat:41.2579,lng:69.2812,name:"Tashkent"},
  {code:"TBS",lat:41.6693,lng:44.9547,name:"Tbilisi"},
  {code:"EVN",lat:40.1473,lng:44.3959,name:"Yerevan"},
  {code:"GYD",lat:40.4675,lng:50.0467,name:"Baku"},
  {code:"ULN",lat:47.8431,lng:106.7664,name:"Ulaanbaatar"},
  // Oceania
  {code:"SYD",lat:-33.9399,lng:151.1753,name:"Sydney"},
  {code:"MEL",lat:-37.6690,lng:144.8410,name:"Melbourne"},
  {code:"BNE",lat:-27.3842,lng:153.1175,name:"Brisbane"},
  {code:"PER",lat:-31.9403,lng:115.9669,name:"Perth"},
  {code:"ADL",lat:-34.9450,lng:138.5306,name:"Adelaide"},
  {code:"CNS",lat:-16.8858,lng:145.7557,name:"Cairns"},
  {code:"AKL",lat:-37.0082,lng:174.7850,name:"Auckland"},
  {code:"CHC",lat:-43.4894,lng:172.5322,name:"Christchurch"},
  {code:"WLG",lat:-41.3272,lng:174.8052,name:"Wellington"},
  {code:"ZQN",lat:-45.0211,lng:168.7392,name:"Queenstown"},
  {code:"NAN",lat:-17.7554,lng:177.4432,name:"Nadi Fiji"},
  // South America
  {code:"GRU",lat:-23.4356,lng:-46.4731,name:"Sao Paulo Guarulhos"},
  {code:"GIG",lat:-22.8099,lng:-43.2505,name:"Rio de Janeiro"},
  {code:"BSB",lat:-15.8711,lng:-47.9186,name:"Brasilia"},
  {code:"EZE",lat:-34.8222,lng:-58.5358,name:"Buenos Aires Ezeiza"},
  {code:"SCL",lat:-33.3930,lng:-70.7858,name:"Santiago"},
  {code:"LIM",lat:-12.0219,lng:-77.1143,name:"Lima"},
  {code:"BOG",lat:4.7016,lng:-74.1469,name:"Bogota"},
  {code:"MDE",lat:6.1645,lng:-75.4231,name:"Medellin"},
  {code:"CTG",lat:10.4424,lng:-75.5130,name:"Cartagena"},
  {code:"UIO",lat:-0.1292,lng:-78.3575,name:"Quito"},
  {code:"CUZ",lat:-13.5357,lng:-71.9388,name:"Cusco"},
  {code:"MVD",lat:-34.8384,lng:-56.0308,name:"Montevideo"},
  {code:"ASU",lat:-25.2398,lng:-57.5198,name:"Asuncion"},
  // Africa
  {code:"JNB",lat:-26.1392,lng:28.2460,name:"Johannesburg"},
  {code:"CPT",lat:-33.9715,lng:18.6021,name:"Cape Town"},
  {code:"NBO",lat:-1.3192,lng:36.9275,name:"Nairobi"},
  {code:"ADD",lat:8.9779,lng:38.7993,name:"Addis Ababa"},
  {code:"DAR",lat:-6.8781,lng:39.2026,name:"Dar es Salaam"},
  {code:"EBB",lat:0.0424,lng:32.4435,name:"Entebbe"},
  {code:"KGL",lat:-1.9686,lng:30.1395,name:"Kigali"},
  {code:"LOS",lat:6.5774,lng:3.3212,name:"Lagos"},
  {code:"ABV",lat:9.0068,lng:7.2632,name:"Abuja"},
  {code:"ACC",lat:5.6052,lng:-0.1668,name:"Accra"},
  {code:"DKR",lat:14.7397,lng:-17.4902,name:"Dakar"},
  {code:"CMN",lat:33.3675,lng:-7.5898,name:"Casablanca"},
  {code:"RAK",lat:31.6069,lng:-8.0363,name:"Marrakech"},
  {code:"ALG",lat:36.6910,lng:3.2154,name:"Algiers"},
  {code:"TUN",lat:36.8510,lng:10.2272,name:"Tunis"},
  {code:"CAI",lat:30.1219,lng:31.4056,name:"Cairo"},
  {code:"HRG",lat:27.1783,lng:33.7994,name:"Hurghada"},
  {code:"MBA",lat:-4.0348,lng:39.5942,name:"Mombasa"},
  {code:"HRE",lat:-17.9318,lng:31.0928,name:"Harare"},
  {code:"LUN",lat:-15.3308,lng:28.4526,name:"Lusaka"},
  {code:"MRU",lat:-20.4302,lng:57.6836,name:"Mauritius"},
];

// ── NAME-BASED MATCHING (Option B — fast, no API) ─────────────
const NAME_OVERRIDES = {
  // City name → preferred airport code when multiple airports exist
  "new york":"JFK","london":"LHR","paris":"CDG","tokyo":"NRT",
  "osaka":"KIX","kyoto":"KIX","chicago":"ORD","washington":"DCA",
  "washington dc":"DCA","houston":"IAH","dallas":"DFW",
  "los angeles":"LAX","san francisco":"SFO","miami":"MIA",
  "moscow":"SVO","shanghai":"PVG","beijing":"PEK",
  "istanbul":"IST","buenos aires":"EZE","sao paulo":"GRU",
  "rio de janeiro":"GIG","seoul":"ICN","bangkok":"BKK",
  // Virginia / DMV suburbs — all map to DCA or IAD
  "lorton":"DCA","lorton va":"DCA","lorton virginia":"DCA",
  "arlington":"DCA","arlington va":"DCA","alexandria":"DCA",
  "alexandria va":"DCA","fairfax":"IAD","fairfax va":"IAD",
  "tysons":"IAD","mclean":"IAD","reston":"IAD","herndon":"IAD",
  "chantilly":"IAD","manassas":"IAD","woodbridge":"DCA",
  "springfield":"DCA","burke":"DCA","annandale":"DCA",
  "falls church":"DCA","sterling":"IAD","ashburn":"IAD",
  "leesburg":"IAD","fredericksburg":"DCA","stafford":"DCA",
  "woodbridge va":"DCA","prince william":"DCA",
  // Other common US suburbs/towns → nearest hub
  "hoboken":"EWR","jersey city":"EWR","staten island":"EWR",
  "brooklyn":"JFK","queens":"JFK","bronx":"LGA","manhattan":"JFK",
  "pasadena":"LAX","santa monica":"LAX","long beach":"LAX",
  "burbank":"BUR","glendale":"BUR","anaheim":"SNA",
  "evanston":"ORD","naperville":"ORD","oak park":"ORD",
  "cambridge":"BOS","somerville":"BOS","brookline":"BOS",
  "bellevue":"SEA","redmond":"SEA","kirkland":"SEA","tacoma":"SEA",
  "aurora":"DEN","lakewood":"DEN","boulder":"DEN","fort collins":"DEN",
  "scottsdale":"PHX","mesa":"PHX","tempe":"PHX","chandler":"PHX",
  "henderson":"LAS","north las vegas":"LAS",
  "fort worth":"DFW","irving":"DFW","plano":"DFW","garland":"DFW",
  "sugar land":"IAH","pearland":"IAH","pasadena tx":"IAH",
  "hialeah":"MIA","coral gables":"MIA","brickell":"MIA",
  "clearwater":"TPA","st petersburg":"TPA","sarasota":"TPA",
  "decatur":"ATL","marietta":"ATL","smyrna":"ATL","sandy springs":"ATL",
  "durham":"RDU","chapel hill":"RDU","cary":"RDU",
  "belmont":"CLT","concord nc":"CLT","gastonia":"CLT",
};

function findByName(cityName) {
  const lower = cityName.toLowerCase().trim();
  
  // Helper to look up a single cleaned string
  function lookup(str) {
    if (NAME_OVERRIDES[str]) {
      return AIRPORTS.find(a => a.code === NAME_OVERRIDES[str]) || null;
    }
    for (const airport of AIRPORTS) {
      const aName = airport.name.toLowerCase();
      if (aName.includes(str)) return airport;
      const cityPart = aName.split(" ")[0];
      if (str.includes(cityPart) && cityPart.length > 3) return airport;
    }
    return null;
  }

  // Try full name first
  let result = lookup(lower);
  if (result) return result;

  // Strip state abbreviation / country suffix (e.g. "Lorton VA" → "Lorton")
  const stripped = lower
    .replace(/,?\s+(va|md|dc|ny|ca|tx|fl|il|wa|co|az|nv|ga|nc|sc|tn|oh|mi|mn|mo|wi|or|ma|pa|nj|ct|ri|nh|vt|me|de|wv|ky|in|ia|ks|ne|sd|nd|mt|id|wy|ut|nm|ak|hi|ok|ar|ms|al|la)/gi, "")
    .replace(/,?\s+(virginia|maryland|california|texas|florida|illinois|washington|colorado|arizona|nevada|georgia|carolina|tennessee|ohio|michigan|minnesota|missouri|wisconsin|oregon|massachusetts|pennsylvania|new jersey|new york|connecticut)/gi, "")
    .trim();
    
  if (stripped !== lower) {
    result = lookup(stripped);
    if (result) return result;
  }

  // Try just the first word if multi-word (e.g. "Lorton" from "Lorton VA")
  const firstWord = lower.split(/[\s,]+/)[0];
  if (firstWord.length > 3 && firstWord !== lower) {
    result = lookup(firstWord);
    if (result) return result;
  }

  return null;
}

// ── DISTANCE CALCULATION (Haversine) ─────────────────────────
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── GEOCODE + DISTANCE FALLBACK (Option A — for obscure cities) ─
async function findByGeocode(cityName) {
  if (!GOOGLE_KEY) return null;
  try {
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${GOOGLE_KEY}`
    );
    const geoData = await geoRes.json();
    if (!geoData.results?.length) return null;
    const { lat, lng } = geoData.results[0].geometry.location;
    // Find nearest airport by distance
    let nearest = null, minDist = Infinity;
    for (const airport of AIRPORTS) {
      const dist = distanceKm(lat, lng, airport.lat, airport.lng);
      if (dist < minDist) { minDist = dist; nearest = airport; }
    }
    return nearest ? { ...nearest, distanceKm: Math.round(minDist) } : null;
  } catch (e) {
    console.error("geocode error:", e);
    return null;
  }
}

// ── MAIN LOOKUP: Option B first, Option A if B fails ─────────
async function getAirport(cityName) {
  if (!cityName) return null;
  // Try name match first (instant)
  const byName = findByName(cityName);
  if (byName) return { ...byName, method: "name" };
  // Fall back to geocode + distance
  const byGeo = await findByGeocode(cityName);
  if (byGeo) return { ...byGeo, method: "geocode" };
  return null;
}

// ── HANDLER ──────────────────────────────────────────────────
export default async function handler(req, res) {
  const { origin, destination, depart_date, return_date } = req.query;
  if (!destination || !depart_date || !return_date) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  if (!SERPAPI_KEY) return res.status(500).json({ error: "Serpapi key not configured" });

  try {
    const [originAirport, destAirport] = await Promise.all([
      origin ? getAirport(origin) : Promise.resolve(null),
      getAirport(destination),
    ]);

    if (!destAirport) {
      return res.status(200).json({ error: `Could not find airport for ${destination}`, price: null });
    }
    if (origin && !originAirport) {
      return res.status(200).json({ error: `Could not find airport for ${origin}`, price: null });
    }
    if (!originAirport) {
      return res.status(200).json({ price: null, error: "Add an origin city to see flight prices", dest_code: destAirport.code, dest_airport: destAirport.name });
    }
    if (originAirport.code === destAirport.code) {
      return res.status(200).json({ price: null, error: "Origin and destination share the same airport", origin_code: originAirport.code, dest_code: destAirport.code });
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
      return res.status(200).json({ error: data.error, price: null, origin_code: originAirport.code, dest_code: destAirport.code });
    }

    const allFlights = [...(data.best_flights || []), ...(data.other_flights || [])];
    if (!allFlights.length) {
      return res.status(200).json({ price: null, error: "No flights found for these dates", origin_code: originAirport.code, dest_code: destAirport.code });
    }

    allFlights.sort((a, b) => (a.price || 999999) - (b.price || 999999));
    const cheapest = allFlights[0];
    const insights = data.price_insights || null;

    // Serpapi returns total round-trip price per person
    // Sanity check: log if suspiciously low for debugging
    const price = cheapest.price;
    if (price < 50) {
      console.warn(`Suspiciously low price: $${price} for ${originAirport.code}→${destAirport.code} — may be a data issue`);
    }

    res.status(200).json({
      price,
      airline: cheapest.flights?.[0]?.airline || null,
      origin_code: originAirport.code,
      dest_code: destAirport.code,
      origin_airport: originAirport.name,
      dest_airport: destAirport.name,
      origin_method: originAirport.method,
      dest_method: destAirport.method,
      price_level: insights?.price_level || null,
      typical_range: insights?.typical_price_range || null,
      total_duration: cheapest.total_duration || null,
      stops: cheapest.flights?.length > 1 ? cheapest.flights.length - 1 : 0,
      price_note: "Round trip · per person · economy",
    });

  } catch (e) {
    console.error("flights.js error:", e);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
}