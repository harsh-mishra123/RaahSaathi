from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from pydantic import BaseModel, Field

from app.services.supabase_service import supabase_service
from app.models.barrier import BarrierCreate, BarrierResponse

router = APIRouter(prefix="/barriers", tags=["barriers"])

class BarrierListResponse(BaseModel):
    barriers: List[BarrierResponse]
    total: int

@router.get("/nearby", response_model=List[BarrierResponse])
async def get_nearby_barriers(
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    radius: int = Query(5000, description="Radius in meters")
):
    try:
        barriers = await supabase_service.get_barriers(latitude, longitude, radius)
        return barriers
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{barrier_id}", response_model=BarrierResponse)
async def get_barrier_details(barrier_id: str):
    try:
        barrier = await supabase_service.get_barrier_by_id(barrier_id)
        if not barrier:
            raise HTTPException(status_code=404, detail="Barrier not found")
        return barrier
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=BarrierResponse, status_code=status.HTTP_201_CREATED)
async def create_barrier(barrier_data: BarrierCreate):
    try:
        # In a real app, you'd get the user_id from an auth token
        user_id = "a_valid_user_id_placeholder" # Replace with actual user ID
        
        new_barrier = await supabase_service.create_barrier(
            barrier_data=barrier_data,
            user_id=user_id
        )
        return new_barrier
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create barrier: {str(e)}"
        )

class VoteRequest(BaseModel):
    direction: int # 1 for upvote, -1 for downvote

@router.post("/{barrier_id}/vote", response_model=BarrierResponse)
async def cast_vote(barrier_id: str, vote_request: VoteRequest):
    try:
        # In a real app, you'd get the user_id from an auth token
        user_id = "a_valid_user_id_placeholder" # Replace with actual user ID
        
        updated_barrier = await supabase_service.cast_vote(
            barrier_id=barrier_id,
            user_id=user_id,
            direction=vote_request.direction
        )
        return updated_barrier
    except Exception as e:
        # This could be a unique constraint violation if the user already voted
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Failed to cast vote: {str(e)}"
        )

class CommentCreate(BaseModel):
    content: str

@router.post("/{barrier_id}/comments", status_code=status.HTTP_201_CREATED)
async def post_comment(barrier_id: str, comment_data: CommentCreate):
    try:
        # In a real app, you'd get the user_id from an auth token
        user_id = "a_valid_user_id_placeholder" # Replace with actual user ID
        
        new_comment = await supabase_service.add_comment(
            barrier_id=barrier_id,
            user_id=user_id,
            content=comment_data.content
        )
        return new_comment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to post comment: {str(e)}"
        )
