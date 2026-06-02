// Serverless proxy that keeps your Anthropic API key SECRET on the server.
// The browser calls /api/analyze; this function adds the key and forwards to Anthropic.
// Vercel automatically turns any file in /api into a live endpoint.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY" });
  }

  try {
    const { prompt } = req.body;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await anthropicRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Analysis failed", detail: String(err) });
  }
}
