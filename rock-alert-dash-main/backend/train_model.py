import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# Load training data using absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "rockfall_training_data.csv")
df = pd.read_csv(DATA_PATH)

# Features and target
feature_cols = [
    "temperature",
    "humidity",
    "vibration",
    "air_quality",
    "rainfall",
    "soil_moisture",
    "wind_speed"
]
X = df[feature_cols]
y = df["risk_probability"]

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
MODEL_PATH = os.path.join(BASE_DIR, "rockfall_model.pkl")
joblib.dump(model, MODEL_PATH)
print(f"Model trained and saved as {MODEL_PATH}")
