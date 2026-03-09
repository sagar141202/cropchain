import numpy as np
import pandas as pd
import pickle
import os
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report

OUTPUT_DIR = os.path.dirname(__file__)

MARKET_PRICES = {
    "wheat": 2200, "rice": 2800, "maize": 1800, "cotton": 6500,
    "sugarcane": 350, "soybean": 4200, "groundnut": 5500,
    "tomato": 1200, "onion": 1500, "potato": 1100,
    "mustard": 5200, "chickpea": 5800, "turmeric": 8500, "chilli": 9000
}

def generate_price_data():
    np.random.seed(42)
    records = []
    crops = list(MARKET_PRICES.keys())

    for _ in range(3000):
        crop = np.random.choice(crops)
        modal = MARKET_PRICES[crop]
        scenario = np.random.choice(["fair", "slightly_low", "exploitative"], p=[0.6, 0.25, 0.15])

        if scenario == "fair":
            offered = modal * np.random.uniform(0.92, 1.08)
            label = 1
        elif scenario == "slightly_low":
            offered = modal * np.random.uniform(0.75, 0.91)
            label = -1
        else:
            offered = modal * np.random.uniform(0.40, 0.74)
            label = -1

        deviation = ((modal - offered) / modal) * 100
        records.append({
            "offered_price": offered,
            "modal_price": modal,
            "deviation_percent": deviation,
            "true_label": label
        })

    return pd.DataFrame(records)

def train_anomaly_model():
    print("🔍 Training Fair Price Anomaly Detection Model...")
    df = generate_price_data()

    feature_cols = ["offered_price", "modal_price", "deviation_percent"]
    X = df[feature_cols].values

    fair_mask = df["true_label"] == 1
    X_fair = X[fair_mask]

    model = IsolationForest(
        contamination=0.15,
        n_estimators=100,
        random_state=42,
        max_samples="auto"
    )
    model.fit(X_fair)

    predictions = model.predict(X)
    true_labels = df["true_label"].values

    print(f"✅ Anomaly Model trained successfully!")
    print(f"   Training samples (fair prices): {len(X_fair)}")
    print(f"   Total evaluation samples: {len(X)}")
    print("\n   Classification Report:")
    print(classification_report(true_labels, predictions, target_names=["Anomaly", "Fair"]))

    model_path = os.path.join(OUTPUT_DIR, "anomaly_model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    print(f"   Saved to: {model_path}")

    return model

if __name__ == "__main__":
    train_anomaly_model()
