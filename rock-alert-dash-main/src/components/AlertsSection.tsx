import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';

interface AlertData {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: Date;
}

interface AlertsSectionProps {
  alerts: AlertData[];
}

export const AlertsSection = ({ alerts }: AlertsSectionProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'Very High':
        return <AlertTriangle className="w-5 h-5" />;
      case 'high':
      case 'High':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'Very High':
        return 'border-destructive bg-destructive/10 text-destructive-foreground';
      case 'high':
      case 'High':
        return 'border-risk-high bg-risk-high/10 text-risk-high-foreground';
      case 'warning':
        return 'border-warning bg-warning/10 text-warning-foreground';
      default:
        return 'border-muted bg-muted/10';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (alerts.length === 0) {
    return (
      <Card className="industrial-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No Active Alerts</p>
              <p className="text-sm">All systems operating normally</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="industrial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          System Alerts
          <span className="ml-auto text-sm font-normal bg-destructive/20 text-destructive px-2 py-1 rounded-full">
            {alerts.length} active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} className={getSeverityClass(alert.severity)}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <AlertDescription className="font-semibold text-base mb-1">
                  ⚠️ {alert.message}
                </AlertDescription>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(alert.timestamp)}</span>
                  <span className="text-xs bg-background/20 px-2 py-0.5 rounded">
                    {alert.type}
                  </span>
                </div>
              </div>
            </div>
          </Alert>
        ))}
        
        {/* Alert Actions */}
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Recommended Actions:</strong>
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Evacuate personnel from high-risk areas immediately</li>
            <li>• Suspend operations in affected zones</li>
            <li>• Notify safety supervisors and emergency response team</li>
            <li>• Monitor environmental conditions continuously</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};