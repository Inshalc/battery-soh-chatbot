**Battery SOH Prediction Model**
This project builds and trains a Linear Regression model to predict Battery State of Health (SOH) using voltage-related features derived from pack data.
It forms the foundation for a future Battery Health Chatbot that can interpret battery condition through machine learning insights.

---

# File Structure

```text
battery-soh-chatbot/
│
├── data/
│   ├── raw_data.csv                # Original dataset
│   └── processed_data.csv          # Cleaned + feature-engineered data
│
├── models/
│   └── model.pkl                   # Trained Linear Regression model
│
├── scalers/
│   └── scaler.pkl                  # Fitted StandardScaler for consistent normalization
│
├── plots/
│   └── model_results/
│       ├── pred_vs_actual.png      # Predicted vs actual SOH scatter plot
│       └── residuals.png           # Error distribution histogram
│
├── results/
│   └── model_metrics.json          # Saved model performance metrics
│
├── src/
│   ├── config.py                   # Config file with features and target column definitions
│   ├── processed_data.py           # Data cleaning and feature engineering script
│   ├── train_model.py              # Model training and evaluation pipeline
│   └── quick_test.py               # Quick test script to load and check trained model
│
└── README.md                       # (this file)
```
---

# ⚙️ Setup Instructions:

## 1. Clone the repository
```
git clone https://github.com/Inshalc/battery-soh-chatbot.git
cd battery-soh-chatbot
```
## 2. Create and activate a virtual environment

(macOS / Linux)

```
python3 -m venv .venv
source .venv/bin/activate
```  
### OR

(Windows)

```.venv\Scripts\activate```
## 3. Install dependencies
```pip install -r requirements.txt```

---

# Step 1 – Data Preprocessing
**Run the script that cleans the raw dataset and creates new features:**

```python data/processed_data.py```

This will:

* Remove missing or extreme values

* Compute voltage-based SOH statistics (mean, std, min, max, skew)

* Save:

  * data/processed_data.csv

  * Several exploratory plots

---

# Step 2 – Train and Evaluate Model
```python src/train_model.py```

This script:

* Loads processed data

* Splits into training/testing sets

* Scales features

* Trains a Linear Regression model

* Saves metrics, model, and plots

Example console output:

📂 Loading data from data/processed_data.csv ...
✅ Data shape: (670, 36)
🔀 Splitting into train/test ...
✅ Train: 536 | Test: 134
⚙️ Scaling features ...
🤖 Training Linear Regression model ...
✅ Model trained in 0.00s
💾 Metrics saved -> results/model_metrics.json
✅ Training complete! Check results/model_metrics.json and plots/model_results/

--- 

# Step 3 – Quick Model Test
Verify the trained model and scaler work properly:

```python src/quick_test.py```

Example output:

Model metrics:
  | r2: | 0.5081|
  |:----|:------|
  |mse: |0.0021|
  |mae: |0.0359|
  |train_time_s: |0.0033|

 Example Prediction (SOH): 27.60

---

# Results Summary
| Metric| Value| Description|
|:------|------|------------|
|R²	|0.5081	|50.8% variance explained|
|MSE	|0.0021	|Mean Squared Error|
|MAE	|0.0359	|Mean Absolute Error|
|Train time	|0.0033 s|Very efficient|



