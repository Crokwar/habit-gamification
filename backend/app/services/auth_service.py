from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import UserRegister
from app.core.security import get_password_hash, verify_password

class AuthService:

    @staticmethod  # funcion helper
    def create_user(db: Session, user_data: UserRegister) -> User:
        """
        Crear nuevo usuario en la base de datos
        """
        # verificar existencia del email
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # verificar usuario existencia
        existing_username = db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # hashear contraseña
        hashed_password = get_password_hash(user_data.password)

        # crear nuevo usuario
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            password_hash=hashed_password
        )

        # guardar usuario nuevo en la DB
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """
        Autenticar usuario verificando email y contraseña
        """
        # buscar usuario por email
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None

        # verificar contraseña
        if not verify_password(password, user.password_hash):
            return None
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        """
        Obtener usuario por email
        """
        return db.query(User).filter(User.email == email).first()
        


        


