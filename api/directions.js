export default async function handler(req, res) {
  const { origin, destination, mode } = req.query;
  const key = process.env.REACT_APP_GOOGLE_KEY;
  if (!origin || !destination) return res.status(400).json({ error: "Missing origin or destination" });
  const modeMap = { walking: "walking", transit: "transit", driving: "driving", cycling: "bicycling", rideshare: "driving" };
  const travelMode = modeMap[mode] || "walking";
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${travelMode}&key=${key}`;
    const r = await fetch(url);
    const data = await r.json();
    if (data.routes?.[0]?.legs?.[0]) {
      const leg = data.routes[0].legs[0];
      res.status(200).json({
        minutes: Math.ceil(leg.duration.value / 60),
        text: leg.duration.text,
        distance: leg.distance.text
      });
    } else {
      res.status(200).json({ minutes: 15, text: "~15 min", distance: "unknown" });
    }
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch directions" });
  }
}
