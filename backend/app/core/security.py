from datetime import datetime, timedelta  # manejo de fechas
from typing import Optional, Set  # tipado opcional en funciones
from jose import JWTError, jwt  # libreria para JWT
from passlib.context import CryptContext  # Para manejar hashing de contraseñas
from app.core.config import settings  # configuraciones de app
from app.core.database import get_db
from app.models.user import User
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

# crear contexto para hashing usando bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# conjunto en memoria para tokens revocados (logout)
revoked_tokens: Set[str] = set()


def revoke_token(token: str) -> None:
    """
    Marcar un token JWT como revocado (logout).
    Nota: este almacenamiento es sólo en memoria y se pierde al reiniciar el servidor.
    """
    revoked_tokens.add(token)


# funcion para comparar contraseña string con hashing
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# convertir contraseñas en hashing
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# generador de JWT para autenticacion
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()  # crear una copia del diccionario para no alterar el original, define que va en el token
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


# Validar y decodificar token JWT
def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        return None
    except Exception as e:
        return None


# extraer el usuario del jwt
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User: 
    # verificar si el token fue revocado (logout)
    if token in revoked_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token revocado, por favor inicia sesión de nuevo",
            headers={"WWW-Authenticate": "Bearer"},
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: int = int(payload.get("sub"))
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user