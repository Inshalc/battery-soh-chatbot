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
        # Get the correct base directory (Rmodel folder, not Rmodel/src)
        BASE_DIR = Path(__file__).parent.parent
        
        model_path = BASE_DIR / 'models/model.pkl'
        scaler_path = BASE_DIR / 'scalers/scaler.pkl'
        
        # Load model and scaler
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        # Convert input to numpy array and preprocess
        features = np.array(battery_data).reshape(1, -1)
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        prediction = max(0.0, min(1.0, prediction))  # Clip to valid range
        
        return {
            'soh': float(prediction),
            'soh_percentage': float(prediction * 100),
            'status': 'success'
        }
        
    except Exception as e:
        return {
            'error': str(e),
            'status': 'error'
        }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            result = predict_soh(input_data)
            # ONLY OUTPUT JSON, no debug text or emojis
            print(json.dumps(result))
        except Exception as e:
            error_result = {
                'error': f'Prediction failed: {str(e)}',
                'status': 'error'
            }
            print(json.dumps(error_result))