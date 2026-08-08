"""
=============================================================================
Database Configuration Module (Neon PostgreSQL)
=============================================================================
This module initializes the SQLAlchemy engine and session factory for connecting
the FastAPI backend to the Neon Serverless PostgreSQL Database.

Environment variable DATABASE_URL is loaded from backend/.env.
=============================================================================
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from backend/.env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)

# Fetch DATABASE_URL from .env
raw_db_url = os.getenv("DATABASE_URL", "").strip()

# Handle Neon / SQLAlchemy URL formatting
if raw_db_url.startswith("postgres://"):
    # SQLAlchemy requires 'postgresql://' instead of legacy 'postgres://'
    DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://", 1)
elif raw_db_url:
    DATABASE_URL = raw_db_url
else:
    # Fallback to local SQLite database if DATABASE_URL is not set
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'mental_health_fallback.db')}"
    print("Warning: DATABASE_URL not set in .env. Falling back to local SQLite database.")

# Configure Engine
# SQLite requires 'check_same_thread: False', PostgreSQL does not
engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Recommended settings for PostgreSQL (Neon) connection pooling
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(DATABASE_URL, **engine_kwargs)

# Session factory for DB transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a transactional database session per request.
    Automatically closes the session when the request is completed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection():
    """
    Tests database connection on startup.
    Prints status to server logs.
    """
    try:
        with engine.connect() as connection:
            print("Successfully connected to Neon PostgreSQL database!")
            return True
    except Exception as e:
        print(f"Database connection check warning: {e}")
        return False
