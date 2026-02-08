import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateContent(prompt: string, systemInstruction?: string) {
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        systemInstruction: systemInstruction
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
}

export async function generateRoadmap(domain: string) {
    const systemInstruction = `You are an expert technical educator creating actionable learning roadmaps.
  Focus on practical, hands-on learning with specific resources and projects.`

    const prompt = `Create a Day Zero roadmap for "${domain}". Provide 3 sections:

1. **Learn** (3-5 foundational resources):
   - Online courses, documentation, or tutorials
   - Include specific URLs when possible

2. **Setup** (Environment and tools):
   - Required software, IDEs, accounts
   - Step-by-step installation guide

3. **Do** (First hands-on project):
   - A beginner-friendly project that demonstrates core concepts
   - Clear deliverables and success criteria

Return as valid JSON:
{
  "domain": "${domain}",
  "learn": [{"title": "...", "url": "...", "duration": "..."}],
  "setup": [{"tool": "...", "purpose": "...", "install_guide": "..."}],
  "do": {"project_name": "...", "description": "...", "steps": [...], "deliverables": [...]}
}`

    const response = await generateContent(prompt, systemInstruction)

    // Parse JSON from response
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : response

    return JSON.parse(jsonStr)
}
