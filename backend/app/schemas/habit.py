from pydantic import BaseModel, ConfigDict
from app.models.habits import HabitCategory
from datetime import datetime


class HabitBase(BaseModel):
    title: str
    description: str | None = None
    category: HabitCategory
    is_public: bool
    track_time: bool

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

