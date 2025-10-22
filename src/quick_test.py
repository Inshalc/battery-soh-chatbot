# quick_test.py
import joblib, pandas as pd
from src.config import FEATURE_COLS
row = pd.read_csv("data/processed_data.csv").iloc[0:1]  # first row
scaler = joblib.load("scalers/scaler.pkl")
model = joblib.load("models/model.pkl")
X = scaler.transform(row[FEATURE_COLS].values)
pred = model.predict(X)[0]
print("Predicted SOH (first row) =", float(pred))
