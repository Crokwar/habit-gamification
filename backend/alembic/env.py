from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import sys 
from pathlib import Path

# agrega el directorio padre al path para importar app
sys.path.append(str(Path(__file__).resolve().parents[1]))

# Importar configuración y modelos
from app.core.config import settings
from app.core.database import Base

# Importar modelos 
# Importa cada modelo que se cree
from app.models.user import User
from app.models.habits import Habit, HabitCompletion

# Objeto de configuracion de Alembic
config = context.config

# Interpretar el archivo de configuración para el registro de Python
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# confuguracion de metada para autogenerar migraciones /metadate de los modelos 
target_metadata = Base.metadata


# Generar SQL en archivo, Para revisar/ejecutar manualmente
def run_migrations_offline() -> None:   # Generar SQL en archivo, Para revisar/ejecutar manualmente
    """Run migrations in 'offline' mode."""
    url = settings.DATABASE_URL
    context.configure(
        url=url,   # URL de conexión (solo para generar SQL)
        target_metadata=target_metadata,   # El "mapa" de modelos, para hacer comparaciones a la DB real
        literal_binds=True,   # Valores literales en SQL (no parámetros)
        dialect_opts={"paramstyle": "named"},   # Estilo de parámetros para el dialecto
    )

    with context.begin_transaction():
        context.run_migrations()


# Genera Y EJECUTA SQL directamente en la BD
def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()