
import React, { useEffect, useState } from 'react';
import DemVisualizer from './DemVisualizer';
function App() {
  const [demArray, setDemArray] = useState<Float32Array | null>(null);
  const [riskArray, setRiskArray] = useState<Float32Array | null>(null);
  const [size, setSize] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch('/dem_risk_rolling_hills_64.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch DEM JSON');
        return res.json();
      })
      .then((data) => {
        if (!data.dem || !Array.isArray(data.dem)) throw new Error('DEM data missing or invalid');
        const flatDem = data.dem.flat();
        setDemArray(new Float32Array(flatDem));
        if (data.risk && Array.isArray(data.risk)) {
          setRiskArray(new Float32Array(data.risk.flat()));
        } else {
          setRiskArray(null);
        }
        setSize(data.dem.length);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{color: 'white'}}>Loading DEM...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;
  if (!demArray || !size) return <div style={{color: 'red'}}>No DEM data found.</div>;

  return <DemVisualizer demArray={demArray} riskArray={riskArray} size={size} />;
}

export default App;
