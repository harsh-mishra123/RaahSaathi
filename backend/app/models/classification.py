from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class BarrierCategory(str, Enum):
    BROKEN_RAMP = "broken_ramp"
    MISSING_TACTILE = "missing_tactile"
    FLOODED_PATH = "flooded_path"
    CONSTRUCTION = "construction"
    BROKEN_LIFT = "broken_lift"
    STEEP_KERB = "steep_kerb"
    NARROW_PASSAGE = "narrow_passage"
    DANGEROUS_POTHOLES = "dangerous_potholes"
    OTHER = "other"

class SeverityLevel(int, Enum):
    MINOR = 1
    MODERATE = 2
    SEVERE = 3

class ClassificationRequest(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded image")
    user_hint: Optional[str] = Field(None, description="Optional user-provided hint about barrier type")

class ClassificationResponse(BaseModel):
    category: BarrierCategory
    severity: SeverityLevel
    description: str
    confidence: float = Field(..., ge=0, le=1)
    needs_review: bool = Field(False, description="If confidence is low, needs human review")

class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None