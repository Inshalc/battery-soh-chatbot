import joblib
import numpy as np
import pandas as pd
from pathlib import Path

def test_with_realistic_values():
    """Test with values that match your actual data distribution"""
    BASE_DIR = Path(__file__).parent.parent
    
    # Load some actual data to see realistic feature ranges
    data_path = BASE_DIR / 'data/processed_data.csv'
    df = pd.read_csv(data_path)
    
    feature_cols = ['Pack_SOH_mean', 'Pack_SOH_median', 'Pack_SOH_std', 
                   'Pack_SOH_min', 'Pack_SOH_max', 'Pack_SOH_skew']
    
    # Get statistics from actual data
    healthy_stats = df[df['SOH'] > 0.8][feature_cols].describe()
    print("Healthy battery feature ranges (SOH > 0.8):")
    print(healthy_stats.loc[['min', 'max', 'mean']])
    
    # Load model
    model_path = BASE_DIR / 'models/model.pkl'
    scaler_path = BASE_DIR / 'scalers/scaler.pkl'
    
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    
    print("\n🧪 Testing with realistic values:")
    
    # Test cases based on actual data statistics
    test_cases = [
        {
            "name": "Very Degraded Battery",
            "features": [3.2, 3.2, 0.2, 2.8, 3.4, -1.5],  # Low voltages, high variation
            "expected": "<0.6"
        },
        {
            "name": "Moderately Degraded Battery", 
            "features": [3.5, 3.5, 0.15, 3.2, 3.7, -0.8],
            "expected": "0.6-0.8" 
        },
        {
            "name": "Healthy Battery",
            "features": [3.8, 3.8, 0.05, 3.7, 3.9, 0.1],  # High voltages, low variation
            "expected": ">0.8"
        }
    ]
    
    for test in test_cases:
        features = np.array(test['features']).reshape(1, -1)
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        prediction = max(0.0, min(1.0, prediction))
        status = "healthy" if prediction >= 0.6 else "has a problem"
        
        print(f"\n{test['name']}:")
        print(f"  Expected: {test['expected']}")
        print(f"  Predicted SOH: {prediction:.3f}")
        print(f"  Status: {status}")
        print(f"  Features: {[f'{x:.1f}' for x in test['features']]}")

if __name__ == "__main__":
    test_with_realistic_values()