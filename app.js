 const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  if(req.method==="OPTIONS") return res.sendStatus(200);
  next();
});

// DATABASE OF PCM KNOWLEDGE
const PCM_RESPONSES = {
  greeting: "Hello! I am PCM AI — created by Chrispine Masole (18) from Kitwe, Zambia. How can I help you today?",
  creator: "I was built by Chrispine Masole, a Zambian developer. My name PCM AI stands for Personal Cognitive Machine AI. Contact: masolechrispine7-tech",
  default: (q) => PCM AI here! You asked: "${q}". I am a custom AI built by Chrispine Masole. I can code, explain, teach, and help with any question. What would you like to explore?
};

function getPCMAnswer(message){
  const m = message.toLowerCase();
  if(m.includes("who made you") || m.includes("who created") || m.includes("creator")) return PCM_RESPONSES.creator;
  if(m.includes("hello") || m.includes("hi ") ) return PCM_RESPONSES.greeting;
  if(m.includes("code") || m.includes("javascript")) return "I can code! Example:\n\n```js\n// PCM AI by Chrispine\napp.get('/chat', (req,res)=>{\n res.json({ai:'PCM AI', status:'online'})\n})\n```\nWant a full app?";
  return PCM_RESPONSES.default(message);
}

// VALIDATE YOUR masole_sk_ KEYS
function isValidKey(auth){
  if(!auth) return false;
  const key = auth.replace("Bearer ","");
  return key.startsWith("masole_sk_") && key.length > 15;
}

// HOME PAGE - PCM AI CHAT UI
app.get("/", (req,res)=> res.type('html').send(`
<!DOCTYPE html>
<html>
<head>
<title>PCM AI - by Chrispine Masole</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{background:#0a0a0a;color:#fff;font-family:system-ui;padding:20px;max-width:800px;margin:auto}
h1{color:#00ff88} .card{background:#1a1a1a;padding:20px;border-radius:12px;margin:10px 0;border:1px solid #333}
input{width:70%;padding:12px;border-radius:8px;border:none;background:#222;color:#fff}
button{padding:12px 20px;background:#00ff88;border:none;border-radius:8px;font-weight:bold;cursor:pointer}
pre{white-space:pre-wrap;background:#111;padding:12px;border-radius:8px}
.tag{color:#00ff88;font-size:12px}
</style>
</head>
<body>
<h1>⚡ PCM AI</h1>
<p class="tag">Created by Chrispine Masole | Kitwe, Zambia | API Key: masole_sk_xxx</p>
<div class="card">
<h3>🚀 PCM AI is ONLINE</h3>
<p>Your AI at: <b>${req.get('host')}</b></p>
<p>API Endpoint: <b>/v1/chat/completions</b></p>
<p>Use your key: <code>masole_sk_...</code></p>
</div>
<div class="card">
<input id="q" placeholder="Ask PCM AI anything...">
<button onclick="ask()">Send</button>
<pre id="a">Ask me anything - I am PCM AI built by you!</pre>
</div>
<div class="card">
<h4>How to use your API:</h4>
<pre>curl -X POST https://${req.get('host')}/v1/chat/completions \\
 -H "Authorization: Bearer masole_sk_YOUR_KEY" \\
 -H "Content-Type: application/json" \\
 -d '{"message":"Hello PCM AI"}'</pre>
</div>
<script>
async function ask(){
 const q=document.getElementById('q').value;
 const a=document.getElementById('a');
 a.textContent='PCM AI thinking...';
 const r=await fetch('/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer masole_sk_demo'},body:JSON.stringify({message:q})});
 const j=await r.json();
 a.textContent=j.choices[0].message.content;
}
</script>
</body>
</html>
`));

app.get("/health", (req,res)=> res.json({status:"online", model:"pcm-ai-v1", creator:"Chrispine Masole", version:"1.0.0"}));

app.post("/v1/chat/completions", (req,res)=>{
  const auth = req.headers.authorization || "";
  if(!isValidKey(auth) && !auth.includes("demo")){
    // allow demo but warn
    if(auth && !auth.includes("masole_sk_")){
       return res.status(401).json({error:"Invalid PCM AI key. Use masole_sk_..."});
    }
  }
  const userMsg = req.body.message || req.body.messages?.slice(-1)[0]?.content || req.body.prompt || "Hello";
  const answer = getPCMAnswer(userMsg);
  res.json({
    id: "pcm-" + Date.now(),
    object: "chat.completion",
    created: Math.floor(Date.now()/1000),
    model: "pcm-ai-v1",
    choices: [{ index:0, message:{role:"assistant", content: answer}, finish_reason:"stop"}],
    usage: {prompt_tokens: userMsg.length, completion_tokens: answer.length, total_tokens: userMsg.length+answer.length}
  });
});

app.post("/chat", (req,res)=>{
  const msg = req.body.message || "hi";
  res.json({reply: getPCMAnswer(msg), model:"pcm-ai", creator:"Chrispine Masole"});
});

const server = app.listen(port, ()=> console.log(PCM AI running on ${port}));
server.keepAliveTimeout = 120*1000;
server.headersTimeout = 120*1000;
`);
