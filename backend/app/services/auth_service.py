from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # In a real app, you would decode the token and get the user from the database
    # For now, we'll return a dummy user
    return User(id="a_valid_user_id_placeholder", email="test@example.com")
