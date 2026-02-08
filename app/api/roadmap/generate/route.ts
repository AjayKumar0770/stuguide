import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { domain } = await req.json();

        const systemInstruction = `You are a senior tech lead creating onboarding plans for new interns.
    Your goal is to get them from zero to building a real project in one day.
    Be ultra-specific. No generic advice.`;

        const prompt = `
    Create a Day Zero Roadmap for receiving a job in: "${domain}"

    Return a strictly valid JSON object (no markdown) with this structure:
    {
      "learn": [
        { "title": "Resource Title", "url": "URL", "duration": "Estimate (e.g. 2h)" }
        // 3-4 high quality, free resources
      ],
      "setup": [
        { "tool": "Tool Name", "purpose": "Why needed", "install_guide": "Command or link" }
        // 3-4 essential tools
      ],
      "do": {
        "project_name": "Catchy Name",
        "description": "Brief concept",
        "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
        "deliverables": ["Functionality 1", "Functionality 2"]
      }
    }
    `;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return NextResponse.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error('Roadmap Gen Error:', error);
        return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
    }
}
