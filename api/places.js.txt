export default async function handler(req, res) {
  const { query } = req.query;
  const key = process.env.REACT_APP_GOOGLE_KEY;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}