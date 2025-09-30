import { Badge } from "./ui/badge";
import { CloudRain, Thermometer, Waves, Activity, Droplets, Gauge, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type EnvRow = {
  parameter: string;
  value: number | string;
  unit: string;
  threshold?: number;
  status: string;
  lastUpdated: Date;
};

const parameterIcons: Record<string, JSX.Element> = {
  Rainfall: <CloudRain className="w-5 h-5 text-blue-500" />,
  "Cumulative Rainfall (24h)": <CloudRain className="w-5 h-5 text-blue-400" />,
  Temperature: <Thermometer className="w-5 h-5 text-orange-500" />,
  "Temperature Range": <Thermometer className="w-5 h-5 text-orange-400" />,
  Vibration: <Activity className="w-5 h-5 text-pink-500" />,
  "Pore Pressure": <Gauge className="w-5 h-5 text-purple-500" />,
  Humidity: <Droplets className="w-5 h-5 text-cyan-500" />,
};

const statusColors: Record<string, string> = {
  normal: "default",
  warning: "secondary",
  critical: "destructive",
};

export const EnvironmentalDataTable = ({ data }: { data: EnvRow[] }) => (
  <table className="min-w-full bg-card rounded-lg shadow">
    <thead>
      <tr className="bg-muted">
        <th className="px-4 py-2 text-left">Parameter</th>
        <th className="px-4 py-2 text-left">Value</th>
        <th className="px-4 py-2 text-left">Unit</th>
        <th className="px-4 py-2 text-left">Threshold</th>
        <th className="px-4 py-2 text-left">Status</th>
        <th className="px-4 py-2 text-left">Last Updated</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx} className="border-b hover:bg-muted/50">
          <td className="flex items-center gap-2 px-4 py-2">
            {parameterIcons[row.parameter] || <Clock className="w-5 h-5 text-muted-foreground" />} 
            <span>{row.parameter}</span>
          </td>
          <td className="px-4 py-2 font-mono font-semibold">{row.value}</td>
          <td className="px-4 py-2">{row.unit}</td>
          <td className="px-4 py-2 text-xs text-muted-foreground">{row.threshold !== undefined ? row.threshold : '-'}</td>
          <td className="px-4 py-2">
            <Badge variant={statusColors[row.status] as "default" | "secondary" | "destructive" | "outline" || "default"}>
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </Badge>
          </td>
          <td className="px-4 py-2 text-xs text-muted-foreground">
            {formatDistanceToNow(row.lastUpdated, { addSuffix: true })}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);