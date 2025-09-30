import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());

function getRandomValue(min, max, decimals = 2) {
  return +(Math.random() * (max - min) + min).toFixed(decimals);
}

function generateEnvironmentalData() {
  const data = {
    temperature: getRandomValue(20, 40),
    humidity: getRandomValue(30, 90),
    vibration: getRandomValue(0, 10),
    airQuality: getRandomValue(0, 500),
    rainfall: getRandomValue(0, 100),
    soilMoisture: getRandomValue(10, 60),
    windSpeed: getRandomValue(0, 30),
  };

  let riskScore = 0;
  if (data.vibration > 7) riskScore += 0.3;
  if (data.rainfall > 70) riskScore += 0.2;
  if (data.soilMoisture < 20) riskScore += 0.2;
  if (data.airQuality > 300) riskScore += 0.1;
  if (data.temperature > 35) riskScore += 0.1;
  if (data.windSpeed > 20) riskScore += 0.1;

  data.riskProbability = +(Math.min(1, riskScore).toFixed(2));

  return data;
}

let latestData = generateEnvironmentalData();

setInterval(() => {
  latestData = generateEnvironmentalData();
}, 5000);

app.get('/api/environmental-data', (req, res) => {
  res.json(latestData);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});