from supabase import create_client, Client
from app.config import settings
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import math

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        """Initialize Supabase client with anon key for normal operations"""
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
        # Service client for admin operations (migrations only)
        self.service_client: Optional[Client] = None
        if settings.SUPABASE_SERVICE_KEY:
            self.service_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY
            )
        
    # ============================================
    # PROFILE OPERATIONS
    # ============================================
    
    async def get_profile(self, user_id: str) -> Optional[Dict]:
        """Get user profile by ID"""
        try:
            response = self.client.table('profiles').select('*').eq('id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error getting profile: {e}")
            return None
    
    async def create_profile(self, user_id: str, username: str, full_name: str = None) -> Dict:
        """Create a new user profile"""
        try:
            profile = {
                'id': user_id,
                'username': username,
                'full_name': full_name,
                'total_points': 0,
                'reports_count': 0,
                'validations_count': 0
            }
            response = self.client.table('profiles').insert(profile).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating profile: {e}")
            raise
    
    async def update_profile(self, user_id: str, updates: Dict) -> Dict:
        """Update user profile"""
        try:
            updates['updated_at'] = datetime.utcnow().isoformat()
            response = self.client.table('profiles').update(updates).eq('id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error updating profile: {e}")
            raise
    
    async def increment_user_points(self, user_id: str, points: int) -> None:
        """Add points to user's total"""
        try:
            profile = await self.get_profile(user_id)
            if profile:
                new_points = profile['total_points'] + points
                await self.update_profile(user_id, {'total_points': new_points})
        except Exception as e:
            logger.error(f"Error incrementing points: {e}")
    
    # ============================================
    # BARRIER OPERATIONS
    # ============================================
    
    async def create_barrier(self, barrier_data: Dict, user_id: str) -> Optional[Dict]:
        """Create a new barrier report"""
        try:
            barrier_data_dict = barrier_data.model_dump()
            barrier_data_dict['reported_by'] = user_id
            # Add PostGIS point geometry (format: "POINT(lng lat)")
            barrier_data_dict['location'] = f"POINT({barrier_data_dict['longitude']} {barrier_data_dict['latitude']})"
            
            response = self.client.table('barriers').insert(barrier_data_dict).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating barrier: {e}")
            raise
    
    async def get_barrier_by_id(self, barrier_id: str) -> Optional[Dict]:
        """Get a single barrier by ID, including comments"""
        try:
            # Fetch barrier details and join with profile
            response = self.client.table('barriers').select('*, author:profiles(*)').eq('id', barrier_id).single().execute()
            barrier = response.data
            if not barrier:
                return None

            # Fetch comments for the barrier and join with profile
            comments_response = self.client.table('comments').select('*, author:profiles(*)').eq('barrier_id', barrier_id).order('created_at', desc=False).execute()
            barrier['comments'] = comments_response.data if comments_response.data else []
            
            return barrier
        except Exception as e:
            logger.error(f"Error getting barrier by ID: {e}")
            return None

    async def get_barriers(
        self, 
        latitude: Optional[float], 
        longitude: Optional[float], 
        radius: int
    ) -> List[Dict]:
        """Get all barriers, optionally filtered by location"""
        try:
            if latitude is not None and longitude is not None:
                # Use the RPC function for location-based search
                response = self.client.rpc(
                    'get_barriers_nearby',
                    {
                        'lat': latitude,
                        'lng': longitude,
                        'radius': radius
                    }
                ).execute()
            else:
                # Fetch all barriers if no location is provided
                response = self.client.table('barriers').select('*, author:profiles(username)').order('created_at', desc=True).limit(100).execute()

            return response.data if response.data else []
        except Exception as e:
            logger.error(f"Error getting barriers: {e}")
            return []

    async def get_barriers_nearby(
        self, 
        latitude: float, 
        longitude: float, 
        radius_meters: int = 500,
        status: str = 'active',
        category: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict]:
        """Get barriers within radius using PostGIS RPC function"""
        try:
            # Call the PostGIS RPC function we created
            response = self.client.rpc(
                'get_barriers_nearby',
                {
                    'lat': latitude,
                    'lng': longitude,
                    'radius': radius_meters,
                    'barrier_status': status
                }
            ).execute()
            
            barriers = response.data if response.data else []
            
            # Filter by category if specified
            if category:
                barriers = [b for b in barriers if b['category'] == category]
            
            # Apply limit
            return barriers[:limit]
            
        except Exception as e:
            logger.error(f"Error getting nearby barriers via RPC: {e}")
            # Fallback to manual calculation
            return await self._get_barriers_nearby_fallback(latitude, longitude, radius_meters, status, category, limit)

    async def cast_vote(self, barrier_id: str, user_id: str, vote_type: str) -> Optional[Dict]:
        """Cast or update a vote on a barrier"""
        try:
            # This would be a transaction in a real DB
            # 1. Upsert vote
            vote_data = {'barrier_id': barrier_id, 'user_id': user_id, 'vote_type': vote_type}
            self.client.table('votes').upsert(vote_data, on_conflict='barrier_id, user_id').execute()

            # 2. Recalculate scores (ideally a DB trigger)
            upvotes = self.client.table('votes').select('id', count='exact').eq('barrier_id', barrier_id).eq('vote_type', 'upvote').execute().count
            downvotes = self.client.table('votes').select('id', count='exact').eq('barrier_id', barrier_id).eq('vote_type', 'downvote').execute().count
            
            # 3. Update barrier
            update_response = self.client.table('barriers').update({'upvotes': upvotes, 'downvotes': downvotes}).eq('id', barrier_id).execute()
            
            if not update_response.data:
                return None

            return await self.get_barrier_by_id(barrier_id)

        except Exception as e:
            logger.error(f"Error casting vote: {e}")
            raise

    async def add_comment(self, barrier_id: str, user_id: str, content: str) -> Optional[Dict]:
        """Add a comment to a barrier"""
        try:
            comment_data = {'barrier_id': barrier_id, 'user_id': user_id, 'content': content}
            response = self.client.table('comments').insert(comment_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error adding comment: {e}")
            raise
    
    async def _get_barriers_nearby_fallback(
        self, 
        latitude: float, 
        longitude: float, 
        radius_meters: int,
        status: str,
        category: Optional[str],
        limit: int
    ) -> List[Dict]:
        """Fallback query without PostGIS RPC (for development)"""
        try:
            # Approximate 1 degree latitude = 111km
            lat_delta = radius_meters / 111000
            lng_delta = radius_meters / (111000 * abs(math.cos(math.radians(latitude))))
            
            query = self.client.table('barriers').select('*')\
                .eq('status', status)\
                .gte('latitude', latitude - lat_delta)\
                .lte('latitude', latitude + lat_delta)\
                .gte('longitude', longitude - lng_delta)\
                .lte('longitude', longitude + lng_delta)
            
            if category:
                query = query.eq('category', category)
            
            response = query.execute()
            
            # Filter by exact distance
            barriers = []
            for barrier in response.data:
                distance = self._haversine_distance(
                    latitude, longitude,
                    barrier['latitude'], barrier['longitude']
                )
                if distance <= radius_meters:
                    barrier['distance'] = distance
                    barriers.append(barrier)
            
            # Sort by distance and apply limit
            barriers.sort(key=lambda x: x['distance'])
            return barriers[:limit]
            
        except Exception as e:
            logger.error(f"Error in fallback query: {e}")
            return []
    
    async def update_barrier(self, barrier_id: str, updates: Dict) -> Optional[Dict]:
        """Update a barrier"""
        try:
            updates['updated_at'] = datetime.utcnow().isoformat()
            response = self.client.table('barriers').update(updates).eq('id', barrier_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error updating barrier: {e}")
            raise
    
    async def delete_barrier(self, barrier_id: str) -> bool:
        """Soft delete a barrier (mark as archived)"""
        try:
            response = self.client.table('barriers').update({'status': 'archived'}).eq('id', barrier_id).execute()
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error deleting barrier: {e}")
            return False
    
    # ============================================
    # VOTE OPERATIONS
    # ============================================
    
    async def add_vote(self, barrier_id: str, user_id: str, vote_type: str) -> Dict:
        """Add or update a vote on a barrier"""
        try:
            # Check if vote exists
            existing = self.client.table('barrier_votes')\
                .select('*')\
                .eq('barrier_id', barrier_id)\
                .eq('user_id', user_id)\
                .execute()
            
            if existing.data:
                # If same vote type, remove it (toggle off)
                if existing.data[0]['vote_type'] == vote_type:
                    self.client.table('barrier_votes').delete()\
                        .eq('id', existing.data[0]['id']).execute()
                    return {'action': 'removed', 'vote_type': vote_type}
                else:
                    # Different vote type - update
                    response = self.client.table('barrier_votes')\
                        .update({'vote_type': vote_type})\
                        .eq('id', existing.data[0]['id']).execute()
                    return {'action': 'updated', 'vote_type': vote_type}
            else:
                # New vote
                vote_data = {
                    'barrier_id': barrier_id,
                    'user_id': user_id,
                    'vote_type': vote_type
                }
                response = self.client.table('barrier_votes').insert(vote_data).execute()
                return {'action': 'added', 'vote_type': vote_type}
                
        except Exception as e:
            logger.error(f"Error adding vote: {e}")
            raise
    
    async def get_user_vote(self, barrier_id: str, user_id: str) -> Optional[str]:
        """Get user's vote on a barrier"""
        try:
            response = self.client.table('barrier_votes')\
                .select('vote_type')\
                .eq('barrier_id', barrier_id)\
                .eq('user_id', user_id)\
                .execute()
            return response.data[0]['vote_type'] if response.data else None
        except Exception as e:
            logger.error(f"Error getting user vote: {e}")
            return None
    
    # ============================================
    # ACHIEVEMENT OPERATIONS
    # ============================================
    
    async def get_achievements(self) -> List[Dict]:
        """Get all achievements"""
        try:
            response = self.client.table('achievements').select('*').execute()
            return response.data if response.data else []
        except Exception as e:
            logger.error(f"Error getting achievements: {e}")
            return []
    
    async def get_user_achievements(self, user_id: str) -> List[Dict]:
        """Get user's earned achievements"""
        try:
            response = self.client.table('user_achievements')\
                .select('*, achievements(*)')\
                .eq('user_id', user_id)\
                .execute()
            return response.data if response.data else []
        except Exception as e:
            logger.error(f"Error getting user achievements: {e}")
            return []
    
    async def check_and_award_achievements(self, user_id: str) -> List[Dict]:
        """Check user stats and award any new achievements"""
        # Get user profile
        profile = await self.get_profile(user_id)
        if not profile:
            return []
        
        # Get all achievements
        all_achievements = await self.get_achievements()
        user_achievements = await self.get_user_achievements(user_id)
        earned_ids = [ua['achievement_id'] for ua in user_achievements]
        
        new_achievements = []
        
        for achievement in all_achievements:
            if achievement['id'] in earned_ids:
                continue
            
            criteria = achievement['criteria']
            earned = False
            
            # Check different criteria types
            if criteria.get('type') == 'first_report':
                if profile['reports_count'] >= criteria.get('count', 1):
                    earned = True
            
            elif criteria.get('type') == 'validations':
                if profile['validations_count'] >= criteria.get('count', 10):
                    earned = True
            
            elif criteria.get('type') == 'reports_in_area':
                if profile['reports_count'] >= criteria.get('count', 5):
                    earned = True
            
            elif criteria.get('type') == 'routes_saved':
                # This would need a separate table to track saved routes
                pass
            
            elif criteria.get('type') == 'validated_reports':
                # This would need to count how many of user's reports were validated
                pass
            
            if earned:
                # Award achievement
                award_data = {
                    'user_id': user_id,
                    'achievement_id': achievement['id']
                }
                self.client.table('user_achievements').insert(award_data).execute()
                
                # Add points
                await self.increment_user_points(user_id, achievement['points_reward'])
                
                new_achievements.append(achievement)
        
        return new_achievements
    
    # ============================================
    # ROUTE OPERATIONS
    # ============================================
    
    async def save_route(self, route_data: Dict) -> Optional[Dict]:
        """Save a calculated route"""
        try:
            # Add PostGIS points if coordinates exist
            if 'start_lat' in route_data and 'start_lng' in route_data:
                route_data['start_location'] = f"POINT({route_data['start_lng']} {route_data['start_lat']})"
            if 'end_lat' in route_data and 'end_lng' in route_data:
                route_data['end_location'] = f"POINT({route_data['end_lng']} {route_data['end_lat']})"
            
            response = self.client.table('routes').insert(route_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error saving route: {e}")
            raise
    
    # ============================================
    # HELPER FUNCTIONS
    # ============================================
    
    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points in meters using Haversine formula"""
        R = 6371000  # Earth's radius in meters
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = math.sin(delta_lat / 2) ** 2 + \
            math.cos(lat1_rad) * math.cos(lat2_rad) * \
            math.sin(delta_lon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c

# Create singleton instance
supabase_service = SupabaseService()