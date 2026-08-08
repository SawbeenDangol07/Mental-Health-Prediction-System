# ============================
# STEP 1: Load Dataset
# ============================

import pandas as pd
import numpy as np
import re
import matplotlib.pyplot as plt
import seaborn as sns

from textblob import TextBlob

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from sklearn.svm import LinearSVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    f1_score,
    classification_report,
    confusion_matrix
)

from scipy.sparse import hstack

from IPython.display import display, HTML

# Load Dataset

print("Loading dataset from Drive...")
file_path = '/content/mental_health.csv'
df = pd.read_csv(file_path)
df

# ============================
# STEP 2: Data Preparation
# ============================

# Remove Personality Disorder and Stress
df = df[~df['status'].str.contains(
    'Personality disorder|Stress',
    case=False,
    na=False
)]

# Remove missing values
df = df.dropna(subset=['text', 'status'])

# Remove duplicate text
df = df.drop_duplicates(subset=['text'])

print("Dataset Shape:", df.shape)

print("\nClass Distribution:")
print(df['status'].value_counts())

# ============================
# STEP 3: Text Cleaning
# ============================

def clean_text(text):

    if not isinstance(text, str):
        return ""

    text = text.lower()

    # Remove punctuation
    text = re.sub(r"[^\w\s]", "", text)

    return text


print("\nCleaning text...")

df["cleaned_text"] = df["text"].apply(clean_text)

# ============================
# STEP 4: Sentiment Features
# ============================

print("Calculating Polarity & Subjectivity...")

df["polarity"] = df["cleaned_text"].apply(
    lambda x: TextBlob(str(x)).sentiment.polarity
)

df["subjectivity"] = df["cleaned_text"].apply(
    lambda x: TextBlob(str(x)).sentiment.subjectivity
)

print("\nAverage Polarity by Class")
print(df.groupby("status")["polarity"].mean())

# ============================
# STEP 5: TF-IDF Features
# ============================

print("\nApplying TF-IDF...")

custom_stop_words = set(ENGLISH_STOP_WORDS)

negation_words = {
    "not",
    "no",
    "never",
    "none",
    "cannot",
    "neither",
    "nor",
    "nothing",
    "without"
}

custom_stop_words = list(custom_stop_words - negation_words)

tfidf = TfidfVectorizer(

    stop_words=custom_stop_words,

    max_features=25000,

    ngram_range=(1,3),

    sublinear_tf=True,

    min_df=3

)

# TF-IDF

X_text = tfidf.fit_transform(df["cleaned_text"])

# Sentiment

X_sentiment = df[["polarity","subjectivity"]].values

# Combine Features

X = hstack([X_text, X_sentiment])

# Labels

y = df["status"]

# ============================
# STEP 6: Train-Test Split
# ============================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)

# ============================
# STEP 7: Train SVM
# ============================

print("\nTraining Linear SVM...")

model = LinearSVC(

    C=0.1,

    random_state=42,

    max_iter=10000

)

model.fit(X_train, y_train)

# ============================
# STEP 8: Prediction
# ============================

y_pred = model.predict(X_test)

# ============================
# STEP 9: Evaluation
# ============================

acc = accuracy_score(y_test, y_pred)

prec = precision_score(

    y_test,

    y_pred,

    average="weighted"

)

f1 = f1_score(

    y_test,

    y_pred,

    average="weighted"

)

metrics_df = pd.DataFrame({

    "Metric":[

        "Accuracy",

        "Precision",

        "F1-Score",

        "Model"

    ],

    "Value":[

        f"{acc*100:.2f}%",

        f"{prec*100:.2f}%",

        f"{f1*100:.2f}%",

        "LinearSVC + TF-IDF + Sentiment"

    ]

})

display(HTML("<h3>Final Results</h3>"))

display(metrics_df)

# ============================
# STEP 10: Classification Report
# ============================

report = classification_report(

    y_test,

    y_pred,

    output_dict=True

)

report_df = pd.DataFrame(report).transpose()

display(HTML("<h3>Classification Report</h3>"))

display(report_df.round(4))

# ============================
# STEP 11: Confusion Matrix
# ============================

cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(10,8))

sns.heatmap(

    cm,

    annot=True,

    fmt="d",

    cmap="Greens",

    xticklabels=model.classes_,

    yticklabels=model.classes_

)

plt.xlabel("Predicted Label")

plt.ylabel("Actual Label")

plt.title("Linear SVM Confusion Matrix")

plt.tight_layout()

plt.show()

# ============================
# STEP 12: Final Scores
# ============================

print("\n========== FINAL RESULTS ==========")

print(f"Accuracy : {acc*100:.2f}%")

print(f"Precision: {prec*100:.2f}%")

print(f"F1 Score : {f1*100:.2f}%")