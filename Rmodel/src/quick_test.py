import sys
import json
import pickle
import numpy as np
import pandas as pd
from pathlib import Path

# Add the parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

def predict_soh(battery_data):
    """
    Predict SOH from battery data
    battery_data: list of cell measurements
    """
    try:
        # Load model and scaler
        model_path = Path('models/model.pkl')
        scaler_path = Path('scalers/scaler.pkl')
        
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        
        # Convert input to numpy array and preprocess
        features = np.array(battery_data).reshape(1, -1)
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        
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
    # Get data from command line arguments
    if len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            result = predict_soh(input_data)
            print(json.dumps(result))
        except Exception as e:
            error_result = {
                'error': f'Prediction failed: {str(e)}',
                'status': 'error'
            }
            print(json.dumps(error_result))