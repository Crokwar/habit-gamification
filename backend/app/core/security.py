from datetime import datetime, timedelta  # manejo de fechas
from typing import Optional  # tipado opcional en funciones
from jose import JWTError, jwt  # libreria para JWT
from passlib.context import CryptContext  # Para manejar hashing de contraseñas
from app.core.config import settings  # configuraciones de app

# crear contexto para hashing usando bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# funcion para comparar contraseña string con hashing
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# convertir contraseñas en hashing
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# generador de JWT para autenticacion
def  create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
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
            algorithm=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
