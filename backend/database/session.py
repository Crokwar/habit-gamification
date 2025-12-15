from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        echo=True
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
else:
    engine = None
    SessionLocal = None


def get_db():

    if SessionLocal is None:
        raise Exception("Base de Datos no configurada. Establezca un DATABASE_URL en el archivo .env")
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()