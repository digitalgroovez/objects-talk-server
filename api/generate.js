// ============================================
// Objects Talk - Vercel Serverless Function
// FREE hosting - no credit card needed!
// ============================================

const rateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 10;
  if (!rateLimit.has(ip)) { rateLimit.set(ip, { count: 1, start: now }); return true; }
  const data = rateLimit.get(ip);
  if (now - data.start > windowMs) { rateLimit.set(ip, { count: 1, start: now }); return true; }
  if (data.count >= max) return false;
  data.count++;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const ip = req.headers["x-forwarded-for"] || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait 1 minute." });
  }

  const { object } = req.body;
  if (!object || typeof object !== "string" || object.trim().length === 0) {
    return res.status(400).json({ error: "Please provide an object name." });
  }
  if (object.length > 100) {
    return res.status(400).json({ error: "Object name is too long." });
  }

  const systemMsg = "You are a content creator for a faceless YouTube channel called Objects Talk where everyday objects speak in first person sharing educational facts. Always respond with ONLY a valid raw JSON object. No markdown, no backticks, no preamble, no explanation whatsoever.";
  const userMsg = `Generate content for object: "${object.trim()}"
Return this exact JSON structure with real content replacing the descriptions:
{"script":"25-30 word first-person monologue. One surprising fact. Punchy hook + memorable ending.","imagePrompt":"3D Pixar-style animated version of the object with googly eyes, tiny arms, worried expression, placed in its natural real-world setting. Cinematic lighting, bokeh background, stop-motion style, hyper-detailed textures.","youtube":{"title":"Engaging title max 60 chars","description":"3 sentences with keywords plus call to action","hashtags":"#ObjectsTalk #Shorts #Educational #LearnOnShorts #Facts"},"instagram":{"caption":"2-3 lines with emojis ending with a question","hashtags":"#objectstalk #shorts #educational #facts #reels #trending"},"facebook":{"caption":"2-3 friendly lines with emojis plus share CTA","hashtags":"#objectstalk #educational #facts #reels"},"tiktok":{"caption":"1-2 trendy lines with emojis starting with POV: or Did you know?","hashtags":"#fyp #foryou #objectstalk #educational #facts #viral"}}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: userMsg }
        ],
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: "AI error: " + data.error.message });

    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return res.status(500).json({ error: "Empty AI response. Try again." });

    const clean = raw.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim();
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
      if (s !== -1 && e !== -1) parsed = JSON.parse(clean.slice(s, e + 1));
      else return res.status(500).json({ error: "Could not parse AI response. Try again." });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
}
