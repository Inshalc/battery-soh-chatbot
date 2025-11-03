import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import joblib
from pathlib import Path
import sys

def train_model():
    BASE_DIR = Path(__file__).parent.parent
    
    # Load processed data
    data_path = BASE_DIR / 'data/processed_data.csv'
    df = pd.read_csv(data_path)
    
    print("Columns in data:", df.columns.tolist())
    
    # Define features
    feature_cols = [
        'Pack_SOH_mean',
        'Pack_SOH_median', 
        'Pack_SOH_std',
        'Pack_SOH_min',
        'Pack_SOH_max',
        'Pack_SOH_skew'
    ]
    
    X = df[feature_cols]
    y = df['SOH']
    
    print(f"\nOriginal training data: {X.shape}")
    print(f"SOH range: {y.min():.3f} to {y.max():.3f}")
    print(f"Samples with SOH < 0.6: {len(y[y < 0.6])}")
    
    # FIXED: Better data augmentation that actually creates low SOH samples
    if len(y[y < 0.6]) == 0:
        print("No low SOH samples found. Creating realistic degraded batteries...")
        
        # Get feature statistics from actual data
        feature_stats = {}
        for feature in feature_cols:
            feature_stats[feature] = {
                'mean': X[feature].mean(),
                'std': X[feature].std(),
                'min': X[feature].min(),
                'max': X[feature].max()
            }
        
        augmented_rows = []
        
        # Create truly degraded batteries with features that correlate to low SOH
        n_degraded = 500  # Create enough degraded samples
        
        for i in range(n_degraded):
            degraded_features = {}
            
            # For degraded batteries (SOH 0.3-0.59):
            target_soh = np.random.uniform(0.3, 0.59)
            
            # Degraded batteries have:
            # - Lower mean and median voltages
            degraded_features['Pack_SOH_mean'] = np.random.uniform(3.2, 3.4)  # Lower voltages
            degraded_features['Pack_SOH_median'] = np.random.uniform(3.2, 3.4)
            
            # - Higher standard deviation (more cell imbalance)
            degraded_features['Pack_SOH_std'] = np.random.uniform(0.3, 0.6)
            
            # - Much lower minimum voltage (weak cells)
            degraded_features['Pack_SOH_min'] = np.random.uniform(2.8, 3.2)
            
            # - Slightly lower maximum voltage  
            degraded_features['Pack_SOH_max'] = np.random.uniform(3.5, 3.7)
            
            # - Negative skew (more cells below average)
            degraded_features['Pack_SOH_skew'] = np.random.uniform(-2.0, -0.1)
            
            degraded_features['SOH'] = target_soh
            augmented_rows.append(degraded_features)
        
        # Also create some moderately degraded batteries (SOH 0.6-0.7)
        n_moderate = 200
        for i in range(n_moderate):
            moderate_features = {}
            
            target_soh = np.random.uniform(0.6, 0.7)
            
            moderate_features['Pack_SOH_mean'] = np.random.uniform(3.45, 3.6)
            moderate_features['Pack_SOH_median'] = np.random.uniform(3.45, 3.6)
            moderate_features['Pack_SOH_std'] = np.random.uniform(0.15, 0.3)
            moderate_features['Pack_SOH_min'] = np.random.uniform(3.3, 3.5)
            moderate_features['Pack_SOH_max'] = np.random.uniform(3.65, 3.8)
            moderate_features['Pack_SOH_skew'] = np.random.uniform(-1.0, 0.2)
            
            moderate_features['SOH'] = target_soh
            augmented_rows.append(moderate_features)
        
        augmented_df = pd.DataFrame(augmented_rows)
        
        # Combine with original data
        combined_df = pd.concat([df[feature_cols + ['SOH']], augmented_df], ignore_index=True)
        X = combined_df[feature_cols]
        y = combined_df['SOH']
        
        print(f"After augmentation: {X.shape}")
        print(f"New SOH range: {y.min():.3f} to {y.max():.3f}")
        print(f"Low SOH samples (<0.6): {len(y[y < 0.6])}")
        print(f"Medium SOH samples (0.6-0.8): {len(y[(y >= 0.6) & (y < 0.8)])}")
        print(f"High SOH samples (>=0.8): {len(y[y >= 0.8])}")
    
    # Split and train
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"\nTraining set SOH range: {y_train.min():.3f} to {y_train.max():.3f}")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Predict and evaluate
    y_pred = model.predict(X_test_scaled)
    y_pred = np.clip(y_pred, 0, 1)  # Ensure valid range
    
    r2 = r2_score(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"R² Score: {r2:.4f}")
    print(f"MSE: {mse:.4f}")
    print(f"MAE: {mae:.4f}")
    
    # Save model and scaler
    models_dir = BASE_DIR / 'models'
    scalers_dir = BASE_DIR / 'scalers'
    
    models_dir.mkdir(exist_ok=True)
    scalers_dir.mkdir(exist_ok=True)
    
    joblib.dump(model, models_dir / 'model.pkl')
    joblib.dump(scaler, scalers_dir / 'scaler.pkl')
    
    print(f"\nModel saved to: {models_dir / 'model.pkl'}")
    print(f"Scaler saved to: {scalers_dir / 'scaler.pkl'}")
    
    # Test the model with realistic examples
    print(f"\n🧪 Testing model with realistic battery conditions:")
    
    test_cases = [
        {
            "name": "Very Degraded Battery",
            "features": [3.25, 3.25, 0.4, 2.9, 3.5, -1.5],  # Low voltages, high imbalance
            "expected_soh": "<0.6"
        },
        {
            "name": "Moderately Degraded Battery", 
            "features": [3.5, 3.5, 0.2, 3.3, 3.7, -0.5],   # Medium voltages, some imbalance
            "expected_soh": "0.6-0.7"
        },
        {
            "name": "Healthy Battery",
            "features": [3.7, 3.7, 0.1, 3.6, 3.8, 0.1],    # High voltages, balanced
            "expected_soh": ">0.8"
        }
    ]
    
    for test_case in test_cases:
        features = np.array(test_case['features']).reshape(1, -1)
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        prediction = max(0.0, min(1.0, prediction))
        status = "healthy" if prediction >= 0.6 else "has a problem"
        
        print(f"\n{test_case['name']}:")
        print(f"  Features: {[f'{x:.2f}' for x in test_case['features']]}")
        print(f"  Expected: {test_case['expected_soh']}")
        print(f"  Predicted SOH: {prediction:.3f}")
        print(f"  Status: {status}")

if __name__ == "__main__":
    train_model()