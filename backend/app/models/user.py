from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    created_at: Optional[datetime] = None
