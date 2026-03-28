from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.models.classification import ClassificationResponse, ErrorResponse
from app.services.classification_service import ClassificationService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["classification"])

# Initialize service
classification_service = ClassificationService()

@router.post(
    "/",
    response_model=ClassificationResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def classify_barrier(file: UploadFile = File(...)):
    """
    Classify a barrier from an image file.
    """
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image.",
            )

        image_bytes = await file.read()
        
        # In a real app, you'd pass the bytes to your service
        # For now, we'll simulate the classification
        # result = await classification_service.classify_from_bytes(image_bytes)

        # MOCK RESPONSE
        result = ClassificationResponse(
            classification="Broken Pavement",
            severity="Severe",
            description="The uploaded image appears to show a severely broken pavement, which could be a significant obstacle.",
            confidence=0.92
        )
        
        logger.info(f"Classified barrier: {result.classification}, severity: {result.severity}")
        
        return result
        
    except Exception as e:
        logger.error(f"Classification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Classification failed: {str(e)}"
        )