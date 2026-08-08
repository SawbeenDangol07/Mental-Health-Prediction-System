"""
=============================================================================
Database Models Module (SQLAlchemy ORM)
=============================================================================
Defines the database schema tables for the Mental Health application:
1. User: Stores registered user accounts.
2. PredictionRecord: Stores prediction logs and mental health classification history.
3. UserInputHistory: Stores dedicated user text input logs, word/char counts, and session metadata.
=============================================================================
"""

import datetime
from sqlalchemy import Column, String, Float, Text, DateTime, Integer
from database import Base


class User(Base):
    """
    User Account Table.
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PredictionRecord(Base):
    """
    Mental Health Prediction History Table.
    Stores input text, predicted class, confidence, and sentiment metrics.
    Supports both logged-in users and guest sessions.
    """
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True, index=True)
    input_text = Column(Text, nullable=False)
    label = Column(String, nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    polarity = Column(Float, nullable=True)
    subjectivity = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)


class UserInputHistory(Base):
    """
    Dedicated User Input History Table.
    Stores every text prompt submitted by users/guests, character/word count,
    source, and optional session ID for detailed user input analytics over time.
    """
    __tablename__ = "user_input_history"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True, index=True)
    session_id = Column(String, nullable=True)
    raw_text = Column(Text, nullable=False)
    word_count = Column(Integer, nullable=True)
    char_count = Column(Integer, nullable=True)
    source = Column(String, default="home_classifier")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
