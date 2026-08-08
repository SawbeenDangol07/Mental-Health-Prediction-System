"""
=============================================================================
Mental Health SVM Predictor Module
=============================================================================
This module handles loading pre-trained Machine Learning models (.pkl files),
preprocessing user input text, extracting sentiment & TF-IDF features, and 
running predictions using a Linear Support Vector Machine (LinearSVC).

Model Files Used:
- backend/model/mental_health_svm.pkl (LinearSVC Classifier)
- backend/model/tfidf_vectorizer.pkl (TF-IDF Feature Extractor)
=============================================================================
"""

import os
import re
import joblib
import numpy as np
from scipy.sparse import hstack
from scipy.special import softmax
from textblob import TextBlob

# Paths to the saved ML models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "mental_health_svm.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "model", "tfidf_vectorizer.pkl")

# Global variables to store loaded models in memory
model = None
tfidf_vectorizer = None


def load_models():
    """
    Load the saved SVM model and TF-IDF vectorizer into memory.
    This function is called automatically when the FastAPI server starts up.
    """
    global model, tfidf_vectorizer

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"SVM Model file not found at: {MODEL_PATH}")
    if not os.path.exists(VECTORIZER_PATH):
        raise FileNotFoundError(f"TF-IDF Vectorizer file not found at: {VECTORIZER_PATH}")

    print("Loading Machine Learning models into memory...")
    model = joblib.load(MODEL_PATH)
    tfidf_vectorizer = joblib.load(VECTORIZER_PATH)
    print("Models loaded successfully!")
    print(f"Supported Classes: {model.classes_}")


def clean_text(text: str) -> str:
    """
    Clean and normalize user input text.
    Matches the exact preprocessing step used during model training in Mental_health_Using_SVM.py:
    1. Converts text to lowercase.
    2. Removes punctuation characters using regular expressions.
    
    :param text: Raw text input from user
    :return: Cleaned text string
    """
    if not isinstance(text, str):
        return ""
    
    text = text.lower()
    # Remove punctuation (keep words and whitespace)
    text = re.sub(r"[^\w\s]", "", text)
    return text.strip()


def extract_features(cleaned_text: str):
    """
    Extract sentiment and TF-IDF features from cleaned text.
    
    Features built:
    - Sentiment Polarity (-1.0 to 1.0) and Subjectivity (0.0 to 1.0) via TextBlob
    - TF-IDF word n-gram features via pre-trained TfidfVectorizer
    - Horizontally stacked feature matrix matching training shape
    
    :param cleaned_text: Preprocessed text string
    :return: Combined scipy sparse matrix of features, polarity, subjectivity
    """
    # Calculate sentiment scores using TextBlob
    tb = TextBlob(cleaned_text)
    polarity = float(tb.sentiment.polarity)
    subjectivity = float(tb.sentiment.subjectivity)

    # Generate TF-IDF sparse feature vector
    X_text = tfidf_vectorizer.transform([cleaned_text])

    # Sentiment array shape (1, 2)
    X_sentiment = np.array([[polarity, subjectivity]])

    # Combine text and sentiment features into a single matrix
    X_combined = hstack([X_text, X_sentiment])

    return X_combined, polarity, subjectivity


def predict_mental_health(text: str) -> dict:
    """
    Main prediction entry point.
    Receives raw user text, cleans it, extracts features, performs LinearSVC classification,
    and calculates confidence percentage using softmax normalization over decision scores.
    
    :param text: User input text (e.g. "I feel anxious and tired")
    :return: Dictionary containing predicted label, confidence percentage, and sentiment metrics
    """
    # Ensure models are loaded
    if model is None or tfidf_vectorizer is None:
        load_models()

    # Step 1: Preprocess text
    cleaned = clean_text(text)
    if not cleaned:
        # Fallback for empty or whitespace-only inputs
        return {
            "inputText": text,
            "label": "Normal",
            "rawLabel": "normal",
            "confidence": 50.0,
            "polarity": 0.0,
            "subjectivity": 0.0
        }

    # Step 2: Extract features
    X, polarity, subjectivity = extract_features(cleaned)

    # Step 3: Run LinearSVC prediction
    prediction = model.predict(X)[0]  # returns e.g. 'normal', 'depression', 'anxiety', etc.

    # Step 4: Calculate confidence percentage from decision function scores
    decision_scores = model.decision_function(X)[0]
    probabilities = softmax(decision_scores)
    
    # Get highest probability index and convert to percentage
    predicted_idx = np.argmax(probabilities)
    confidence_pct = float(round(probabilities[predicted_idx] * 100, 1))

    # Normalize label string to match Frontend metadata keys
    # Map 'normal' -> 'Normal', 'depression' -> 'Depression', 'anxiety' -> 'Anxiety', etc.
    label_mapping = {
        "normal": "Normal",
        "depression": "Depression",
        "anxiety": "Anxiety",
        "bipolar": "Bipolar",
        "suicidal": "Suicidal"
    }

    raw_label = str(prediction).lower()
    ui_label = label_mapping.get(raw_label, raw_label.capitalize())

    return {
        "inputText": text,
        "label": ui_label,
        "rawLabel": raw_label,
        "confidence": confidence_pct,
        "polarity": round(polarity, 3),
        "subjectivity": round(subjectivity, 3)
    }
