"""
=============================================================================
Mental Health Classification System - FastAPI Backend
=============================================================================
Framework: FastAPI (Python 3)
Database: Neon Serverless PostgreSQL (SQLAlchemy ORM)
ML Engine: Support Vector Machine (LinearSVC) & TF-IDF Vectorizer
=============================================================================
"""

import time
import datetime
from contextlib import asynccontextmanager
from typing import Optional, List

from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

# Database and ML imports
from database import engine, Base, get_db, check_db_connection
import db_models
from predictor import load_models, predict_mental_health


# =============================================================================
# FastAPI Application Lifecycle Event
# =============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan manager for FastAPI.
    - Loads Machine Learning models into memory.
    - Verifies Neon PostgreSQL connection and automatically creates/syncs tables:
      users, predictions, user_input_history.
    """
    print("Starting Mental Health FastAPI Backend with Neon DB...")
    
    # 1. Load ML models
    try:
        load_models()
    except Exception as e:
        print(f"Warning: Failed to load ML models at startup: {e}")

    # 2. Verify Database Connection & Create Tables
    try:
        check_db_connection()
        print("Creating and Syncing Database Tables in Neon PostgreSQL...")
        Base.metadata.create_all(bind=engine)
        print("Database Tables (users, predictions, user_input_history) verified and ready!")
    except Exception as e:
        print(f"Warning: Database initialization error: {e}")

    yield
    print("Shutting down Mental Health FastAPI Backend...")


# Initialize FastAPI app instance
app = FastAPI(
    title="Mental Health Classification API (Neon DB)",
    description="FastAPI Backend with Neon PostgreSQL Persistence, Dedicated User Input History, and LinearSVC Classification",
    version="1.2.0",
    lifespan=lifespan
)

# =============================================================================
# CORS Middleware Setup
# =============================================================================
origins = [
    "https://mental-health-prediction-system-orcin.vercel.app",  # Production Vercel Frontend
    "http://localhost:5173",  # Vite React dev server default
    "http://localhost:3000",  # Alternative React port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"                       # Allow all origins during development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Pydantic Data Models (Request & Response Validation Schemas)
# =============================================================================
class PredictionRequest(BaseModel):
    """Schema for incoming prediction requests."""
    text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Text expressing user's feelings, thoughts, or daily log",
        example="I feel deeply sad, hopeless, and empty inside for days now."
    )
    userId: Optional[str] = Field("guest", description="ID of the user making the request")
    sessionId: Optional[str] = Field(None, description="Optional chat session ID")


class PredictionResponse(BaseModel):
    """Schema for prediction API responses."""
    id: str
    userId: str
    inputText: str
    label: str
    rawLabel: str
    confidence: float
    polarity: float
    subjectivity: float
    timestamp: str


class HistoryRecordResponse(BaseModel):
    """Schema for prediction history item response."""
    id: str
    userId: str
    inputText: str
    label: str
    confidence: float
    polarity: Optional[float] = None
    subjectivity: Optional[float] = None
    timestamp: str


class UserInputHistoryResponse(BaseModel):
    """Schema for dedicated raw user input history response."""
    id: str
    userId: str
    sessionId: Optional[str]
    rawText: str
    wordCount: int
    charCount: int
    source: str
    timestamp: str


class UserSignupRequest(BaseModel):
    """Schema for user registration."""
    name: str = Field(..., example="Alex Johnson")
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., example="password123")


class UserLoginRequest(BaseModel):
    """Schema for user authentication."""
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., example="password123")


class UserResponse(BaseModel):
    """Schema for returned user profile."""
    id: str
    name: str
    email: str
    createdAt: str
    message: str


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/", tags=["General"])
async def root():
    """
    Root Endpoint.
    Returns API status, database type, and documentation links.
    """
    return {
        "status": "online",
        "service": "Mental Health Classification API",
        "database": "Neon Serverless PostgreSQL",
        "tables": ["users", "predictions", "user_input_history"],
        "model": "Linear Support Vector Machine (LinearSVC)",
        "docs_url": "/docs"
    }


@app.get("/ping", response_class=PlainTextResponse, tags=["General"])
@app.get("/keep-alive", response_class=PlainTextResponse, tags=["General"])
@app.get("/api/ping", response_class=PlainTextResponse, tags=["General"])
async def keep_alive():
    """
    Lightweight Open Keep-Alive / Ping Endpoint.
    Returns plain text 'pong' with zero database or ML processing overhead.
    Designed for cron jobs, UptimeRobot, or external pingers to keep backend server active and prevent cold starts/sleep.
    """
    return "pong"


@app.get("/health", tags=["General"])
async def health_check(db: Session = Depends(get_db)):
    """
    Health Check Endpoint.
    Verifies API server and Neon PostgreSQL database connection.
    """
    db_status = "connected"
    try:
        db.execute(db_models.User.__table__.select().limit(1))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "message": "Backend server and Neon Database are connected and running."
    }


@app.post(
    "/api/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    tags=["Prediction"]
)
async def predict(request: PredictionRequest, db: Session = Depends(get_db)):
    """
    Mental Health Classification Endpoint with Neon DB Persistence.
    
    1. Preprocesses text and extracts sentiment & TF-IDF features.
    2. Classifies text with SVM model.
    3. Persists prediction record into Neon DB `predictions` table.
    4. Persists raw user input log into Neon DB `user_input_history` table.
    """
    try:
        # Run ML prediction pipeline
        result = predict_mental_health(request.text)
        
        user_id = request.userId if request.userId else "guest"
        record_id = f"pred_{int(time.time() * 1000)}"
        input_history_id = f"input_{int(time.time() * 1000)}"
        iso_timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        # 1. Save prediction record to Neon Database
        db_prediction = db_models.PredictionRecord(
            id=record_id,
            user_id=user_id,
            input_text=request.text,
            label=result["label"],
            confidence=result["confidence"],
            polarity=result["polarity"],
            subjectivity=result["subjectivity"],
            created_at=datetime.datetime.utcnow()
        )
        db.add(db_prediction)

        # 2. Save dedicated raw input history record to Neon Database
        word_count = len(request.text.strip().split())
        char_count = len(request.text)
        db_input_log = db_models.UserInputHistory(
            id=input_history_id,
            user_id=user_id,
            session_id=request.sessionId,
            raw_text=request.text,
            word_count=word_count,
            char_count=char_count,
            source="home_classifier",
            created_at=datetime.datetime.utcnow()
        )
        db.add(db_input_log)

        db.commit()

        return {
            "id": record_id,
            "userId": user_id,
            "inputText": request.text,
            "label": result["label"],
            "rawLabel": result["rawLabel"],
            "confidence": result["confidence"],
            "polarity": result["polarity"],
            "subjectivity": result["subjectivity"],
            "timestamp": iso_timestamp
        }

    except Exception as e:
        db.rollback()
        print(f"Error during prediction or database save: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing your request: {str(e)}"
        )


@app.get(
    "/api/history",
    response_model=List[HistoryRecordResponse],
    tags=["History"]
)
async def get_history(userId: str = Query("guest"), db: Session = Depends(get_db)):
    """
    Fetch prediction history records from Neon DB for a specific user or guest.
    """
    try:
        query = db.query(db_models.PredictionRecord)
        if userId and userId != "all":
            query = query.filter(db_models.PredictionRecord.user_id == userId)
            
        records = query.order_by(db_models.PredictionRecord.created_at.desc()).limit(100).all()

        history_list = []
        for r in records:
            history_list.append({
                "id": r.id,
                "userId": r.user_id or "guest",
                "inputText": r.input_text,
                "label": r.label,
                "confidence": r.confidence,
                "polarity": r.polarity,
                "subjectivity": r.subjectivity,
                "timestamp": r.created_at.isoformat() + "Z" if r.created_at else datetime.datetime.utcnow().isoformat() + "Z"
            })
            
        return history_list

    except Exception as e:
        print(f"Error fetching history from Neon DB: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prediction history from database."
        )


@app.get(
    "/api/user-input-history",
    response_model=List[UserInputHistoryResponse],
    tags=["History"]
)
async def get_user_input_history(userId: str = Query("guest"), db: Session = Depends(get_db)):
    """
    Fetch dedicated raw user input logs (prompts, word count, char count) from Neon DB.
    """
    try:
        query = db.query(db_models.UserInputHistory)
        if userId and userId != "all":
            query = query.filter(db_models.UserInputHistory.user_id == userId)

        logs = query.order_by(db_models.UserInputHistory.created_at.desc()).limit(100).all()

        results = []
        for log in logs:
            results.append({
                "id": log.id,
                "userId": log.user_id or "guest",
                "sessionId": log.session_id,
                "rawText": log.raw_text,
                "wordCount": log.word_count or len(log.raw_text.split()),
                "charCount": log.char_count or len(log.raw_text),
                "source": log.source or "home_classifier",
                "timestamp": log.created_at.isoformat() + "Z" if log.created_at else datetime.datetime.utcnow().isoformat() + "Z"
            })

        return results

    except Exception as e:
        print(f"Error fetching user input history from Neon DB: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user input history from database."
        )


@app.delete(
    "/api/history",
    tags=["History"]
)
async def clear_history(userId: str = Query("guest"), db: Session = Depends(get_db)):
    """
    Clear prediction history and raw user input logs from Neon DB for a specific user.
    """
    try:
        db.query(db_models.PredictionRecord).filter(db_models.PredictionRecord.user_id == userId).delete()
        db.query(db_models.UserInputHistory).filter(db_models.UserInputHistory.user_id == userId).delete()
        db.commit()
        return {"status": "success", "message": f"History cleared for user: {userId}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear history: {str(e)}"
        )


# =============================================================================
# USER AUTHENTICATION ENDPOINTS (Connected to Neon DB)
# =============================================================================

@app.post(
    "/api/auth/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Authentication"]
)
async def signup(user_data: UserSignupRequest, db: Session = Depends(get_db)):
    """
    User Registration Endpoint connected to Neon Database.
    """
    try:
        # Check if user already exists
        existing_user = db.query(db_models.User).filter(db_models.User.email == user_data.email.lower().strip()).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

        # Create new user in Neon DB
        user_id = f"user_{int(time.time() * 1000)}"
        new_user = db_models.User(
            id=user_id,
            name=user_data.name.strip(),
            email=user_data.email.lower().strip(),
            password_hash=user_data.password,
            created_at=datetime.datetime.utcnow()
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return UserResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            createdAt=new_user.created_at.isoformat() + "Z",
            message="Account created successfully in Neon Database!"
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error during signup: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@app.post(
    "/api/auth/login",
    response_model=UserResponse,
    tags=["Authentication"]
)
async def login(credentials: UserLoginRequest, db: Session = Depends(get_db)):
    """
    User Login Endpoint connected to Neon Database.
    """
    try:
        user = db.query(db_models.User).filter(db_models.User.email == credentials.email.lower().strip()).first()
        
        if not user or user.password_hash != credentials.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password. Please try again."
            )

        return UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            createdAt=user.created_at.isoformat() + "Z" if user.created_at else datetime.datetime.utcnow().isoformat() + "Z",
            message="Login successful!"
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


# Run server if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
