import base64
import io
from PIL import Image
from typing import Tuple
import asyncio

async def validate_and_compress_image(image_base64: str, max_size_mb: int = 5) -> str:
    """
    Validate and compress image to meet size requirements
    Returns compressed base64 string
    """
    
    # Remove data URL prefix if present
    if "base64," in image_base64:
        image_base64 = image_base64.split("base64,")[1]
    
    # Decode base64 to bytes
    try:
        image_bytes = base64.b64decode(image_base64)
    except Exception:
        raise ValueError("Invalid base64 encoding")
    
    # Check size
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > max_size_mb:
        # Compress image
        image_bytes = await compress_image(image_bytes, target_size_mb=max_size_mb)
    
    # Validate image format
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()  # Verify it's a valid image
    except Exception:
        raise ValueError("Invalid image format")
    
    # Re-encode as JPEG if it's valid
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert RGBA to RGB if needed
    if img.mode in ('RGBA', 'LA', 'P'):
        rgb_img = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = rgb_img
    
    # Compress to JPEG
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=85, optimize=True)
    compressed_bytes = output.getvalue()
    
    # Encode back to base64
    return base64.b64encode(compressed_bytes).decode('utf-8')

async def compress_image(image_bytes: bytes, target_size_mb: int = 5) -> bytes:
    """Compress image to target size"""
    
    target_size = target_size_mb * 1024 * 1024
    
    # Open image
    img = Image.open(io.BytesIO(image_bytes))
    
    # Initial quality
    quality = 85
    
    while len(image_bytes) > target_size and quality > 10:
        output = io.BytesIO()
        
        # Convert RGBA to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        img.save(output, format='JPEG', quality=quality, optimize=True)
        image_bytes = output.getvalue()
        quality -= 10
    
    return image_bytes

def get_image_dimensions(image_base64: str) -> Tuple[int, int]:
    """Get image dimensions without loading full image"""
    
    if "base64," in image_base64:
        image_base64 = image_base64.split("base64,")[1]
    
    image_bytes = base64.b64decode(image_base64)
    img = Image.open(io.BytesIO(image_bytes))
    
    return img.size