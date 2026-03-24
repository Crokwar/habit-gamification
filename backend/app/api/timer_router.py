from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.habit import TimerSessionResponse, HabitCompletionResponse
from app.models.user import User
from app.core.security import get_current_user
from app.core.database import get_db
from app.services.timer_service import TimerService

router = APIRouter(prefix="/habits", tags=["habits"])

@router.post("/{habit_id}/timer/start", response_model=TimerSessionResponse, status_code=status.HTTP_201_CREATED)
def start_timer(habit_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    timer = TimerService.start_timer(db, current_user.id, habit_id)
    if not timer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontro un habito para empezar o ya hay un habito activo"
        )
    return timer

@router.post("/{habit_id}/timer/{timer_id}/stop", response_model=HabitCompletionResponse, status_code=status.HTTP_200_OK)
def stop_timer(habit_id: int, timer_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit_completed =  TimerService.stop_timer(db, current_user.id, timer_id)
    if not habit_completed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe un timer para esta solicitud"
        )
    return habit_completed

@router.delete("/{habit_id}/timer/{timer_id}/cancel", response_model=None, status_code=status.HTTP_204_NO_CONTENT)
def cancel_timer(habit_id: int, timer_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = TimerService.cancel_timer(db, current_user.id, timer_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe un timer para esta solicitud"
        )
    return None

@router.get("/{habit_id}/timer", response_model=TimerSessionResponse | None, status_code=status.HTTP_200_OK)
def get_timer(habit_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    timer = TimerService.get_active_timer(db, current_user.id, habit_id)
    return timer