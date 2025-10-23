import joblib
import numpy as np
import json

# Load model and scaler
model = joblib.load("models/model.pkl")
scaler = joblib.load("scalers/scaler.pkl")

# Load metrics
with open("results/model_metrics.json") as f:
    metrics = json.load(f)

print("📈 Model metrics:")
for k, v in metrics.items():
    print(f"  {k}: {v:.4f}")

# Example: make a test prediction (using random example data)
# Replace this with a real sample from your dataset if you want
sample = np.random.rand(1, scaler.n_features_in_)  # same feature count as training
sample_scaled = scaler.transform(sample)
pred = model.predict(sample_scaled)

print("\n🔮 Example Prediction (SOH):", pred[0])
