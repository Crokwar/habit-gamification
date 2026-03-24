from sqlalchemy.orm import Session
from app.schemas.habit import TimerSessionResponse, HabitCompletionResponse
from app.models.timer_sessions import TimerSessions, TimerStatus
from datetime import datetime, timezone
from app.services.habit_service import HabitService
from app.models.habits import HabitCompletion
from fastapi import HTTPException, status
    
class TimerService:

    @staticmethod
    def start_timer(db: Session, user_id: int, habit_id: int) -> TimerSessionResponse:
        """
        Empezar el timer para un habito
        """

        # verificar si el habito existe
        habit_exist = HabitService.get_habit(db, user_id, habit_id)
        if not habit_exist:
            return None

        # verificar si el timer existe
        timer_exist = db.query(TimerSessions).filter(
            TimerSessions.habit_id == habit_id,
            TimerSessions.status == TimerStatus.running
        ).first()
        if timer_exist:
            return None

        new_timer = TimerSessions(
            user_id = user_id,
            habit_id = habit_id,
            status = TimerStatus.running,
            started_at = datetime.now(timezone.utc)
        )

        # guardar habito nuevo en la DB
        db.add(new_timer)
        db.commit()
        db.refresh(new_timer)

        return new_timer

    @staticmethod
    def stop_timer(db: Session, user_id: int, timer_session_id: int) -> HabitCompletionResponse:
        timer_session = db.query(TimerSessions).filter(TimerSessions.id == timer_session_id).first()

        if not timer_session:
            return None

        if not timer_session.user_id == user_id:
            return None

        if not timer_session.status == TimerStatus.running:
            return None

        try:
            # actualizar registro en TimerSessions table
            timer_session.status = TimerStatus.completed
            timer_session.ended_at = datetime.now(timezone.utc)

            # calcular time spent
            time_spent = (timer_session.ended_at - timer_session.started_at).total_seconds()/60

            # actualizar registro en HabitCompletion table
            completion = HabitCompletion(
                habit_id = timer_session.habit_id,
                user_id = timer_session.user_id,
                completed_at = timer_session.ended_at,
                timer_session_id = timer_session.id,
                time_spent = time_spent,
                points_earned = 1
            )

            db.add(completion)
            db.commit()
            db.refresh(completion)
            return completion
        except:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="error al completar el habito con timer",
            )

    @staticmethod
    def cancel_timer(db: Session, user_id: int, timer_session_id: int) -> bool:
        timer_session = db.query(TimerSessions).filter(TimerSessions.id == timer_session_id).first()

        if not timer_session:
            return False

        if not timer_session.user_id == user_id:
            return False

        if not timer_session.status == TimerStatus.running:
            return False

        timer_session.status = TimerStatus.canceled
        timer_session.ended_at = datetime.now(timezone.utc)

        db.commit()

        return True

    @staticmethod
    def get_active_timer(db: Session, user_id: int, habit_id: int) -> TimerSessionResponse | None:
        """
        Obtener el timer de habito
        """
        timer_session = db.query(TimerSessions).filter(
            TimerSessions.habit_id == habit_id,
            TimerSessions.user_id == user_id,
            TimerSessions.status == TimerStatus.running
        ).first()
        return timer_session