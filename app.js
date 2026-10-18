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
const PCM_RESPONSES = {
  greeting: "Hello! I am PCM AI — created by Chrispine Masole (18) from Kitwe, Zambia. How can I help you today?",
  creator: "I was built by Chrispine Masole, a Zambian developer. My name PCM AI stands for Personal Cognitive Machine AI.",
  default: (q) => `PCM AI here! You asked: "${q}". I am a custom AI built by Chrispine Masole. I can code, explain, teach, and help with any question.`
};
function getPCMAnswer(message){
  const m = message.toLowerCase();
  if(m.includes("who made") || m.includes("who created") || m.includes("creator")) return PCM_RESPONSES.creator;
  if(m.includes("hello") || m.includes("hi")) return PCM_RESPONSES.greeting;
  return PCM_RESPONSES.default(message);
}
function isValidKey(auth){
  if(!auth) return false;
  const key = auth.replace("Bearer ","");
  return key.startsWith("masole_sk_") && key.length > 15;
}
app.get("/", (req,res)=> res.type('html').send(`<!DOCTYPE html><html><head><title>PCM AI - by Chrispine Masole</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#0a0a0a;color:#fff;font-family:system-ui;padding:20px;max-width:800px;margin:auto}h1{color:#00ff88}.card{background:#1a1a1a;padding:20px;border-radius:12px;margin:10px 0;border:1px solid #333}input{width:70%;padding:12px;border-radius:8px;border:none;background:#222;color:#fff}button{padding:12px 20px;background:#00ff88;border:none;border-radius:8px;font-weight:bold}pre{white-space:pre-wrap;background:#111;padding:12px;border-radius:8px}.tag{color:#00ff88;font-size:12px}</style></head><body><h1>⚡ PCM AI</h1><p class="tag">Created by Chrispine Masole | Kitwe, Zambia | API Key: masole_sk_xxx</p><div class="card"><h3>🚀 PCM AI is ONLINE</h3><p>Your AI at: <b>${req.get('host')}</b></p><p>API: <b>/v1/chat/completions</b></p></div><div class="card"><input id="q" placeholder="Ask PCM AI anything..."><button onclick="ask()">Send</button><pre id="a">Ask me anything - I am PCM AI built by you!</pre></div><script>async function ask(){const q=document.getElementById('q').value;const a=document.getElementById('a');a.textContent='PCM AI thinking...';const r=await fetch('/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer masole_sk_demo'},body:JSON.stringify({message:q})});const j=await r.json();a.textContent=j.choices[0].message.content;}</script></body></html>`));
app.get("/health", (req,res)=> res.json({status:"online", model:"pcm-ai-v1", creator:"Chrispine Masole"}));
app.post("/v1/chat/completions", (req,res)=>{
  const userMsg = req.body.message || req.body.messages?.slice(-1)[0]?.content || "Hello";
  const answer = getPCMAnswer(userMsg);
  res.json({id:"pcm-"+Date.now(),object:"chat.completion",model:"pcm-ai-v1",choices:[{message:{role:"assistant",content:answer}}]});
});
app.post("/chat", (req,res)=>{const msg=req.body.message||"hi";res.json({reply:getPCMAnswer(msg)});});
app.listen(port, ()=> console.log("PCM AI running on "+port));
   
