import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { hobbies, skills, interests } = await req.json();

        const systemInstruction = `You are an expert career counselor for students. 
    Analyze their profile and suggest the top 5 most suitable tech career paths.
    Be encouraging but realistic. Focus on modern, high-demand roles.`;

        const prompt = `
    Analyze this student profile:
    
    Hobbies: ${hobbies.join(', ')}
    Technical Skills: ${skills.join(', ')}
    Interest Areas (1-10 scale): ${JSON.stringify(interests)}

    Output strictly a JSON object with this key:
    "matches": formatted as an array of objects, each containing:
    - "domain": string (e.g., "AI Engineer")
    - "match_percentage": number (0-100)
    - "reasoning": string
    - "key_skills": string[]

    Example JSON structure:
    {
      "matches": [
        { "domain": "Frontend Dev", "match_percentage": 95, "reasoning": "...", "key_skills": ["React", "CSS"] }
      ]
    }
    `;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up potential markdown formatting if Gemini adds it
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanJson);

        return NextResponse.json(data);

    } catch (error) {
        console.error('Career Assessment Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate career assessment' },
            { status: 500 }
        );
    }
}
