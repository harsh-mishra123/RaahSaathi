from typing import Dict, Any
import base64
from app.services.groq_service import GroqService
from app.utils.image_utils import validate_and_compress_image
from app.models.classification import ClassificationResponse, BarrierCategory, SeverityLevel
from app.config import settings

class ClassificationService:
    def __init__(self):
        self.groq_service = GroqService()
    
    async def classify_barrier(self, image_base64: str, user_hint: str = None) -> ClassificationResponse:
        """Main classification logic"""
        
        # Step 1: Validate and compress image
        try:
            compressed_image = await validate_and_compress_image(
                image_base64, 
                max_size_mb=settings.max_image_size_mb
            )
        except ValueError as e:
            raise Exception(f"Invalid image: {str(e)}")
        
        # Step 2: Call Groq for classification
        try:
            groq_result = await self.groq_service.classify_image(compressed_image)
        except Exception as e:
            # Fallback classification if Groq fails
            return self._fallback_classification(user_hint)
        
        # Step 3: Parse and validate response
        classification = self._parse_groq_response(groq_result)
        
        # Step 4: Apply user hint if provided and confidence is low
        if user_hint and classification.confidence < 0.8:
            classification = self._apply_user_hint(classification, user_hint)
        
        return classification
    
    def _parse_groq_response(self, groq_result: Dict[str, Any]) -> ClassificationResponse:
        """Parse Groq response into our model"""
        
        category = groq_result.get("category", "other")
        severity = groq_result.get("severity", 2)
        description = groq_result.get("description", "Accessibility barrier detected")
        confidence = groq_result.get("confidence", 0.5)
        
        # Validate category
        if category not in [c.value for c in BarrierCategory]:
            category = "other"
        
        # Validate severity
        if severity not in [1, 2, 3]:
            severity = 2
        
        # Determine if needs review
        needs_review = confidence < settings.classification_confidence_threshold
        
        return ClassificationResponse(
            category=BarrierCategory(category),
            severity=SeverityLevel(severity),
            description=description[:200],  # Truncate
            confidence=confidence,
            needs_review=needs_review
        )
    
    def _fallback_classification(self, user_hint: str = None) -> ClassificationResponse:
        """Fallback when AI service fails"""
        category = "other"
        if user_hint:
            # Simple keyword matching for fallback
            hint_lower = user_hint.lower()
            if "ramp" in hint_lower:
                category = "broken_ramp"
            elif "tactile" in hint_lower:
                category = "missing_tactile"
            elif "flood" in hint_lower:
                category = "flooded_path"
            elif "construction" in hint_lower:
                category = "construction"
            elif "lift" in hint_lower:
                category = "broken_lift"
        
        return ClassificationResponse(
            category=BarrierCategory(category),
            severity=SeverityLevel.MODERATE,
            description="Please verify this barrier manually",
            confidence=0.3,
            needs_review=True
        )
    
    def _apply_user_hint(self, classification: ClassificationResponse, user_hint: str) -> ClassificationResponse:
        """Apply user hint to improve classification"""
        hint_lower = user_hint.lower()
        
        # Map hints to categories
        hint_map = {
            "ramp": "broken_ramp",
            "tactile": "missing_tactile",
            "flood": "flooded_path",
            "construction": "construction",
            "lift": "broken_lift",
            "kerb": "steep_kerb",
            "narrow": "narrow_passage",
            "pothole": "dangerous_potholes"
        }
        
        for keyword, category in hint_map.items():
            if keyword in hint_lower:
                return ClassificationResponse(
                    category=BarrierCategory(category),
                    severity=classification.severity,
                    description=f"[User indicated: {user_hint}] {classification.description}",
                    confidence=classification.confidence,
                    needs_review=classification.needs_review
                )
        
        return classification