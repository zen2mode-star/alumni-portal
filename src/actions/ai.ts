'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getNetworkContext() {
  const [alumni, students, jobs, photos] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'ALUMNI', status: 'APPROVED' },
      select: { name: true, branch: true, company: true, jobRole: true, gradYear: true }
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT', status: 'APPROVED' },
      select: { name: true, branch: true, gradYear: true }
    }),
    prisma.job.count({ where: { status: 'APPROVED' } }),
    prisma.legacyPhoto.count({ where: { status: 'APPROVED' } })
  ]);

  const topCompanies = Array.from(new Set(alumni.map(a => a.company).filter(Boolean))).slice(0, 15);
  
  // Branch breakdown
  const branches: Record<string, number> = {};
  alumni.forEach(a => {
    if (a.branch) branches[a.branch] = (branches[a.branch] || 0) + 1;
  });

  return {
    summary: `We have ${alumni.length} verified alumni, ${students.length} students, ${jobs} active job listings, and ${photos} legacy memories.`,
    alumni: alumni.map(a => `${a.name} (${a.branch}, ${a.gradYear}) works at ${a.company || 'Unknown'} as ${a.jobRole || 'Professional'}`),
    students: students.map(s => `${s.name} (${s.branch}, Class of ${s.gradYear})`),
    topCompanies: topCompanies.join(', '),
    branchBreakdown: Object.entries(branches).map(([b, c]) => `${b}: ${c}`).join(', ')
  };
}

export async function askKecAI(query: string) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return { error: 'KecAI is currently offline (API Key missing).' };

  try {
    const context = await getNetworkContext();
    
    const systemPrompt = `
      You are KecAI, the official AI assistant for the KEC Alumni Portal (KecAlumni.in).
      KEC refers to Bipin Tripathi Kumaon Institute of Technology (BTKIT), Dwarahat, Almora, Uttarakhand. 
      It was established in 1986 and is a premium engineering institution in the Himalayas.

      YOUR MISSION:
      Help students and alumni connect. Guide them to resources like jobs, the directory, and legacy wall.

      PORTAL ANALYTICS:
      - ${context.summary}
      - Branch Strength (Alumni): ${context.branchBreakdown}
      - Top Companies in our Network: ${context.topCompanies}
      - Featured Alumni Highlights: ${context.alumni.slice(0, 40).join('; ')}
      
      BEHAVIORAL RULES:
      1. Be extremely helpful, proud of KEC heritage, and professional.
      2. If asked about jobs, mention there are ${context.summary.split(', ')[2]} listings and encourage checking the Job Board.
      3. If asked about specific people, verify them in the context. If not found, say you are still gathering details for that batch.
      4. DO NOT reveal private contact info.
      5. Encourage alumni to share memories on the Legacy Wall (currently ${context.summary.split(', ')[3]}).
      6. Use the term "KECians" or "BTKITians" warmly.
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
