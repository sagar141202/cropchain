from train_yield_model import train_yield_model
from train_anomaly_model import train_anomaly_model

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 CropChain ML Training Pipeline")
    print("=" * 50)
    train_yield_model()
    print()
    train_anomaly_model()
    print()
    print("=" * 50)
    print("✅ All models trained and saved successfully!")
    print("=" * 50)
