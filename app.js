javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('PCM AI ONLINE - ChatGPT Level + Unlimited Images 🔥');
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ reply: 'Ask me anything!' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.json({ reply: `PCM AI Free Mode: You said "${message}". Add OPENAI_API_KEY in Render to unlock full brain!` });
  }
  try {
    const https = require('https');
    const data = JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    });
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    const apiReq = https.request(options, (apiRes) => {
      let body = '';
      apiRes.on('data', (c) => body += c);
      apiRes.on('end', () => {
        try {
          const j = JSON.parse(body);
          res.json({ reply: j.choices?.[0]?.message?.content || 'PCM AI: ' + message });
        } catch { res.json({ reply: 'PCM AI: ' + message }); }
      });
    });
    apiReq.on('error', () => res.json({ reply: `PCM AI: About "${message}" - I can help!` }));
    apiReq.write(data);
    apiReq.end();
  } catch (err) {
    res.json({ reply: `PCM AI: ${message} - Tell me more!` });
  }
});

app.post('/image', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.json({ error: 'Give prompt' });
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
  res.json({ imageUrl: url, prompt });
});

app.listen(PORT, () => console.log('PCM AI LIVE on', PORT));

  
