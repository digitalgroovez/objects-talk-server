// ============================================
// Objects Talk - Backend Server (Groq Edition)
// FREE - No credit card needed!
// ============================================

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Rate Limiter — max 10 requests per user per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests. Please wait 1 minute and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/api/generate", limiter, async (req, res) => {
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

    if (data.error) {
      console.error("Groq API error:", data.error);
      return res.status(500).json({ error: "AI service error: " + data.error.message });
    }

    const raw = data.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      return res.status(500).json({ error: "Empty response from AI. Try again." });
    }

    const clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        parsed = JSON.parse(clean.slice(start, end + 1));
      } else {
        return res.status(500).json({ error: "Could not parse AI response. Try again." });
      }
    }

    res.json(parsed);

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Objects Talk (Groq Edition) running at http://localhost:${PORT}`);
  console.log(`🆓 Using FREE Groq API - llama-3.3-70b-versatile`);
});
