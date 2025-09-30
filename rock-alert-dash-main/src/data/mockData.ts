// Mock data service for rockfall risk prediction system

export interface RiskData {
  probability: number;
  category: 'Low' | 'Moderate' | 'High' | 'Very High';
  color: string;
  timestamp: Date;
}

export interface EnvironmentalData {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface TrendPoint {
  time: string;
  probability: number;
  category: string;
}

// Generate realistic trend data for the past 24 hours
export const generateTrendData = (): TrendPoint[] => {
  const data: TrendPoint[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseProb = 45 + Math.sin(i * 0.3) * 15 + Math.random() * 20;
    const probability = Math.max(5, Math.min(95, baseProb));
    
    let category = 'Low';
    if (probability > 70) category = 'Very High';
    else if (probability > 50) category = 'High';
    else if (probability > 30) category = 'Moderate';
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      probability: Math.round(probability),
      category
    });
  }
  
  return data;
};

// Get current risk status
export const getCurrentRisk = (): RiskData => {
  const probability = 78; // Current high risk scenario
  let category: RiskData['category'] = 'Low';
  let color = '#22c55e'; // green
  
  if (probability > 70) {
    category = 'Very High';
    color = '#ef4444'; // red
  } else if (probability > 50) {
    category = 'High';
    color = '#f97316'; // orange
  } else if (probability > 30) {
    category = 'Moderate';
    color = '#eab308'; // yellow
  }
  
  return {
    probability,
    category,
    color,
    timestamp: new Date()
  };
};

// Environmental sensor data
export const getEnvironmentalData = (): EnvironmentalData[] => {
  return [
    {
      id: '1',
      parameter: 'Rainfall',
      value: 12.5,
      unit: 'mm/hr',
      threshold: 10,
      status: 'warning',
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    },
    {
      id: '2',
      parameter: 'Cumulative Rainfall (24h)',
      value: 48.3,
      unit: 'mm',
      threshold: 50,
      status: 'warning',
      lastUpdated: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
    },
    {
      id: '3',
      parameter: 'Temperature',
      value: 18.7,
      unit: '°C',
      status: 'normal',
      lastUpdated: new Date(Date.now() - 30 * 1000) // 30 seconds ago
    },
    {
      id: '4',
      parameter: 'Temperature Range',
      value: 8.2,
      unit: '°C',
      status: 'normal',
      lastUpdated: new Date(Date.now() - 45 * 1000) // 45 seconds ago
    },
    {
      id: '5',
      parameter: 'Vibration',
      value: 3.8,
      unit: 'mm/s',
      threshold: 5,
      status: 'normal',
      lastUpdated: new Date(Date.now() - 15 * 1000) // 15 seconds ago
    },
    {
      id: '6',
      parameter: 'Pore Pressure',
      value: 125.6,
      unit: 'kPa',
      threshold: 150,
      status: 'normal',
      lastUpdated: new Date(Date.now() - 3 * 60 * 1000) // 3 minutes ago
    },
    {
      id: '7',
      parameter: 'Humidity',
      value: 82.4,
      unit: '%',
      threshold: 85,
      status: 'normal',
      lastUpdated: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
    }
  ];
};

// Get active alerts
export const getActiveAlerts = () => {
  const currentRisk = getCurrentRisk();
  const alerts = [];
  
  if (currentRisk.category === 'High' || currentRisk.category === 'Very High') {
    alerts.push({
      id: '1',
      type: 'risk',
      severity: currentRisk.category === 'Very High' ? 'critical' : 'high',
      message: `${currentRisk.category} Risk of Rockfall Detected — Immediate Action Recommended!`,
      timestamp: new Date()
    });
  }
  
  const envData = getEnvironmentalData();
  envData.forEach(data => {
    if (data.status === 'warning' || data.status === 'critical') {
      alerts.push({
        id: `env-${data.id}`,
        type: 'environmental',
        severity: data.status,
        message: `${data.parameter} level ${data.status === 'critical' ? 'critical' : 'elevated'}: ${data.value}${data.unit}`,
        timestamp: data.lastUpdated
      });
    }
  });
  
  return alerts;
};