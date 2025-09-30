import { useState, useEffect } from "react";
import { Header } from "./Header";
import { RiskStatusCard } from "./RiskStatusCard";
import { TrendChart, TrendPoint } from "./TrendChart";
import { EnvironmentalDataTable } from "./EnvironmentalDataTable";

export const Dashboard = () => {
  const [envData, setEnvData] = useState<any>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5000/get_data")
        .then((res) => res.json())
        .then((data) => {
          // Convert date strings to Date objects
          for (const key in data) {
            if (data[key]?.lastUpdated) {
              data[key].lastUpdated = new Date(data[key].lastUpdated);
            }
          }
          setEnvData(data);
          setLastUpdate(new Date());

          // Add new point to trendData
          setTrendData((prev) => [
            ...prev.slice(-23), // keep last 24 points (for 2 hours if 5s interval)
            {
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              probability: data.riskProbability,
              category:
                data.riskProbability > 0.7
                  ? "High"
                  : data.riskProbability > 0.4
                  ? "Medium"
                  : "Low",
            },
          ]);
        })
        .catch((err) => console.error("Error fetching data:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Map backend data to table rows
  const tableData = envData
    ? [
        {
          parameter: "Rainfall",
          value: envData.rainfall.value,
          unit: envData.rainfall.unit,
          threshold: envData.rainfall.threshold,
          status: envData.rainfall.status,
          lastUpdated: envData.rainfall.lastUpdated,
        },
        {
          parameter: "Cumulative Rainfall (24h)",
          value: envData.cumulativeRainfall.value,
          unit: envData.cumulativeRainfall.unit,
          threshold: envData.cumulativeRainfall.threshold,
          status: envData.cumulativeRainfall.status,
          lastUpdated: envData.cumulativeRainfall.lastUpdated,
        },
        {
          parameter: "Temperature",
          value: envData.temperature.value,
          unit: envData.temperature.unit,
          threshold: envData.temperature.threshold,
          status: envData.temperature.status,
          lastUpdated: envData.temperature.lastUpdated,
        },
        {
          parameter: "Temperature Range",
          value: envData.temperatureRange.value,
          unit: envData.temperatureRange.unit,
          threshold: envData.temperatureRange.threshold,
          status: envData.temperatureRange.status,
          lastUpdated: envData.temperatureRange.lastUpdated,
        },
        {
          parameter: "Vibration",
          value: envData.vibration.value,
          unit: envData.vibration.unit,
          threshold: envData.vibration.threshold,
          status: envData.vibration.status,
          lastUpdated: envData.vibration.lastUpdated,
        },
        {
          parameter: "Pore Pressure",
          value: envData.porePressure.value,
          unit: envData.porePressure.unit,
          threshold: envData.porePressure.threshold,
          status: envData.porePressure.status,
          lastUpdated: envData.porePressure.lastUpdated,
        },
        {
          parameter: "Humidity",
          value: envData.humidity.value,
          unit: envData.humidity.unit,
          threshold: envData.humidity.threshold,
          status: envData.humidity.status,
          lastUpdated: envData.humidity.lastUpdated,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <RiskStatusCard
              riskData={
                envData
                  ? {
                      probability: envData.riskProbability,
                      category:
                        envData.riskProbability > 0.7
                          ? "Very High Risk"
                          : envData.riskProbability > 0.4
                          ? "Moderate Risk"
                          : "Low Risk",
                      timestamp: lastUpdate,
                    }
                  : { probability: 0, category: "Unknown", timestamp: new Date() }
              }
            />
          </div>
          <div className="lg:col-span-2">
            <EnvironmentalDataTable data={tableData} />
          </div>
        </div>
        <div className="mb-6">
          <TrendChart data={trendData} />
        </div>
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
          <p>
            Last updated: {lastUpdate.toLocaleString()} •
            Auto-refresh: 5 seconds •
            Status: Online
          </p>
        </div>
      </div>
    </div>
  );
};