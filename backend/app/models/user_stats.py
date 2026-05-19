from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, func, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum
from datetime import datetime, timezone

class RankCategory(str, enum.Enum):
    D = "D"
    C = "C"
    B = "B"
    A = "A"
    S = "S"
    SS = "SS"

class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_xp = Column(Integer, nullable=False, default=0)
    current_level_xp = Column(Integer, nullable=False, default=0) #xp total del nivel actual
    xp_to_next_level = Column(Integer, nullable=False, default=200)
    level = Column(Integer, nullable=False, default=1)
    level_progress_pct = Column(Numeric(5, 2), nullable=False, default=0)
    streak = Column(Integer, nullable=False, default=0)
    rank = Column(Enum(RankCategory), nullable=False, default=RankCategory.D)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates = "user_stats")