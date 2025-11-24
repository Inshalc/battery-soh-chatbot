import json
import matplotlib.pyplot as plt
import os

# creates output directory if not exist
os.makedirs("plots/model_results", exist_ok=True)

# loads metrics from JSON
with open("results/model_metrics.json", "r") as f:
    metrics = json.load(f)

r2 = metrics["r2"]
mse = metrics["mse"]
mae = metrics["mae"]
train_time = metrics["train_time_s"]

# simple bar chart of metrics
fig, ax = plt.subplots(figsize=(8, 5))

metric_names = ['R²\nScore', 'MSE', 'MAE']
metric_values = [r2, mse, mae]
colors = ['#2ecc71', '#e74c3c', '#f39c12']

bars = ax.bar(metric_names, metric_values, color=colors, edgecolor='black', linewidth=1.5)

# adds value labels on bars 
for bar, value in zip(bars, metric_values):
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height,
            f'{value:.4f}',
            ha='center', va='bottom', fontsize=11, fontweight='bold')

ax.set_ylabel('Value', fontsize=12)
ax.set_title('Model Performance Metrics', fontsize=14, fontweight='bold')
ax.grid(axis='y', alpha=0.3, linestyle='--')
plt.tight_layout()
plt.savefig("plots/model_results/metrics_simple.png", dpi=150)
plt.close()
print("Saved: plots/model_results/metrics_simple.png")

# R² Score Visualization
fig, ax = plt.subplots(figsize=(10, 6))

ax.barh(['R² Score'], [r2], color='#2ecc71', edgecolor='black', linewidth=2, height=0.6)
ax.barh(['R² Score'], [1-r2], left=[r2], color='lightgray', edgecolor='black', linewidth=2, height=0.6)

ax.set_xlim(0, 1)
ax.set_ylim(-0.8, 0.8)
ax.text(r2/2, 0, f'{r2:.4f}', ha='center', va='center', fontweight='bold', fontsize=16, color='white')
ax.text(r2 + (1-r2)/2, 0, f'{1-r2:.4f}', ha='center', va='center', fontsize=14, color='gray')

# add clarity label above the bar 
ax.text(0.5, 0.5, f'Model explains ~{r2*100:.0f}% of the variation in SOH', 
        ha='center', fontsize=12, style='italic', color='#2c3e50',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#ecf0f1', edgecolor='none', alpha=0.8))

# add interpretation below the bar
ax.text(0.5, -0.5, 'Moderate fit - room for improvement', 
        ha='center', fontsize=11, color='#7f8c8d', style='italic')

ax.set_xlabel('Score (0 = worst, 1 = perfect)', fontsize=12)
ax.set_title('R² Score - Model Fit Quality', fontsize=14, fontweight='bold', pad=20)
ax.set_yticks([])
plt.tight_layout()
plt.savefig("plots/model_results/r2_visual.png", dpi=150)
plt.close()
print("Saved: plots/model_results/r2_visual.png")

# prediction error distribution  
# Load actual predictions to calculate errors 
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split

# Reload data and model to get prediction errors
df = pd.read_csv("data/processed_data.csv")
FEATURE_COLS = ['Pack_SOH_mean', 'Pack_SOH_median', 'Pack_SOH_std', 
                'Pack_SOH_min', 'Pack_SOH_max', 'Pack_SOH_skew']
TARGET_COL = 'SOH'

X = df[FEATURE_COLS].values
y = df[TARGET_COL].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = joblib.load("scalers/scaler.pkl")
model = joblib.load("models/model.pkl")
X_test_s = scaler.transform(X_test)
y_pred = model.predict(X_test_s)

# calculate errors (actual - predicted) 
errors = y_test - y_pred

# create figure with histogram and boxplot 
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Histogram
ax1.hist(errors, bins=30, color='#3498db', edgecolor='black', alpha=0.7)
ax1.axvline(x=0, color='red', linestyle='--', linewidth=2, label='Perfect prediction')
ax1.set_xlabel('Prediction Error (Actual - Predicted SOH)', fontsize=11)
ax1.set_ylabel('Frequency', fontsize=11)
ax1.set_title('Distribution of Prediction Errors', fontsize=12, fontweight='bold')
ax1.legend()
ax1.grid(axis='y', alpha=0.3, linestyle='--')

# Add statistics text
stats_text = f'Mean: {errors.mean():.4f}\nStd: {errors.std():.4f}\nMAE: {mae:.4f}'
ax1.text(0.02, 0.98, stats_text, transform=ax1.transAxes, 
         verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5),
         fontsize=9, family='monospace')

# Boxplot
bp = ax2.boxplot(errors, vert=True, patch_artist=True, widths=0.5)
bp['boxes'][0].set_facecolor('#3498db')
bp['boxes'][0].set_edgecolor('black')
bp['boxes'][0].set_linewidth(1.5)
for element in ['whiskers', 'fliers', 'means', 'medians', 'caps']:
    plt.setp(bp[element], color='black', linewidth=1.5)

ax2.axhline(y=0, color='red', linestyle='--', linewidth=2, label='Perfect prediction')
ax2.set_ylabel('Prediction Error (Actual - Predicted SOH)', fontsize=11)
ax2.set_title('Boxplot of Prediction Errors', fontsize=12, fontweight='bold')
ax2.set_xticklabels(['Errors'])
ax2.legend()
ax2.grid(axis='y', alpha=0.3, linestyle='--')

plt.tight_layout()
plt.savefig("plots/model_results/error_distribution.png", dpi=150)
plt.close()
print("Saved: plots/model_results/error_distribution.png")

# prints summary to console
print("\n" + "="*50)
print("MODEL PERFORMANCE SUMMARY")
print("="*50)
print(f"R² Score:          {r2:.4f}")
print(f"   Interpretation: Model explains {r2*100:.1f}% of variance")
print(f"\nMSE:               {mse:.6f}")
print(f"   Interpretation: Average squared error")
print(f"\nMAE:               {mae:.6f}")
print(f"   Interpretation: Average error ≈ {mae*100:.2f}% SOH")
print(f"\nTraining Time:     {train_time:.4f} seconds")
print("="*50)
print("\nAll visualizations saved to plots/model_results/")