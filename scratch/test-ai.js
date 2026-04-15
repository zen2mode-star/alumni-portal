const KEY = "AIzaSyBgkakNLojSW51E-mpQOmHZL1XmwNobIlo";
const fetch = require('node-fetch');

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Hello, who are you?" }]
      }]
    })
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
