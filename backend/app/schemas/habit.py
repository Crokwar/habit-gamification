from pydantic import BaseModel, ConfigDict, Field
from app.models.habits import HabitCategory
from datetime import datetime
from app.models.timer_sessions import TimerStatus


class HabitBase(BaseModel):
    title: str
    description: str | None = None
    category: HabitCategory
    is_public: bool
    track_time: bool
    days_of_week: list[int] = Field(default_factory=lambda: [0,1,2,3,4])

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: HabitCategory | None = None
    is_public: bool | None = None
    track_time: bool | None = None

class HabitResponse(HabitBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

#Respuesta para el checklist del dashboard
class HabitTodayResponse(HabitResponse):
    is_completed_today: bool

#Respuesta para la completacion de un habito con o sin timer
class HabitCompletionResponse(BaseModel):
    id: int
    user_id: int
    completed_at: datetime
    timer_session_id: int | None = None 
    time_spent: int | None = None 
    points_earned: int

    model_config = ConfigDict(from_attributes=True)

#Esquema para timers
class  TimerSessionResponse(BaseModel):
    id: int
    user_id: int
    habit_id: int
    started_at: datetime
    ended_at: datetime | None = None
    status: TimerStatus
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

#Respuesta para la completacion de un habito
class HabitCompleteRequest(BaseModel):
    time_spent: int | None = None 