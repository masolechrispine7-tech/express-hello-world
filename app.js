const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const AI_KEY = process.env.OPENAI_API_KEY;

// CHAT - Like ChatGPT
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.messages?.[0]?.content || req.body.prompt || "Hello";
    
    if (!AI_KEY) {
      return res.json({ reply: "PCM AI (offline mode): You said '" + userMessage + "'. Add OPENAI_API_KEY in Render > Environment to make me as smart as ChatGPT! I can solve maths, physics, chemistry. Example: 9+9=18" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + AI_KEY,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pcm-ai-h6at.onrender.com",
        "X-Title": "PCM AI"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are PCM AI created by Chrispine Masole, 18, Zambia. You are as smart as ChatGPT. Expert in maths, physics, chemistry, coding. Solve step by step clearly." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply from AI";
    res.json({ reply: reply });

  } catch (e) {
    res.json({ reply: "Error: " + e.message });
  }
});

// IMAGE - UNLIMITED, NO LIMIT
app.get('/generate-image', (req, res) => {
  const prompt = (req.query.prompt || "beautiful landscape").trim();
  const seed = Math.floor(Math.random() * 9999999);
  const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) + "?model=flux&width=1024&height=1024&seed=" + seed + "&nologo=true&enhance=false&private=true";
  res.json({ imageUrl: url, prompt: prompt, unlimited: true });
});

// BACKUP IMAGE - 100% UNLIMITED NEVER FAILS
app.get('/generate-image-v2', (req, res) => {
  const prompt = req.query.prompt || "landscape";
  const seed = Math.floor(Math.random() * 999999);
  res.json({ imageUrl: "https://picsum.photos/seed/" + seed + "/1024/1024", prompt: prompt, unlimited: true });
});

app.get('/', (req, res) => {
  res.send('PCM AI ONLINE - ChatGPT Level + Unlimited Images');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("PCM AI LIVE on " + PORT));
      
