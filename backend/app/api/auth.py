from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.schemas.auth import UserRegister, UserLogin, UserResponse, AuthResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)  # 
def register(user_data: UserRegister, db: Session = Depends(get_db)):  #
    """
    Registrar nuevo usuario
    
    - **email**: Email válido (único)
    - **username**: Nombre de usuario (único, 3-50 caracteres)
    - **password**: Contraseña (mínimo 6 caracteres)
    """
    user = AuthService.create_user(db, user_data)
    access_token = create_access_token(data={"sub": user.email})
    return {
        "token": access_token,
        "token_type": "bearer",
        "user": user
    } 

@router.post("/login", response_model=AuthResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Iniciar sesión y obtener token JWT
    
    - **email**: Email del usuario
    - **password**: Contraseña del usuario
    
    Retorna un token JWT válido por 30 minutos
    """
    # autenticar usuario
    user = AuthService.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # crear token acceso
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    return {
        "token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/check-username/{username}")
def check_username(username: str, db: Session = Depends(get_db)):
    return { "available": AuthService.check_username_available(db, username) }

@router.get("/check-email/{email}")
def check_email(email: str, db: Session = Depends(get_db)):
    return { "available": AuthService.check_email_available(db, email) }


@router.get("/me", response_model=UserResponse)
def get_current_user_info(db: Session = Depends(get_db)):
    """
    Obtener información del usuario actual (requiere autenticación)
    
    TODO: Implementar middleware de autenticación // aqui todo el sprint para el perfil del usuario
    """
    # Esta ruta se implementará completamente en el futuro
    # cuando creemos el middleware de autenticación
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Endpoint not implemented yet"
    )