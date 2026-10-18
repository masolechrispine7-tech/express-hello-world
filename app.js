const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const AI_KEY = process.env.OPENAI_API_KEY;

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.messages?.[0]?.content || req.body.prompt || "Hello";
    
    if (!AI_KEY) {
      return res.json({ reply: "PCM AI offline mode: You said '" + userMessage + "'. Add OPENAI_API_KEY in Render to make me as smart as ChatGPT! 9+9=18 ✅" });
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
          { role: "system", content: "You are PCM AI by Chrispine Masole, Zambia. You are like ChatGPT - expert in maths, physics, chemistry, coding. Solve step-by-step." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "No answer" });
  } catch (e) {
    res.json({ reply: "Error: " + e.message });
  }
});

app.get('/generate-image', (req, res) => {
  const prompt = req.query.prompt || "landscape";
  const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt);
  res.json({ imageUrl: url });
});

app.get('/', (req, res) => res.send('PCM AI ONLINE - ChatGPT powers ready'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("LIVE"));
     
