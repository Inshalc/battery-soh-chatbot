# ml-model/src/train_model_enhanced.py
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import joblib
from pathlib import Path

def augment_training_data(df, target_col='SOH'):
    """Augment training data to include low SOH examples"""
    
    # Check current SOH range
    min_soh = df[target_col].min()
    max_soh = df[target_col].max()
    
    print(f"Original SOH range: {min_soh:.3f} to {max_soh:.3f}")
    
    # If no low SOH data, create synthetic examples
    if min_soh >= 0.6:
        print("Augmenting data with low SOH examples...")
        
        # Create synthetic degraded batteries by scaling down healthy ones
        healthy_samples = df[df[target_col] > 0.7].copy()
        n_augment = min(100, len(healthy_samples))  # Create up to 100 synthetic samples
        
        augmented_data = []
        for _, sample in healthy_samples.head(n_augment).iterrows():
            # Scale features down to represent degradation
            scale_factor = np.random.uniform(0.3, 0.6)  # Target SOH between 0.3-0.6
            
            synthetic_sample = sample.copy()
            # Scale feature columns (adjust based on your actual feature names)
            feature_cols = [col for col in df.columns if col != target_col]
            for col in feature_cols:
                if col in synthetic_sample:
                    synthetic_sample[col] *= scale_factor * np.random.uniform(0.8, 1.2)
            
            synthetic_sample[target_col] = scale_factor
            augmented_data.append(synthetic_sample)
        
        # Combine original and augmented data
        augmented_df = pd.concat([df, pd.DataFrame(augmented_data)], ignore_index=True)
        print(f"Augmented dataset: {len(augmented_df)} samples")
        print(f"New SOH range: {augmented_df[target_col].min():.3f} to {augmented_df[target_col].max():.3f}")
        
        return augmented_df
    
    return df

def train_enhanced_model():
    BASE_DIR = Path(__file__).parent.parent
    
    # Load your data
    data_path = BASE_DIR / 'data/processed_battery_data.csv'
    df = pd.read_csv(data_path)
    
    # Augment data if needed
    df = augment_training_data(df)
    
    # Prepare features and target
    feature_cols = ['Pack_SOH_mean', 'Pack_SOH_median', 'Pack_SOH_std', 
                   'Pack_SOH_min', 'Pack_SOH_max', 'Pack_SOH_skew']
    X = df[feature_cols]
    y = df['SOH']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    y_pred = np.clip(y_pred, 0, 1)  # Clip to valid range
    
    r2 = r2_score(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"R² Score: {r2:.4f}")
    print(f"MSE: {mse:.4f}")
    print(f"MAE: {mae:.4f}")
    
    # Save model and scaler
    BASE_DIR = Path(__file__).parent.parent
    models_dir = BASE_DIR / 'models'
    scalers_dir = BASE_DIR / 'scalers'
    
    models_dir.mkdir(exist_ok=True)
    scalers_dir.mkdir(exist_ok=True)
    
    joblib.dump(model, models_dir / 'enhanced_model.pkl')
    joblib.dump(scaler, scalers_dir / 'enhanced_scaler.pkl')
    
    print("Enhanced model trained and saved!")

if __name__ == "__main__":
    train_enhanced_model()