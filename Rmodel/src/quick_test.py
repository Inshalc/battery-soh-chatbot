import sys
import json
import pickle
import numpy as np
from pathlib import Path

# Add parent directory to path for config import
sys.path.insert(0, str(Path(__file__).parent))

from config import HEALTH_THRESHOLD

def predict_soh(battery_data):
    """
    Predict SOH from U1-U21 voltage values
    battery_data: list of 21 voltage values [U1, U2, ..., U21]
    """
    try:
        # Validate input
        if len(battery_data) != 21:
            return {
                'error': f'Expected 21 voltage values (U1-U21), got {len(battery_data)}',
                'status': 'error'
            }
        
        # Get paths relative to this script's location
        script_dir = Path(__file__).parent  # Rmodel/src/
        model_path = script_dir.parent / 'models' / 'model.pkl'  # Rmodel/models/model.pkl
        scaler_path = script_dir.parent / 'scalers' / 'scaler.pkl'  # Rmodel/scalers/scaler.pkl
        
        if not model_path.exists():
            return {
                'error': f'Model not found at {model_path}. Run: python Rmodel/src/train_model.py',
                'status': 'error'
            }
        
        if not scaler_path.exists():
            return {
                'error': f'Scaler not found at {scaler_path}. Run: python Rmodel/src/train_model.py',
                'status': 'error'
            }
        
        # Load model and scaler
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        
        # Convert input to numpy array and preprocess
        features = np.array(battery_data).reshape(1, -1)
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        prediction = np.clip(prediction, 0.0, 1.0)
        
        # Determine health status
        health_status = 'Healthy' if prediction >= HEALTH_THRESHOLD else 'Problem'
        
        return {
            'soh': float(prediction),
            'soh_percentage': float(prediction * 100),
            'health_status': health_status,
            'threshold': HEALTH_THRESHOLD,
            'status': 'success'
        }
        
    except Exception as e:
        import traceback
        return {
            'error': str(e),
            'traceback': traceback.format_exc(),
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
    else:
        # Test 1: Healthy battery
        print("Test 1: Healthy Battery")
        print("=" * 50)
        sample_healthy = [3.486, 3.507, 3.524, 3.503, 3.488, 3.468, 3.445, 3.465, 3.485,
                          3.528, 3.560, 3.519, 3.489, 3.453, 3.401, 3.438, 3.484, 3.564,
                          3.624, 3.547, 3.492]
        result = predict_soh(sample_healthy)
        if result['status'] == 'error':
            print("ERROR:")
            print(result.get('traceback', result['error']))
        else:
            print(json.dumps(result, indent=2))
        
        # Test 2: Low SOH battery (near threshold)
        print("\n\nTest 2: Low SOH Battery (near threshold)")
        print("=" * 50)
        sample_problem = [3.5255, 3.5441, 3.5825, 3.5608, 3.5277, 3.5103, 3.465, 3.4883, 3.5243,
                          3.5652, 3.6309, 3.5925, 3.5298, 3.4889, 3.4064, 3.4455, 3.523, 3.6052,
                          3.7103, 3.6263, 3.5345]
        result = predict_soh(sample_problem)
        if result['status'] == 'error':
            print("ERROR:")
            print(result.get('traceback', result['error']))
        else:
            print(json.dumps(result, indent=2))