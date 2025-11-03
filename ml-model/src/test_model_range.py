import joblib
import numpy as np
import pandas as pd
from pathlib import Path
import json

def test_model_across_ranges():
    """Test model with synthetic data across entire SOH range"""
    BASE_DIR = Path(__file__).parent.parent
    
    try:
        model_path = BASE_DIR / 'models/model.pkl'
        scaler_path = BASE_DIR / 'scalers/scaler.pkl'
        
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        print("🧪 Testing model across different SOH ranges...")
        
        # Test cases that should produce low SOH
        test_cases = [
            # Case 1: Very low values (should give SOH < 0.6)
            {
                "name": "Very Degraded Battery",
                "features": [0.3, 0.35, 0.1, 0.2, 0.4, -0.5],  # Low mean, high negative skew
                "expected_range": "<0.6"
            },
            # Case 2: Moderately degraded
            {
                "name": "Moderately Degraded Battery", 
                "features": [0.55, 0.6, 0.15, 0.4, 0.7, -0.2],
                "expected_range": "0.6-0.8"
            },
            # Case 3: Healthy battery
            {
                "name": "Healthy Battery",
                "features": [0.85, 0.9, 0.05, 0.8, 0.95, 0.1],
                "expected_range": ">0.8"
            }
        ]
        
        results = []
        for test_case in test_cases:
            features = np.array(test_case['features']).reshape(1, -1)
            features_scaled = scaler.transform(features)
            prediction = model.predict(features_scaled)[0]
            prediction = max(0.0, min(1.0, prediction))
            
            status = "healthy" if prediction >= 0.6 else "has a problem"
            
            result = {
                'test_case': test_case['name'],
                'expected_range': test_case['expected_range'],
                'predicted_soh': round(prediction, 3),
                'status': status,
                'correct_classification': (
                    (prediction < 0.6 and test_case['expected_range'] == "<0.6") or
                    (prediction >= 0.6 and test_case['expected_range'] != "<0.6")
                )
            }
            results.append(result)
            
            print(f"\n{test_case['name']}:")
            print(f"  Expected: {test_case['expected_range']}")
            print(f"  Predicted SOH: {prediction:.3f}")
            print(f"  Status: {status}")
            print(f"  Correct: {'✅' if result['correct_classification'] else '❌'}")
        
        # Check if model can produce low SOH values
        low_soh_count = sum(1 for r in results if r['predicted_soh'] < 0.6)
        print(f"\n📊 Summary: Model produced {low_soh_count}/3 low SOH predictions")
        
        if low_soh_count == 0:
            print("🚨 PROBLEM DETECTED: Model cannot predict SOH < 0.6!")
            print("   This suggests training data lacks degraded batteries.")
        
        return results
        
    except Exception as e:
        print(f"Error during testing: {e}")
        return None

def analyze_training_data():
    """Analyze the training data distribution"""
    BASE_DIR = Path(__file__).parent.parent
    data_path = BASE_DIR / 'data/processed_battery_data.csv'
    
    try:
        df = pd.read_csv(data_path)
        print(f"\n📈 Training Data Analysis:")
        print(f"Total samples: {len(df)}")
        
        if 'SOH' in df.columns:
            soh_stats = df['SOH'].describe()
            print(f"SOH Range: {soh_stats['min']:.3f} to {soh_stats['max']:.3f}")
            print(f"SOH Mean: {soh_stats['mean']:.3f}")
            
            # Count samples below 0.6
            low_soh_count = len(df[df['SOH'] < 0.6])
            print(f"Samples with SOH < 0.6: {low_soh_count} ({low_soh_count/len(df)*100:.1f}%)")
            
            if low_soh_count == 0:
                print("🚨 CRITICAL: No training samples with SOH < 0.6!")
                
        return df
        
    except Exception as e:
        print(f"Could not analyze training data: {e}")
        return None

if __name__ == "__main__":
    # Analyze training data first
    training_data = analyze_training_data()
    
    # Test model predictions
    test_results = test_model_across_ranges()