# src/predictor.py

def classify_pack(features_df, threshold=0.6):
    soh = 0.75  # dummy value
    status = "Healthy" if soh >= threshold else "Problem"
    return soh, status
