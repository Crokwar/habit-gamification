from app.schemas.habit import HabitResponse, HabitCreate, HabitUpdate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.habit_service import HabitService
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter(prefix="/habits", tags=["Habits"])

@router.get("", response_model=list[HabitResponse], status_code=status.HTTP_200_OK)
def get_list_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return HabitService.get_habits(db, current_user.id)

@router.get("/{habit_id}", response_model=HabitResponse, status_code=status.HTTP_200_OK)
def get_habit(habit_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = HabitService.get_habit(db, current_user.id, habit_id)
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay lista de habitos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return habit

@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(habit_data: HabitCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = HabitService.create_habit(db, current_user.id, habit_data)
    return habit

@router.put("/{habit_id}", response_model=HabitResponse, status_code=status.HTTP_200_OK)
def update_habit(habit_id: int, habit_data: HabitUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = HabitService.update_habit(db, current_user.id, habit_id, habit_data)
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El habito no existe",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return habit

@router.delete("/{habit_id}", response_model=HabitResponse, status_code=status.HTTP_200_OK)
def delete_habit(habit_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = HabitService.delete_habit(db, current_user.id, habit_id)
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe el habito",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return habit