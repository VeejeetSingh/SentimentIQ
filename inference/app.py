import sys
import warnings
from pathlib import Path

import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS

from preprocess import clean_tweet

# Make clean_tweet resolvable when vectorizer unpickles
sys.modules["__main__"].clean_tweet = clean_tweet
warnings.filterwarnings("ignore")

BASE = Path(__file__).parent
MODEL_DIR = BASE / "models"

# Load models at startup
try:
    vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer_1_6m.pkl")
    model = joblib.load(MODEL_DIR / "sentiment_model_1_6m.pkl")
    FEATURES = vectorizer.get_feature_names_out()
    COEF = model.coef_[0]
    MODEL_READY = True
    print("[OK] Models loaded successfully.")
except Exception as e:
    MODEL_READY = False
    FEATURES = None
    COEF = None
    print(f"[ERROR] Failed to load models: {e}")

app = Flask(__name__)
CORS(app)


@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok" if MODEL_READY else "error",
        "model_ready": MODEL_READY,
        "accuracy": 81.58,
        "model_type": "TF-IDF + Logistic Regression",
        "training_samples": "1.6M tweets",
        "classes": ["Positive", "Neutral", "Negative"],
    })


@app.post("/api/analyze")
def analyze():
    if not MODEL_READY:
        return jsonify({"error": "Model not loaded. Check server logs."}), 503

    data = request.get_json(silent=True) or {}
    text = str(data.get("text", "")).strip()

    if not text:
        return jsonify({"error": "Please provide non-empty text to analyze."}), 400
    if len(text) > 1000:
        return jsonify({"error": "Text is too long. Keep it under 1000 characters."}), 400

    cleaned = clean_tweet(text)
    if not cleaned:
        return jsonify({"error": "No analyzable words found after cleaning."}), 400

    X = vectorizer.transform([cleaned])
    proba = model.predict_proba(X)[0]
    p_neg_raw = float(proba[0])
    p_pos_raw = float(proba[1])

    coo = X.tocoo()
    contrib = {FEATURES[j]: float(v * COEF[j]) for j, v in zip(coo.col, coo.data)}
    max_w = max([abs(v) for v in contrib.values()] + [0.0])
    strong_pos = sum(v for v in contrib.values() if v > 0.35)
    strong_neg = sum(abs(v) for v in contrib.values() if v < -0.35)

    # Neutral detection:
    # 1. Balanced model probability (between 0.40 and 0.60)
    # 2. Informational/factual text without strong emotional words (max_w < 0.50)
    # 3. Conflicting balanced positive and negative indicators cancelling each other out
    is_neutral_zone = (
        (0.40 <= p_pos_raw <= 0.60)
        or (max_w < 0.50)
        or (strong_pos > 0.4 and strong_neg > 0.4 and abs(strong_pos - strong_neg) < 0.3)
    )

    if is_neutral_zone:
        sentiment = "Neutral"
        p_neu = max(0.50, round(1.0 - abs(p_pos_raw - 0.5) * 1.2, 4))
        p_pos = round((1.0 - p_neu) * p_pos_raw / max(1e-5, (p_pos_raw + p_neg_raw)), 4)
        p_neg = round(max(0.0, 1.0 - p_neu - p_pos), 4)
        confidence = p_neu
    elif p_pos_raw > 0.60:
        sentiment = "Positive"
        p_pos = round(p_pos_raw, 4)
        p_neu = round(max(0.01, (1.0 - p_pos) * 0.6), 4)
        p_neg = round(max(0.0, 1.0 - p_pos - p_neu), 4)
        confidence = p_pos
    else:
        sentiment = "Negative"
        p_neg = round(p_neg_raw, 4)
        p_neu = round(max(0.01, (1.0 - p_neg) * 0.6), 4)
        p_pos = round(max(0.0, 1.0 - p_neg - p_neu), 4)
        confidence = p_neg

    return jsonify({
        "sentiment": sentiment,
        "confidence": round(confidence, 4),
        "p_positive": round(p_pos, 4),
        "p_neutral": round(p_neu, 4),
        "p_negative": round(p_neg, 4),
        "cleaned_text": cleaned,
        "word_count": len(cleaned.split()),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)

