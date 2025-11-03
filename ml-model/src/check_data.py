import pandas as pd
import numpy as np
from pathlib import Path

# Check what columns your processed data actually has
BASE_DIR = Path(__file__).parent.parent
data_path = BASE_DIR / 'data/processed_data.csv'

df = pd.read_csv(data_path)
print("Columns in processed_data.csv:")
print(df.columns.tolist())
print(f"\nData shape: {df.shape}")

if 'SOH' in df.columns:
    print(f"\nSOH statistics:")
    print(f"Min: {df['SOH'].min():.3f}")
    print(f"Max: {df['SOH'].max():.3f}")
    print(f"Mean: {df['SOH'].mean():.3f}")
    print(f"Samples < 0.6: {len(df[df['SOH'] < 0.6])}")
else:
    print("\n❌ 'SOH' column not found in data!")