from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
import enum
from sqlalchemy import Index

class TimerStatus(str, enum.Enum):
    running = "running"
    completed = "completed"
    canceled = "canceled"
    expired = "expired"

class TimerSessions(Base): # Solo puede existir UN habit_id donde status = 'running'
    __tablename__ = "timer_sessions"

    __table_args__ = (
    Index(
        'ix_one_running_timer_per_habit',
        'habit_id',
        unique=True,
        postgresql_where=text("status = 'running'")
    ),)

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)

    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    status = Column(Enum(TimerStatus), nullable=False, default="running")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="timer_sessions")
    habit = relationship("Habit", back_populates="timer_sessions")
    completions = relationship("HabitCompletion", uselist=False, back_populates="timer_session")