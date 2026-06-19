from app.models.user_stats import UserStats, RankCategory
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

class LevelingService:

    XP_EASY = 10
    XP_MEDIUM = 20
    XP_HARD = 30

    @staticmethod
    def xp_required_for_level(level: int) -> int:
        return (level**2) * 200

    @staticmethod
    def calculate_xp_for_completion(track_time: bool, time_spent_minutes: float | int | None) -> int:
        if not track_time:
            return LevelingService.XP_EASY

        if time_spent_minutes is None:
            return LevelingService.XP_EASY

        minutes = int(round(time_spent_minutes))
        if minutes < 20:
            return LevelingService.XP_EASY
        if minutes <= 60:
            return LevelingService.XP_MEDIUM
        return LevelingService.XP_HARD
    
    @staticmethod
    def calculate_rank(level: int, streak: int) -> RankCategory:
        if level == 5 and streak >= 21:
            return RankCategory.SS

        rank_map = {
            5: RankCategory.S,
            4: RankCategory.A,
            3: RankCategory.B,
            2: RankCategory.C,
        }

        return rank_map.get(level, RankCategory.D)

    @staticmethod
    def add_xp(user_id: int, xp_gained: int, db: Session) -> UserStats:
        user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
        if not user_stats:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User stats not found")
        
        user_stats.total_xp = user_stats.total_xp + xp_gained
        user_stats.current_level_xp = user_stats.current_level_xp + xp_gained
        xp_to_next_level = LevelingService.xp_required_for_level(user_stats.level)
        while user_stats.current_level_xp >= xp_to_next_level and user_stats.level < 5:
            user_stats.level += 1
            dif = user_stats.current_level_xp - xp_to_next_level
            user_stats.current_level_xp = dif 
            xp_to_next_level = LevelingService.xp_required_for_level(user_stats.level)
        user_stats.xp_to_next_level = xp_to_next_level
        user_stats.level_progress_pct = (user_stats.current_level_xp / xp_to_next_level) * 100
        user_stats.rank = LevelingService.calculate_rank(user_stats.level, user_stats.streak)
        db.commit()
        db.refresh(user_stats)
        return user_stats

    @staticmethod
    def get_user_stats(user_id: int, db: Session) -> UserStats:
        user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
        if not user_stats:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User stats not found")
        return user_stats