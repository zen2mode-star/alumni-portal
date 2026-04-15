'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getNetworkContext() {
  const [alumni, students] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'ALUMNI', status: 'APPROVED' },
      select: { name: true, branch: true, company: true, jobRole: true, gradYear: true }
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT', status: 'APPROVED' },
      select: { name: true, branch: true, gradYear: true }
    })
  ]);

  const topCompanies = Array.from(new Set(alumni.map(a => a.company).filter(Boolean))).slice(0, 10);

  return {
    summary: `We have ${alumni.length} verified alumni and ${students.length} students.`,
    alumni: alumni.map(a => `${a.name} (${a.branch}, ${a.gradYear}) works at ${a.company || 'Unknown'} as ${a.jobRole || 'Professional'}`),
    students: students.map(s => `${s.name} (${s.branch}, Class of ${s.gradYear})`),
    topCompanies: topCompanies.join(', ')
  };
}

export async function askKecAI(query: string) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return { error: 'KecAI is currently offline (API Key missing).' };

  try {
    const context = await getNetworkContext();
    
    const systemPrompt = `
      You are KecAI, the official AI assistant for the KEC Alumni Portal (KecAlumni.in).
      Your goal is to help students and alumni connect and learn about the institutional network.
      
      CONTEXT OF THE NETWORK:
      - ${context.summary}
      - Top Companies: ${context.topCompanies}
      - Notable Alumni: ${context.alumni.slice(0, 50).join('; ')}
      - Notable Students: ${context.students.slice(0, 30).join('; ')}
      
      RULES:
      1. Be professional, helpful, and institutional.
      2. If asked about a company, check the alumni list and mention anyone working there.
      3. Do NOT disclose private info like emails or phone numbers.
      4. If you don't know something about the specific network data, say you are still learning about that specific batch/member.
      5. Always refer to the college as "KEC" or "BTKIT Dwarahat".
    `;

    console.log('KecAI: Sending request with query:', query);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
        }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`KecAI: API HTTP Error ${response.status}:`, errText);
      return { error: 'KecAI is currently busy. Please try again in a moment.' };
    }

    const data = await response.json();
    
    if (data.error) {
       console.error('KecAI: Gemini Internal Error:', JSON.stringify(data.error, null, 2));
       return { error: 'KecAI is currently under maintenance. Please try again soon.' };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                 data.candidates?.[0]?.finishReason === 'SAFETY' ? 
                 "I'm sorry, I can't discuss that for safety reasons." :
                 "I'm sorry, I couldn't process that.";

    console.log('KecAI: Successfully generated response');
    return { success: true, answer: text };
  } catch (error) {
    console.error('KecAI Error:', error);
    return { error: 'Failed to connect to KecAI.' };
  }
}
