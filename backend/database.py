from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./subsync.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Import model modules so that they are registered on the metadata
# before creating tables. This avoids "no such table" errors when
# the app (or tests) run queries on the models.
try:
    # local import to avoid circular import during module initialization
    import models_db  # noqa: F401
except Exception:
    # If import fails at development time, we still allow the module to
    # initialize; the caller can import models_db later. Errors will be
    # surfaced when attempting DB operations.
    models_db = None

# Create all tables (safe to call multiple times)
from sqlalchemy import inspect
try:
    engine_has_tables = inspect(engine).has_table
    Base.metadata.create_all(bind=engine)
except Exception:
    # If the database engine isn't ready at import time, skip creation.
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
