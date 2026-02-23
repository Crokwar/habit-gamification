from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import enum

class HabitCategory(str, enum.Enum):
    health = "health"
    finance = "finance"
    personal = "personal"
    work = "work"
    hobby = "hobby"
    study = "study"
    other = "other"

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(200), nullable=True)
    category = Column(Enum(HabitCategory), nullable=False)
    is_public = Column(Boolean, default=False)
    track_time = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    completions = relationship("HabitCompletion", back_populates="habit")
    user = relationship("User", back_populates="habits")


class HabitCompletion(Base):
    __tablename__ = "habit_completions"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    time_spent = Column(Integer, nullable=True)  # minutes, solo si track_time=True
    points_earned = Column(Integer, default=1, nullable=False)

    # Relaciones
    habit = relationship("Habit", back_populates="completions")