arkdown
# Battery SOH Prediction Model

This project builds and trains a Linear Regression model to predict Battery State of Health (SOH) using voltage-related features derived from pack data. It forms the foundation for a Battery Health Chatbot that can interpret battery condition through machine learning insights.

---

## File Structure
```text

battery-soh-chatbot/
│
├── backend/
│ ├── routes/
│ │ ├── battery.js
│ │ └── chat.js
│ ├── services/
│ │ └── geminiService.js
│ ├── index.js
│ └── package.json
│
├── frontend/
│ └── AI-Chatbot/
│ ├── app/
│ │ ├── (tabs)/
│ │ │ ├── chat.tsx
│ │ │ └── index.tsx
│ │ └── _layout.tsx
│ ├── components/
│ │ ├── battery/
│ │ │ └── BatteryInputForm.js
│ │ ├── chat/
│ │ │ ├── ChatBubble.js
│ │ │ ├── ChatInput.js
│ │ │ └── MessageList.js
│ │ └── ui/
│ ├── services/
│ │ └── api.js
│ └── package.json
│
├── ml-model/
│ ├── data/
│ │ ├── raw_data.csv
│ │ ├── processed_data.csv
│ │ ├── processed_data_enhanced.csv
│ │ ├── processed_sorted_by_voltage.csv
│ │ └── processed_data.py
│ │
│ ├── models/
│ │ └── model.pkl
│ │
│ ├── scalers/
│ │ └── scaler.pkl
│ │
│ ├── plots/
│ │ └── model_results/
│ │ ├── error_distribution.png
│ │ ├── metrics_simple.png
│ │ ├── pred_vs_actual.png
│ │ ├── r2_visual.png
│ │ └── residuals.png
│ │
│ ├── results/
│ │ └── model_metrics.json
│ │
│ └── src/
│ ├── config.py
│ ├── check_data.py
│ ├── processed_data.py
│ ├── train_model.py
│ ├── train_model_enhanced.py
│ ├── quick_test.py
│ ├── test_model_range.py
│ ├── test_realistic.py
│ └── visualize_metrics.py
│
└── README.md

```
---

## Setup Instructions
[
### 1. Clone the repository
```

git clone https://github.com/Inshalc/battery-soh-chatbot.git
cd battery-soh-chatbot

```


### 2. Create and activate a virtual environment

**macOS / Linux**
```
python3 -m venv .venv
source .venv/bin/activate

```


**Windows**
```
python -m venv .venv
.venv\Scripts\activate

```


### 3. Install dependencies
```
pip install -r requirements.txt

```


---

## ML Model Training Pipeline

### Step 1 – Data Preprocessing
Run the script that cleans the raw dataset and creates new features:
python ml-model/src/processed_data.py

text

This will:
- Remove missing or extreme values
- Compute voltage-based SOH statistics (mean, std, min, max, skew)
- Save processed data to `ml-model/data/processed_data.csv`
- Generate exploratory plots

### Step 2 – Train and Evaluate Model
python ml-model/src/train_model.py

text

This script:
1. Loads processed data
2. Splits into training/testing sets
3. Scales features using StandardScaler
4. Trains a Linear Regression model
5. Saves metrics, model, and evaluation plots

**Example console output:**
📂 Loading data from ml-model/data/processed_data.csv ...
✅ Data shape: (670, 36)
🔀 Splitting into train/test ...
✅ Train: 536 | Test: 134
⚙️ Scaling features ...
🤖 Training Linear Regression model ...
✅ Model trained in 0.00s
💾 Metrics saved -> ml-model/results/model_metrics.json
✅ Training complete! Check ml-model/results/model_metrics.json and ml-model/plots/model_results/

text

### Step 3 – Enhanced Training (Optional)
For improved model performance with data augmentation:
python ml-model/src/train_model_enhanced.py

text

### Step 4 – Testing the Model
Verify the trained model and scaler work properly:
python ml-model/src/quick_test.py

text

**Example output:**
Model metrics:
r2: 0.5081
mse: 0.0021
mae: 0.0359
train_time_s: 0.0033

Example Prediction (SOH): 27.60

text

---

## Backend API Server

### Start the Node.js backend:
cd backend
npm install
npm start

text

**API Endpoints:**
- `POST /api/battery/predict` - Predict SOH from 21 cell voltages
- `GET /api/battery/model-info` - Get model information
- `POST /api/chat/message` - Chat with battery AI assistant

---

## Mobile Frontend

### Start the React Native app:
cd frontend/AI-Chatbot
npm install
npx expo start

text

**Features:**
- Battery voltage input form (21 cells)
- Real-time SOH prediction
- AI chatbot with Gemini integration
- Health status classification

---

## Model Performance Summary

| Metric | Value | Description |
|--------|-------|-------------|
| R² | 0.5081 | 50.8% variance explained |
| MSE | 0.0021 | Mean Squared Error |
| MAE | 0.0359 | Mean Absolute Error |
| Train time | 0.0033 s | Very efficient training |

---

## Key Features

### Machine Learning
- Linear Regression model for SOH prediction
- 21-cell voltage aggregation into statistical features
- 60% threshold classification (Healthy/Unhealthy)
- Feature scaling and data preprocessing

### Full-Stack Integration
- RESTful API with Node.js/Express
- React Native mobile interface
- Real-time predictions
- Cross-platform compatibility (iOS/Android)

### AI Chatbot
- Google Gemini integration
- Battery health status reporting
- Maintenance and recycling guidance
- Technical explanations of ML model

---

## Project Requirements Met

- ✅ Linear Regression model for SOH prediction
- ✅ 21-cell voltage aggregation (mean, median, std, min, max, skew)
- ✅ 60% threshold classification system
- ✅ Chatbot integration with health status reporting
- ✅ Mobile application with professional UI
- ✅ Real AI integration with Gemini API

---

## Academic Context

This project was developed for **SOFE3370 Final Project** demonstrating practical applications of machine learning in battery sustainability and health monitoring.

**Built with:** Python, scikit-learn, Node.js, React Native, Expo, and Gemini AI



