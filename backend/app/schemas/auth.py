from pydantic import BaseModel, EmailStr, Field, field_serializer
from datetime import datetime
from typing import Optional
# BaseModel es la clase que se encarga de hacer las validacion de tipos y Serializacion a JSON/dict

# Schema para register
class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=50)

# Schema para login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema de respuesta de usuario (sin password)
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    @field_serializer('id')
    def serialize_id(self, id: int) -> str:
        return str(id)  # ← sale como string hacia el frontend

    class Config:
        from_attributes = True   # Para SQLAlchemy 2.0

# Schema de respuesta de registro
class AuthResponse(BaseModel):
    token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):   # schema de cuerpo dentro del Token schema
    email: Optional[str] = None

# Schema de token
# class Token(BaseModel):   # schema de respuesta (Sobre) cuando el usuaruo hacer login exitoso
#    access_token: str
#    token_type: str   # tipo de token valor tipico "bearer" para que el front lo use como header