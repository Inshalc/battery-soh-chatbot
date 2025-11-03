import sys
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

def predict_soh(battery_data):
    """
    Predict SOH from battery data
    battery_data: list of 6 aggregated features
    """
    try:
        BASE_DIR = Path(__file__).parent.parent
        
        model_path = BASE_DIR / 'models/model.pkl'
        scaler_path = BASE_DIR / 'scalers/scaler.pkl'
        
        # Check if files exist
        if not model_path.exists():
            return {
                'error': f"Model file not found at {model_path}",
                'status': 'error'
            }
        if not scaler_path.exists():
            return {
                'error': f"Scaler file not found at {scaler_path}",
                'status': 'error'
            }
        
        # Load model and scaler
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        # Convert input to numpy array and preprocess
        features = np.array(battery_data).reshape(1, -1)
        
        if features.shape[1] != 6:
            return {
                'error': f"Expected 6 features, got {features.shape[1]}",
                'status': 'error'
            }
        
        # Check for NaN or infinite values
        if np.any(np.isnan(features)) or np.any(np.isinf(features)):
            return {
                'error': 'Invalid feature values detected (NaN or infinity)',
                'status': 'error'
            }
        
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        prediction = max(0.0, min(1.0, prediction))  # Clip to valid range
        
        status = "healthy" if prediction >= 0.6 else "has a problem"
        status_message = f"The battery is {status}." if prediction >= 0.6 else "The battery has a problem."
        
        return {
            'soh': float(prediction),
            'soh_percentage': float(prediction * 100),
            'status': status,
            'status_message': status_message,
            'success': True
        }
        
    except Exception as e:
        return {
            'error': str(e),
            'status': 'error',
            'success': False
        }

# ADD THIS FUNCTION TO YOUR EXISTING quick_test.py
def get_feature_ranges():
    """Check what feature ranges your model was trained on"""
    BASE_DIR = Path(__file__).parent.parent
    data_path = BASE_DIR / 'data/processed_data.csv'
    df = pd.read_csv(data_path)
    
    feature_cols = ['Pack_SOH_mean', 'Pack_SOH_median', 'Pack_SOH_std', 
                   'Pack_SOH_min', 'Pack_SOH_max', 'Pack_SOH_skew']
    
    print("Actual feature ranges from your training data:")
    print(df[feature_cols].describe().loc[['min', 'max', 'mean']])
    
    return df[feature_cols].describe()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            result = predict_soh(input_data)
            print(json.dumps(result))
        except Exception as e:
            error_result = {
                'error': f'Prediction failed: {str(e)}',
                'status': 'error',
                'success': False
            }
            print(json.dumps(error_result))
    else:
        # Test mode - use the CORRECT feature values that match your model
        print("🧪 Testing with CORRECT feature values:")
        
        # Use the same test cases that worked in train_model.py
        test_cases = [
            {
                "name": "Very Degraded Battery",
                "features": [3.25, 3.25, 0.4, 2.9, 3.5, -1.5],
            },
            {
                "name": "Healthy Battery",
                "features": [3.7, 3.7, 0.1, 3.6, 3.8, 0.1],
            }
        ]
        
        for test_case in test_cases:
            print(f"\n{test_case['name']}:")
            print(f"Features: {test_case['features']}")
            result = predict_soh(test_case['features'])
            print(json.dumps(result, indent=2))