import os
import google.generativeai as genai
from typing import Optional

class GeminiService:
    """Service for interacting with Google Gemini API"""
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY must be set")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    async def generate_content(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """
        Generate content using Gemini API
        
        Args:
            prompt: The user prompt
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            Generated text response
        """
        try:
            if system_instruction:
                # Create a new model instance with system instruction
                model = genai.GenerativeModel(
                    'gemini-1.5-pro',
                    system_instruction=system_instruction
                )
                response = model.generate_content(prompt)
            else:
                response = self.model.generate_content(prompt)
            
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def analyze_career_match(self, hobbies: list[str], skills: list[str], interests: dict) -> dict:
        """
        Analyze user inputs and suggest career matches
        
        Args:
            hobbies: List of user hobbies
            skills: List of technical skills
            interests: Dictionary of interest areas with ratings
            
        Returns:
            Dictionary with career matches and percentages
        """
        system_instruction = """You are an expert career counselor with deep knowledge of 
        technology careers, market trends, and skill requirements. Provide data-driven, 
        actionable career guidance."""
        
        prompt = f"""Based on the following user profile, suggest 5 career domains with match percentages (0-100%).
        
Hobbies: {', '.join(hobbies)}
Technical Skills: {', '.join(skills)}
Interest Areas: {interests}

For each career domain, provide:
1. Domain name
2. Match percentage (0-100)
3. Brief reasoning (2-3 sentences)
4. Key skills to develop

Return the response in valid JSON format with this structure:
{{
    "matches": [
        {{
            "domain": "Full Stack Development",
            "match_percentage": 85,
            "reasoning": "Your skills align well...",
            "key_skills": ["React", "Node.js", "PostgreSQL"]
        }}
    ]
}}"""
        
        response = await self.generate_content(prompt, system_instruction)
        
        # Parse JSON from response (handle markdown code blocks if present)
        import json
        import re
        
        # Extract JSON from markdown code blocks if present
        json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = response
        
        return json.loads(json_str)

# Create singleton instance
gemini_service = GeminiService()
