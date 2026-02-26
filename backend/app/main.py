from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, habits

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API de hábitos productivos gamificado",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  
    ],  # modificar En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(habits.router)

@app.get("/")
def root():
    return {
        "message": "Habit Gamification API",
        "version": settings.VERSION,
        "docs": "/docs"
    }