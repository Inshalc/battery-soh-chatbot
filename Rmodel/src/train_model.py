import os, time, json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from pathlib import Path

from config import FEATURE_COLS, TARGET_COL

# Get the correct base directory (Rmodel folder, not Rmodel/src)
BASE_DIR = Path(__file__).parent.parent

# creates folders if not exist
os.makedirs(BASE_DIR / "models", exist_ok=True)
os.makedirs(BASE_DIR / "scalers", exist_ok=True)
os.makedirs(BASE_DIR / "plots/model_results", exist_ok=True)
os.makedirs(BASE_DIR / "results", exist_ok=True)

# loads data and checks for missing values
print("Loading data from data/processed_data.csv ...")
df = pd.read_csv(BASE_DIR / "data/processed_data.csv")  # Fixed path
print("Data shape:", df.shape)

missing = df[FEATURE_COLS + [TARGET_COL]].isnull().sum().sum()
if missing > 0:
    raise ValueError(f" Found {missing} missing values in columns!")

# split features/target arrays
X = df[FEATURE_COLS].values
y = df[TARGET_COL].values

# train/test split 
print(" Splitting into train/test ...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Train: {len(X_train)} | Test: {len(X_test)}")

# scale features 
print("Scaling features ...")
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)
joblib.dump(scaler, BASE_DIR / "scalers/scaler.pkl")  # Fixed path

# trains the model
print("Training Linear Regression model ...")
model = LinearRegression(n_jobs=-1)
start = time.perf_counter()
model.fit(X_train_s, y_train)
train_time = time.perf_counter() - start
joblib.dump(model, BASE_DIR / "models/model.pkl")  # Fixed path
print(f" Model trained in {train_time:.2f}s")

# evaluates model on test set
y_pred = model.predict(X_test_s)
y_pred = np.clip(y_pred, 0.0, 1.0)
r2 = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

metrics = {"r2": float(r2), "mse": float(mse), "mae": float(mae), "train_time_s": float(train_time)}
with open(BASE_DIR / "results/model_metrics.json", "w") as f:  # Fixed path
    json.dump(metrics, f, indent=2)
print("Metrics saved -> results/model_metrics.json")

# plots metrics visuals
plt.figure(figsize=(6,6))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([0,1],[0,1],"--",color="red")
plt.xlabel("Actual SOH")
plt.ylabel("Predicted SOH")
plt.title("Predicted vs Actual SOH")
plt.savefig(BASE_DIR / "plots/model_results/pred_vs_actual.png", dpi=150)  # Fixed path
plt.close()

plt.figure(figsize=(6,4))
plt.hist(y_test - y_pred, bins=40)
plt.xlabel("Residual (actual - predicted)")
plt.title("Residuals Histogram")
plt.savefig(BASE_DIR / "plots/model_results/residuals.png", dpi=150)  # Fixed path
plt.close()

print("Training complete! Check results/model_metrics.json and plots/model_results/")