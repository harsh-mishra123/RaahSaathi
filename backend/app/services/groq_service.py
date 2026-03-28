import httpx
import json
from typing import Dict, Any
from app.config import settings
from app.utils.prompts import CLASSIFICATION_PROMPT

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = "llava-v1.5-7b-4096-preview"
        
    async def classify_image(self, image_base64: str) -> Dict[str, Any]:
        """Send image to Groq LLaVA for classification"""
        
        # Remove data URL prefix if present
        if "base64," in image_base64:
            image_base64 = image_base64.split("base64,")[1]
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": CLASSIFICATION_PROMPT
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            "temperature": 0.1,  # Low temperature for consistent outputs
            "max_tokens": 200,
            "response_format": {"type": "json_object"}
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code != 200:
                raise Exception(f"Groq API error: {response.text}")
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Parse JSON response
            try:
                classification = json.loads(content)
                return classification
            except json.JSONDecodeError:
                # Fallback if response isn't valid JSON
                return {
                    "category": "other",
                    "severity": 2,
                    "description": content[:100],
                    "confidence": 0.5
                }