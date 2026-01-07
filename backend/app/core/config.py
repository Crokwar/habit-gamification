from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # configuracion de aplicacion, lee automanticamente las variables de entorno
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App
    PROJECT_NAME: str = "Habit Gamification API"
    VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()