from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database.session import get_db, engine
from database.base import Base

app = FastAPI(
    title="Habit Gamification API",
    version="0.1.0"
)


# Este evento es para verificar si todo lo de la Base de Datos se puso bien (Se puede eliminar)
@app.on_event("startup")
def on_startup():
    try:
        if engine is not None:
            Base.metadata.create_all(bind=engine)
            print("Tablas de base de datos creadas")
        else:
            print("Base de Datos no configurada. Establezca un DATABASE_URL en el archivo .env")
    except Exception as e:
        print(f"Conexion con la base de datos fallida: {e}")
        print("Ejecutando sin una base de datos por ahora")

# Este es como el Hello World solo para saber si el servidor funcionaba (Se puede cambiar)
@app.get("/")
def read_root():
    return {
        "message": "Habit Gamification API", 
        "status": "En Proceso",
        "version": "0.1.0",
        "docs": "/docs",
    }

# Este es para recibir un Check cuando ya se tenga la base de datos (Se puede eliminar)
@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    #Cuando la base de datos esté creada y conectada debería salir este return'
    try:
        db.execute("SELECT 1")
        return {
            "status": "Conectada",
            "message": "Base de Datos conectada Exitosamente"
        }
    #Cómo aún no está creada y conectada la base de datos saldrá este mensaje
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }