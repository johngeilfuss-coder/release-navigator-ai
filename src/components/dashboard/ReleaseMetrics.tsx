import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, TrendingDown, AlertTriangle, Activity } from "lucide-react";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
}

const mockMetrics: MetricCard[] = [
  {
    title: "Release Frequency",
    value: "12/week",
    change: "+2 vs last week",
    trend: "up",
    icon: <Calendar className="h-4 w-4" />
  },
  {
    title: "Mean Time to Release",
    value: "4.2h",
    change: "-0.8h vs last week",
    trend: "down",
    icon: <Clock className="h-4 w-4" />
  },
  {
    title: "Failure Rate",
    value: "8.3%",
    change: "+1.2% vs last week",
    trend: "up",
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    title: "Approval Delay",
    value: "2.1h",
    change: "-0.5h vs last week",
    trend: "down",
    icon: <Activity className="h-4 w-4" />
  }
];

interface RepoVolume {
  repo: string;
  releases: number;
  change: number;
}

const mockRepoVolumes: RepoVolume[] = [
  { repo: "auth-service", releases: 4, change: +1 },
  { repo: "payment-gateway", releases: 3, change: 0 },
  { repo: "api-gateway", releases: 2, change: -1 },
  { repo: "ui-app", releases: 2, change: +1 },
  { repo: "data-service", releases: 1, change: 0 }
];

export function ReleaseMetrics() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string, isGoodTrend: boolean) => {
    if (trend === "stable") return "text-muted-foreground";
    
    const isPositive = trend === "up";
    if (isGoodTrend) {
      return isPositive ? "text-success" : "text-destructive";
    } else {
      return isPositive ? "text-destructive" : "text-success";
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric, index) => {
          const isGoodTrend = metric.title === "Release Frequency" || metric.title === "Mean Time to Release" || metric.title === "Approval Delay";
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-xs flex items-center space-x-1 ${getTrendColor(metric.trend, isGoodTrend)}`}>
                  {getTrendIcon(metric.trend)}
                  <span>{metric.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Release Volume by Repository */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Release Volume by Repository
            <Badge variant="secondary">This week</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRepoVolumes.map((repo, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="font-medium">{repo.repo}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold">{repo.releases}</span>
                  <Badge 
                    variant={repo.change > 0 ? "default" : repo.change < 0 ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    {repo.change > 0 ? `+${repo.change}` : repo.change === 0 ? "±0" : repo.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Released Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recently Released Tickets
            <Badge variant="secondary">Last 7 days</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">EPIC-004 - User Profile Enhancements</h4>
                <p className="text-sm text-muted-foreground">frontend-app • 5 child tickets</p>
              </div>
              <div className="text-right">
                <Badge variant="default">Complete</Badge>
                <p className="text-xs text-muted-foreground mt-1">2024-01-08 14:30</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">EPIC-005 - Payment Integration Update</h4>
                <p className="text-sm text-muted-foreground">payment-gateway • 3 child tickets</p>
              </div>
              <div className="text-right">
                <Badge variant="default">Complete</Badge>
                <p className="text-xs text-muted-foreground mt-1">2024-01-07 16:45</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">EPIC-006 - API Performance Improvements</h4>
                <p className="text-sm text-muted-foreground">api-gateway • 4 child tickets</p>
              </div>
              <div className="text-right">
                <Badge variant="default">Complete</Badge>
                <p className="text-xs text-muted-foreground mt-1">2024-01-06 11:20</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">EPIC-007 - Mobile App Security Update</h4>
                <p className="text-sm text-muted-foreground">mobile-app • 2 child tickets</p>
              </div>
              <div className="text-right">
                <Badge variant="default">Complete</Badge>
                <p className="text-xs text-muted-foreground mt-1">2024-01-05 09:15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotfix Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Hotfix Analysis
            <Badge variant="destructive">3 hotfixes this week</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Payment Gateway Timeout Fix</h4>
                <p className="text-sm text-muted-foreground">Critical production issue</p>
              </div>
              <div className="text-right">
                <Badge variant="destructive">Critical</Badge>
                <p className="text-xs text-muted-foreground mt-1">2024-01-08 16:30</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Auth Service Memory Leak</h4>
                <p className="text-sm text-muted-foreground">High memory usage fix</p>
              </div>
              <div className="text-right">
                <Badge variant="default">High</Badge>
                <p className="text-xs text-muted-foreground mt-1">2024-01-07 14:15</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">UI Rendering Bug</h4>
                <p className="text-sm text-muted-foreground">Dashboard display issue</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">Medium</Badge>
                <p className="text-xs text-muted-foreground mt-1">2024-01-06 10:45</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}