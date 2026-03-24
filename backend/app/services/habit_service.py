from sqlalchemy.orm import Session
from app.schemas.habit import HabitResponse, HabitCreate, HabitUpdate, HabitTodayResponse, HabitCompleteRequest, TimerSessionResponse, HabitCompletionResponse
from app.models.habits import Habit, HabitCompletion
from app.models.timer_sessions import TimerSessions, TimerStatus
from sqlalchemy import func
from datetime import datetime, timezone
from fastapi import HTTPException, status

class HabitService: 

    @staticmethod
    def get_habits(db: Session, user_id: int) -> list[HabitResponse]:
        """
        Obtener lista de habitos del usuario
        """
        listHabits = db.query(Habit).filter(Habit.user_id == user_id).all()
        return listHabits

    @staticmethod
    def get_habit(db: Session, user_id: int, habit_id: int) -> HabitResponse:
        """
        Obtener habito del usuario
        """
        habit = db.query(Habit).filter(Habit.user_id == user_id, Habit.id == habit_id).first()
        return habit

    @staticmethod
    def create_habit(db: Session, user_id: int, habit_data: HabitCreate) -> HabitResponse:
        """
        Crear un nuevo habito en la db
        """
        # crear nuevo habito
        new_habit = Habit(
            user_id = user_id,
            title = habit_data.title,
            description = habit_data.description,
            category = habit_data.category,
            is_public = habit_data.is_public,
            track_time = habit_data.track_time
        )

        # guardar habito nuevo en la DB
        db.add(new_habit)
        db.commit()
        db.refresh(new_habit)

        return new_habit

    @staticmethod
    def update_habit(db: Session, user_id: int, habit_id: int, habit_data: HabitUpdate) -> HabitResponse:
        """
        Actualizar un habito en la db
        """
        habit = HabitService.get_habit(db, user_id, habit_id)
        for field, value in habit_data.model_dump(exclude_unset=True).items():
            setattr(habit, field, value)
        db.commit()
        db.refresh(habit)

        return habit

    @staticmethod
    def delete_habit(db: Session, user_id: int, habit_id: int) -> HabitResponse:
        """
        Eliminar un habito en la db
        """
        habit = HabitService.get_habit(db, user_id, habit_id)
        db.delete(habit)
        db.commit()

        return habit

    @staticmethod
    def get_habits_today(db: Session, user_id: int) -> list[HabitTodayResponse]:
        """
        Obtener lista de habitos del usuario con estado de completado hoy
        """
        today = datetime.now().date()
        dayOfWeek = datetime.now().weekday()

        results = (
            db.query(Habit, HabitCompletion)
            .outerjoin(
                HabitCompletion,
                (Habit.id == HabitCompletion.habit_id) &
                (func.date(HabitCompletion.completed_at) == today)
            )
            .filter(
                Habit.user_id == user_id,
                Habit.days_of_week.contains([dayOfWeek])
            )
            .all()
        )

        listHabitsResult = []

        for habit, completion in results:
            habit.is_completed_today = completion is not None
            listHabitsResult.append(HabitTodayResponse.model_validate(habit))
            
        return listHabitsResult
        
    @staticmethod
    def complete_habit(db: Session, user_id: int, habit_id: int, data: HabitCompleteRequest) -> HabitTodayResponse:
        """
        marcar como completado hoy un habito
        """
        # verificar si el habito existe y pertenece al usuario
        habit = HabitService.get_habit(db, user_id, habit_id)
        if not habit:
            return None

        # verificar si el habito se completo hoy o no
        today = datetime.now().date()
        existing = db.query(HabitCompletion).filter(
            HabitCompletion.habit_id == habit_id,
            HabitCompletion.user_id == user_id,
            func.date(HabitCompletion.completed_at) == today
        ).first()
        if existing:
            return None

        # crear un nuevo registro de completacion
        completion = HabitCompletion(
            habit_id = habit_id,
            user_id = user_id,
            time_spent = data.time_spent if data else None,
            points_earned = 1
        )
        db.add(completion)
        db.commit()

        # retornar el habito con true en completado
        habit.is_completed_today = True
        return HabitTodayResponse.model_validate(habit)


