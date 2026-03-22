export default async function handler(req, res) {
  const { query, pagetoken } = req.query;
  const key = process.env.REACT_APP_GOOGLE_KEY;
  if (!query) return res.status(400).json({ error: "Missing query" });
  try {
    const url = pagetoken
      ? `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pagetoken}&key=${key}`
      : `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${key}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
}
