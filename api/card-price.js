export default async function handler(req, res) {
  const { name, type, city } = req.query;
  const key = process.env.REACT_APP_ANTHROPIC_KEY;
  if (!name || !city) return res.status(400).json({ error: "Missing name or city" });

  const prompt = `What is the typical per-person cost in USD to visit "${name}" in ${city} (type: ${type || "attraction"})?
- Museums/attractions: standard adult admission price
- Restaurants/cafes/bars: typical cost per person for a meal or drinks
- Free parks/public spaces/landmarks: cost is 0
- Give your best estimate from your training knowledge
Respond ONLY with this JSON, nothing else:
{"cost":NUMBER,"note":"one short phrase e.g. Adult admission or Typical meal"}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.content?.map(c => c.text || "").join("").trim();
    const match = text.match(/\{[^{}]*"cost"\s*:\s*[\d.]+[^{}]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);
    res.status(200).json({ cost: Math.round(parsed.cost), note: parsed.note || "" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch price" });
  }
}