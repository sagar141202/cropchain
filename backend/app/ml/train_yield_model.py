import numpy as np
import pandas as pd
import pickle
import os
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

OUTPUT_DIR = os.path.dirname(__file__)

BASE_YIELDS = {
    0: 25, 1: 30, 2: 22, 3: 18, 4: 350, 5: 15, 6: 18,
    7: 120, 8: 100, 9: 130, 10: 14, 11: 12, 12: 60, 13: 25
}

def generate_training_data(n_samples=10000):
    np.random.seed(42)
    records = []

    for _ in range(n_samples):
        crop_enc = np.random.randint(0, 14)
        area = np.random.uniform(0.5, 20.0)
        soil_enc = np.random.randint(0, 6)
        irrigation_enc = np.random.randint(0, 5)
        rainfall = np.random.uniform(300, 2000)
        temp = np.random.uniform(15, 40)
        season_enc = np.random.randint(0, 4)

        base = BASE_YIELDS[crop_enc]

        # Linear features — directly usable by LinearRegression
        rainfall_bonus = (rainfall - 800) * 0.01 * base / 20
        temp_penalty = 0 if 20 <= temp <= 32 else -base * 0.15
        soil_bonus = base * 0.15 if soil_enc in [0, 1] else 0
        irrigation_bonus = base * 0.20 if irrigation_enc in [0, 1] else 0
        area_contribution = area * base

        yield_val = (area_contribution
                     + rainfall_bonus * area
                     + temp_penalty * area / 20
                     + soil_bonus * area / 10
                     + irrigation_bonus * area / 10
                     + np.random.normal(0, base * area * 0.05))

        yield_val = max(yield_val, 0.5)

        records.append([crop_enc, area, soil_enc, irrigation_enc,
                        rainfall, temp, season_enc,
                        crop_enc * area,        # interaction feature
                        rainfall * area / 1000, # interaction feature
                        yield_val])

    df = pd.DataFrame(records, columns=[
        "crop_enc", "area_acres", "soil_enc", "irrigation_enc",
        "avg_rainfall", "avg_temp", "season_enc",
        "crop_area_interact", "rain_area_interact",
        "yield_quintals"
    ])
    return df

def train_yield_model():
    print("🌾 Training Yield Prediction Model...")
    df = generate_training_data()

    feature_cols = [
        "crop_enc", "area_acres", "soil_enc", "irrigation_enc",
        "avg_rainfall", "avg_temp", "season_enc",
        "crop_area_interact", "rain_area_interact"
    ]
    X = df[feature_cols].values
    y = df["yield_quintals"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LinearRegression())
    ])
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_pred = np.maximum(y_pred, 0)

    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"✅ Yield Model trained successfully!")
    print(f"   R² Score: {r2:.4f}")
    print(f"   RMSE: {np.sqrt(mse):.4f} quintals")
    print(f"   Training samples: {len(X_train)}")
    print(f"   Test samples: {len(X_test)}")

    # wheat=0, area=5, alluvial=0, canal=4, rainfall=750, temp=24, rabi=1
    # crop_area=0*5=0, rain_area=750*5/1000=3.75
    sample = np.array([[0, 5.0, 0, 4, 750, 24, 1, 0*5, 750*5/1000]])
    sample_pred = max(float(pipeline.predict(sample)[0]), 0)
    print(f"   Sample prediction (wheat, 5 acres, haryana): {sample_pred:.2f} quintals")

    model_path = os.path.join(OUTPUT_DIR, "yield_model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(pipeline, f)
    print(f"   Saved to: {model_path}")
    return pipeline

if __name__ == "__main__":
    train_yield_model()
