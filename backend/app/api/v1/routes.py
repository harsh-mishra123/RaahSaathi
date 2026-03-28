from fastapi import APIRouter
from . import health, classify, barriers

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(classify.router, prefix="/classify", tags=["classification"])
router.include_router(barriers.router, prefix="/barriers", tags=["barriers"])