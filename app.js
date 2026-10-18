js
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

console.log("Groq Key exists?", !!process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.get('/', (req, res) => {
  res.send('PCM-AI is Live! 🔥');
});

app.post('/chat', async (req, res) => {
  console.log("Got chat request:", req.body);
  try {
    const userMessage = req.body.message || req.body.prompt || req.body.text;
    
    if (!userMessage) {
      return res.json({ reply: "Send a message!" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 500
    });
    
    const reply = completion.choices[0].message.content;
    console.log("Reply:", reply);
    res.json({ reply: reply });
    
  } catch (err) {
    console.error("GROQ ERROR:", err.message);
    res.json({ reply: "Error: " + err.message + " - Check GROQ_API_KEY in Render!" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`PCM-AI Running on ${PORT}`));
