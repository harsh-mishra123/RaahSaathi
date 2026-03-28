from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.api.v1 import classify, health, barriers, barriers, barriers  # ← ADD barriers here
from app.core.middleware import add_middleware

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="RaahSaathi AI Classification Service",
    description="AI-powered accessibility barrier classification using Groq LLaVA",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/v1/health", tags=["health"])
app.include_router(classify.router, prefix="/api/v1/classify", tags=["classification"])
app.include_router(barriers.router, prefix="/api/v1/barriers", tags=["barriers"])

@app.get("/")
async def root():
    return {
        "service": "RaahSaathi AI Classification",
        "status": "running",
        "docs": "/docs" if settings.DEBUG else "not available in production"
    }

@app.on_event("startup")
async def startup_event():
    logger.info("Starting RaahSaathi AI Classification Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Supabase URL: {settings.SUPABASE_URL}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down RaahSaathi AI Classification Service...")