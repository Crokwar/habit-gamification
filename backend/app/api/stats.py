from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user_stats import UserStatsResponse
from app.models.user import User
from app.core.security import get_current_user
from app.core.database import get_db
from app.services.leveling_service import LevelingService
from sqlalchemy.orm import Session

router = APIRouter(prefix="/user/me/stats", tags=["Stats"])

@router.get("", response_model=UserStatsResponse, status_code=status.HTTP_200_OK)
def get_user_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return LevelingService.get_user_stats(current_user.id, db)