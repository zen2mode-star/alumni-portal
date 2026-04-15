import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testAI() {
  console.log('Testing with API KEY:', API_KEY ? 'Present' : 'MISSING');
  
  const payload = {
    contents: [{
      parts: [{ text: "Hello, who are you?" }]
    }]
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  console.log('Status:', response.status);
  const data = await response.text();
  console.log('Response:', data);
}

testAI();
