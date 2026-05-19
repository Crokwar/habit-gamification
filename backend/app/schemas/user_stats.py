from pydantic import BaseModel, ConfigDict
from app.models.user_stats import RankCategory

#respuesta para stadisticas

class UserStatsResponse(BaseModel):
    total_xp: int
    current_level_xp: int
    xp_to_next_level: int
    level: int
    level_progress_pct: float
    streak: int
    rank: RankCategory

    model_config = ConfigDict(from_attributes=True)