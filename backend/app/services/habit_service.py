from sqlalchemy.orm import Session
from app.schemas.habit import HabitResponse, HabitCreate, HabitUpdate
from app.models.habits import Habit


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