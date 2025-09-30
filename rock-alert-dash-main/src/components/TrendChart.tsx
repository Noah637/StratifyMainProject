import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

export type TrendPoint = {
  time: string;
  probability: number;
  category: string;
};

interface TrendChartProps {
  data: TrendPoint[];
}

export const TrendChart = ({ data }: TrendChartProps) => {
  // Color mapping for risk levels
  const getRiskColor = (prob: number) => {
    if (prob >= 0.7) return 'hsl(var(--destructive))';
    if (prob >= 0.5) return 'hsl(var(--risk-high))';
    if (prob >= 0.3) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  };

  // Custom dot renderer for colored points
  const renderDot = (props: any) => {
    const { cx, cy, value, index } = props;
    return (
      <circle
        key={index}
        cx={cx}
        cy={cy}
        r={5}
        stroke="#fff"
        strokeWidth={2}
        fill={getRiskColor(value)}
      />
    );
  };

  // Custom tooltip with colored badge
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = getRiskColor(data.probability);
      return (
        <div className="industrial-card p-3 shadow-lg">
          <p className="text-sm font-medium">Time: {label}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: color }}
            />
            <span className="font-semibold">{Math.round(data.probability * 100)}%</span>
            <span className="ml-2 text-xs text-muted-foreground">{data.category}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="industrial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Risk Trend - Past 24 Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[0, 1]}
                label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }}
                tickFormatter={v => `${Math.round(v * 100)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Risk threshold lines (as 0-1) */}
              <ReferenceLine 
                y={0.3} 
                stroke="hsl(var(--warning))" 
                strokeDasharray="5 5"
                label={{ value: "Moderate", position: "insideTopRight" }}
              />
              <ReferenceLine 
                y={0.5} 
                stroke="hsl(var(--risk-high))" 
                strokeDasharray="5 5"
                label={{ value: "High", position: "insideTopRight" }}
              />
              <ReferenceLine 
                y={0.7} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="5 5"
                label={{ value: "Very High", position: "insideTopRight" }}
              />
              <Line
                type="monotone"
                dataKey="probability"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={renderDot}
                activeDot={renderDot}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
            <span>Low (&lt;30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'hsl(var(--warning))' }} />
            <span>Moderate (30%-49%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'hsl(var(--risk-high))' }} />
            <span>High (50%-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'hsl(var(--destructive))' }} />
            <span>Very High (≥70%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};