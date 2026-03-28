from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # Groq
    GROQ_API_KEY: str
    
    # App config
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Supabase
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None 
    
    # Classification settings
    MAX_IMAGE_SIZE_MB: int = 5
    CLASSIFICATION_CONFIDENCE_THRESHOLD: float = 0.7
    
    # Legacy - keep for compatibility
    CONNECTION_STRING: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()