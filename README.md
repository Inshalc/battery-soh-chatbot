<<<<<<< HEAD
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
**Battery SOH Prediction Model**
This project builds and trains a Linear Regression model to predict Battery State of Health (SOH) using voltage-related features derived from pack data.
It forms the foundation for a future Battery Health Chatbot that can interpret battery condition through machine learning insights.

---

# 📁 File Structure

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
|       ├── error_distribution.png  # Histogram & Boxplot showing the distribution of prediction errors
|       ├── metrics_simple.png      # Bar chart comparing performance metrics (R², MSE, MAE)
│       ├── pred_vs_actual.png      # Predicted vs actual SOH scatter plot
|       ├── r2_visual.png           # Visual gauge of R² fit quality
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
└── README.md                       # 
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

1. Loads processed data

2. Splits into training/testing sets

3. Scales features

4. Trains a Linear Regression model

5. Saves metrics, model, and plots

Example console output:
```
📂 Loading data from data/processed_data.csv ...
✅ Data shape: (670, 36)
🔀 Splitting into train/test ...
✅ Train: 536 | Test: 134
⚙️ Scaling features ...
🤖 Training Linear Regression model ...
✅ Model trained in 0.00s
💾 Metrics saved -> results/model_metrics.json
✅ Training complete! Check results/model_metrics.json and plots/model_results/
```

--- 

# Step 3 – Testing the Model
Verify the trained model and scaler work properly:

```python src/quick_test.py```

### Example output:

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


>>>>>>> origin/frontend-1
