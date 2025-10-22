# src/train_model.py
import os, time, json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

from src.config import FEATURE_COLS, TARGET_COL

# --- folders ---
os.makedirs("models", exist_ok=True)
os.makedirs("scalers", exist_ok=True)
os.makedirs("plots/model_results", exist_ok=True)
os.makedirs("results", exist_ok=True)

# --- 1. load data ---
print("Loading data from data/processed_data.csv ...")
df = pd.read_csv("data/processed_data.csv")
print("Shape:", df.shape)

# quick checks
missing = df[FEATURE_COLS + [TARGET_COL]].isnull().sum().sum()
if missing > 0:
    raise ValueError(f"Found {missing} missing values in chosen columns. Fix before training.")

# --- 2. prepare X, y ---
X = df[FEATURE_COLS].values
y = df[TARGET_COL].values

# --- 3. train/test split ---
print("Splitting into train/test ...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Train size:", X_train.shape[0], "Test size:", X_test.shape[0])

# --- 4. scale features ---
print("Fitting StandardScaler ...")
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)
joblib.dump(scaler, "scalers/scaler.pkl")
print("Saved scaler to scalers/scaler.pkl")

# --- 5. train model ---
print("Training LinearRegression ...")
model = LinearRegression(n_jobs=-1)
t0 = time.perf_counter()
model.fit(X_train_s, y_train)
train_time = time.perf_counter() - t0
joblib.dump(model, "models/model.pkl")
print(f"Model trained and saved to models/model.pkl (train time {train_time:.3f} s)")

# --- 6. evaluate ---
y_pred = model.predict(X_test_s)
# clip into [0,1] if needed
y_pred = np.clip(y_pred, 0.0, 1.0)

r2 = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

print(f"Evaluation results -> R2: {r2:.4f}, MSE: {mse:.6f}, MAE: {mae:.6f}")

# --- 7. save metrics ---
metrics = {"train_time_s": train_time, "r2": float(r2), "mse": float(mse), "mae": float(mae)}
with open("results/model_metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)
print("Saved metrics to results/model_metrics.json")

# --- 8. plots ---
print("Saving plots ...")
plt.figure(figsize=(6,6))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([0,1],[0,1], linestyle="--", linewidth=1)
plt.xlabel("Actual SOH")
plt.ylabel("Predicted SOH")
plt.title("Predicted vs Actual SOH")
plt.savefig("plots/model_results/pred_vs_actual.png", dpi=150)
plt.close()

residuals = y_test - y_pred
plt.figure(figsize=(6,4))
plt.hist(residuals, bins=40)
plt.xlabel("Residual (actual - predicted)")
plt.title("Residuals Histogram")
plt.savefig("plots/model_results/residuals.png", dpi=150)
plt.close()
print("Plots saved in plots/model_results/")

print("Done. Check results/model_metrics.json and plots/model_results/")
