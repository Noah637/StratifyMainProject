import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";

type RiskData = {
  probability: number; // 0-1
  category: string;    // "High", "Medium", "Low"
  timestamp: Date;
};

const getBadgeVariant = (prob: number): "default" | "secondary" | "destructive" => {
  if (prob >= 0.7) return "destructive";
  if (prob >= 0.5) return "secondary";
  return "default";
};

export const RiskStatusCard = ({ riskData }: { riskData: RiskData }) => {
  const badgeVariant = getBadgeVariant(riskData.probability);
  return (
    <Card className="rounded-xl shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/assets/rock-icon.png" alt="Rockfall" />
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold tracking-tight">Rockfall Risk</span>
          <Badge variant={badgeVariant} className="text-base px-4 py-1 rounded-full">
            {riskData.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold text-foreground">{(riskData.probability * 100).toFixed(1)}%</span>
          <span className="text-sm text-muted-foreground font-medium">Probability</span>
        </div>
        <Progress value={riskData.probability * 100} />
        <div className="text-xs text-muted-foreground mt-2">
          Last Updated: {riskData.timestamp.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};