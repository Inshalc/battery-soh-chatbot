# Rmodel/data/processed_data.py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
from sklearn.preprocessing import StandardScaler
import joblib
import os

# === Load raw data ===
df = pd.read_csv('Rmodel/data/raw_data.csv')
print("✅ Raw data loaded:", df.shape)

# === Clean missing values ===
df = df.dropna(thresh=25)
df.fillna(df.select_dtypes(include='number').median(), inplace=True)

# === Voltage columns ===
voltage_cols = [f'U{i}' for i in range(1, 22)]

# === Remove outliers ===
df = df[(np.abs(stats.zscore(df[voltage_cols])) < 3).all(axis=1)]

# === Create features ===
df['Pack_SOH_mean'] = df[voltage_cols].mean(axis=1)
df['Pack_SOH_median'] = df[voltage_cols].median(axis=1)
df['Pack_SOH_std'] = df[voltage_cols].std(axis=1)
df['Pack_SOH_min'] = df[voltage_cols].min(axis=1)
df['Pack_SOH_max'] = df[voltage_cols].max(axis=1)
df['Pack_SOH_skew'] = df[voltage_cols].skew(axis=1)

# === Save processed data ===
os.makedirs('Rmodel/data', exist_ok=True)
df.to_csv('Rmodel/data/processed_data.csv', index=False)
print("✅ Saved cleaned data -> Rmodel/data/processed_data.csv")

# === Save scaler ===
scaler = StandardScaler()
scaled = scaler.fit_transform(df[voltage_cols])
os.makedirs('Rmodel/scalers', exist_ok=True)
joblib.dump(scaler, 'Rmodel/scalers/scaler.pkl')
print("✅ Saved scaler -> Rmodel/scalers/scaler.pkl")

# === Example plots ===
os.makedirs('Rmodel/plots', exist_ok=True)
plt.figure(figsize=(8,5))
plt.hist(df['SOH'], bins=20, color='skyblue', edgecolor='black')
plt.title('Distribution of SOH Values')
plt.xlabel('SOH')
plt.ylabel('Frequency')
plt.tight_layout()
plt.savefig('Rmodel/plots/model_results/soh_histogram.png')
plt.close()

print("✅ Processing complete.")