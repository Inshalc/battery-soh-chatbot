from flask import Flask, request, jsonify
import pandas as pd
from src.predictor import classify_pack  # make sure this path is correct

app = Flask(__name__)

# Test route for frontend (so battery monitor can fetch data)
@app.route("/api/soh", methods=["GET"])
def get_soh():
    # Example static data for testing
    return jsonify({"SOH": 0.75, "status": "Healthy"})

# Existing route to do real prediction
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # expects {"U1": val, ..., "U21": val}
    df = pd.DataFrame([data])
    soh, status = classify_pack(df, threshold=0.6)
    return jsonify({"SOH": soh, "status": status})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
