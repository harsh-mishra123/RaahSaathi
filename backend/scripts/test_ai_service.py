#!/usr/bin/env python
"""
Manual testing script for AI classification service
"""
import asyncio
import base64
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.classification_service import ClassificationService
from app.config import settings

async def test_classification(image_path: str, user_hint: str = None):
    """Test classification with a local image"""
    
    # Read and encode image
    with open(image_path, "rb") as f:
        image_bytes = f.read()
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    
    print(f" Testing image: {image_path}")
    print(f" User hint: {user_hint or 'None'}")
    print("-" * 50)
    
    # Classify
    service = ClassificationService()
    result = await service.classify_barrier(image_base64, user_hint)
    
    print(f" Classification result:")
    print(f"   Category: {result.category}")
    print(f"   Severity: {result.severity}")
    print(f"   Confidence: {result.confidence:.2%}")
    print(f"   Description: {result.description}")
    print(f"   Needs review: {result.needs_review}")
    
    return result

async def test_health():
    """Test health endpoints"""
    import httpx
    
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/api/v1/health")
        print(f"Health check: {response.json()}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_ai_service.py <image_path> [user_hint]")
        sys.exit(1)
    
    image_path = sys.argv[1]
    user_hint = sys.argv[2] if len(sys.argv) > 2 else None
    
    asyncio.run(test_classification(image_path, user_hint))