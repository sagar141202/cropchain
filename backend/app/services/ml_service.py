import pickle
import numpy as np
import os
from typing import Optional

MODEL_DIR = os.path.join(os.path.dirname(__file__), "../ml")

def load_model(filename: str):
    path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    return None

CROP_ENCODING = {
    "wheat": 0, "rice": 1, "maize": 2, "cotton": 3,
    "sugarcane": 4, "soybean": 5, "groundnut": 6,
    "tomato": 7, "onion": 8, "potato": 9,
    "mustard": 10, "chickpea": 11, "turmeric": 12, "chilli": 13
}

SOIL_ENCODING = {
    "alluvial": 0, "black": 1, "red": 2,
    "laterite": 3, "sandy": 4, "clay": 5
}

IRRIGATION_ENCODING = {
    "drip": 0, "sprinkler": 1, "flood": 2,
    "rainfed": 3, "canal": 4
}

SEASON_ENCODING = {
    "kharif": 0, "rabi": 1, "zaid": 2, "annual": 3
}

def predict_yield(
    crop_name: str,
    area_acres: float,
    soil_type: str,
    irrigation_type: str,
    season: str,
    avg_rainfall: float = 800.0,
    avg_temp: float = 25.0
) -> dict:
    model = load_model("yield_model.pkl")

    crop_enc = CROP_ENCODING.get(crop_name.lower(), 0)
    soil_enc = SOIL_ENCODING.get(soil_type.lower(), 0)
    irrigation_enc = IRRIGATION_ENCODING.get(irrigation_type.lower(), 3)
    season_enc = SEASON_ENCODING.get(season.lower(), 0)

    if model is None:
        base_yields = {
            "wheat": 25, "rice": 30, "maize": 22, "cotton": 18,
            "sugarcane": 350, "soybean": 15, "groundnut": 18,
            "tomato": 120, "onion": 100, "potato": 130,
            "mustard": 14, "chickpea": 12, "turmeric": 60, "chilli": 25
        }
        base = base_yields.get(crop_name.lower(), 20)
        rainfall_factor = min(avg_rainfall / 800.0, 1.5)
        temp_factor = 1.0 if 20 <= avg_temp <= 30 else 0.85
        predicted = base * area_acres * rainfall_factor * temp_factor
    else:
        features = np.array([[crop_enc, area_acres, soil_enc, irrigation_enc,
                               avg_rainfall, avg_temp, season_enc]])
        predicted = float(model.predict(features)[0])

    confidence_range = predicted * 0.15
    return {
        "predicted_yield": round(predicted, 2),
        "confidence_min": round(predicted - confidence_range, 2),
        "confidence_max": round(predicted + confidence_range, 2),
        "unit": "quintals"
    }

def detect_price_anomaly(
    offered_price: float,
    modal_price: float,
    crop_name: str
) -> dict:
    model = load_model("anomaly_model.pkl")
    deviation = ((modal_price - offered_price) / modal_price) * 100

    if model is None:
        if deviation < 10:
            severity = "Fair"
            is_anomaly = False
            score = 0.1
        elif deviation < 25:
            severity = "Slightly Low"
            is_anomaly = True
            score = 0.5
        else:
            severity = "Exploitative"
            is_anomaly = True
            score = 0.9
    else:
        features = np.array([[offered_price, modal_price, deviation]])
        prediction = model.predict(features)[0]
        score = float(model.decision_function(features)[0])
        is_anomaly = prediction == -1
        if deviation < 10:
            severity = "Fair"
        elif deviation < 25:
            severity = "Slightly Low"
        else:
            severity = "Exploitative"

    recommendations = {
        "Fair": "The offered price is fair. You can proceed with the sale.",
        "Slightly Low": f"The price is {round(deviation, 1)}% below market rate. Try negotiating for at least ₹{round(modal_price * 0.95)}/quintal.",
        "Exploitative": f"WARNING: Price is {round(deviation, 1)}% below market rate. This appears exploitative. Contact your nearest APMC mandi or FPO immediately."
    }

    return {
        "is_anomaly": is_anomaly,
        "anomaly_score": round(abs(score), 3),
        "severity": severity,
        "deviation_percent": round(deviation, 2),
        "modal_price": modal_price,
        "offered_price": offered_price,
        "recommendation": recommendations[severity]
    }
