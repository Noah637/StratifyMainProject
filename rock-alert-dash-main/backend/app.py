import joblib
import numpy as np
from flask import Flask, jsonify
import random
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model using absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "rockfall_model.pkl")
model = joblib.load(MODEL_PATH)

@app.route("/get_data")
def get_data():
    # Simulate live sensor values (replace with real sensors later)
    temperature = random.uniform(15, 30)
    humidity = random.uniform(40, 90)
    vibration = random.uniform(0, 10)
    air_quality = random.uniform(100, 500)
    rainfall = random.uniform(0, 100)
    soil_moisture = random.uniform(5, 40)
    wind_speed = random.uniform(0, 20)

    # Simulate additional fields for UI
    cumulative_rainfall = rainfall + random.uniform(0, 50)
    temperature_range = random.uniform(5, 15)
    pore_pressure = random.uniform(0, 100)

    now = np.datetime64('now').astype(str)

    # Make prediction
    features = np.array([[temperature, humidity, vibration, air_quality, rainfall, soil_moisture, wind_speed]])
    risk_prob = model.predict(features)[0]
    # Ensure risk_prob is between 0 and 1
    if risk_prob > 1:
        risk_prob = risk_prob / 100.0

    # Helper to generate status
    def status(val, threshold):
        return "High" if val > threshold else "Normal"

    # Format response for new UI
    data = {
        "rainfall": {
            "value": round(rainfall, 2),
            "unit": "mm",
            "threshold": 50,
            "status": status(rainfall, 50),
            "lastUpdated": now
        },
        "cumulativeRainfall": {
            "value": round(cumulative_rainfall, 2),
            "unit": "mm",
            "threshold": 100,
            "status": status(cumulative_rainfall, 100),
            "lastUpdated": now
        },
        "temperature": {
            "value": round(temperature, 2),
            "unit": "°C",
            "threshold": 28,
            "status": status(temperature, 28),
            "lastUpdated": now
        },
        "temperatureRange": {
            "value": round(temperature_range, 2),
            "unit": "°C",
            "threshold": 10,
            "status": status(temperature_range, 10),
            "lastUpdated": now
        },
        "vibration": {
            "value": round(vibration, 2),
            "unit": "mm/s",
            "threshold": 7,
            "status": status(vibration, 7),
            "lastUpdated": now
        },
        "porePressure": {
            "value": round(pore_pressure, 2),
            "unit": "kPa",
            "threshold": 80,
            "status": status(pore_pressure, 80),
            "lastUpdated": now
        },
        "humidity": {
            "value": round(humidity, 2),
            "unit": "%",
            "threshold": 70,
            "status": status(humidity, 70),
            "lastUpdated": now
        },
    "riskProbability": float(risk_prob)
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
