# Backend - Habit Gamification

## Setup
```bash
#Crear venv
python -m venv venv

#Activar Entorno Virtual 
venv\Scripts\activate


#Instalación de Dependencias
#Dirigirse a la carpeta del backend y ejecutar:
pip install -r requirements.txt

# Crear .env
copy .env.example .env
```

## Ejecutar
```bash
#Para poner a correr el backend ejecutar:
uvicorn main:app --reload
```

Acceder a:
 - API: http://localhost:8000
 - Docs: http://localhost:8000/docs




