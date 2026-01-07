# documento para la la configuracion de la DB
# Todo el backend usa esto, nunca te conectas directo a la DB desde los endpoints.

from sqlalchemy import create_engine #conexion global para la DB
from sqlalchemy.ext.declarative import declarative_base #clase base para todos los modelos
from sqlalchemy.orm import sessionmaker #para crear sesiones de BD
from app.core.config import settings #importar la config.py del .env para DATABASE_URL

# crear engine para supabase
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,      # Verifica conexiones antes de usarlas
    pool_recycle=3600,       # Recicla conexiones cada hora
    echo=False,              # CambiaR a True para ver las queries SQL    
)

# SessionLocal para crear sesiones de DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# clase base para modelos; todos mis modelos heredan de esta Base - class User(Base):
Base = declarative_base()

# Dependency para obtener la sesion de DB en fastAPI
# “abre una conexión → préstala → ciérrala”
# Dependency es una funcion o clase llamable que se ejecuta antes de entrar el endpoint - Depends(get_db)

def get_db():
    db = SessionLocal() # una vez hecha una request se abre una sesion con la db
    try:
        yield db # se entrega la sesion al endpoint y una vez termina continua la funcion get_db aqui
    finally:
        db.close() # se cierre la sesion siempre






