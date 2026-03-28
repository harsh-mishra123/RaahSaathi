from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BarrierCreate(BaseModel):
    latitude: float
    longitude: float
    category: str
    severity: int
    description: Optional[str] = None
    photo_url: Optional[str] = None
    ai_tags: Optional[dict] = None

class BarrierResponse(BaseModel):
    id: str
    latitude: float
    longitude: float
    category: str
    severity: int
    description: Optional[str] = None
    photo_url: Optional[str] = None
    upvotes: int
    downvotes: int
    status: str
    reported_by: Optional[str] = None
    created_at: Optional[datetime] = None
