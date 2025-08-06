import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, XCircle, ExternalLink, Zap } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  source: "sentry-prod" | "sentry-nonprod" | "slack-dc";
  service: string;
  timestamp: string;
  url?: string;
  resolved: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "sentry-001",
    title: "High Error Rate in Payment Processing",
    description: "Spike in timeout errors detected in payment-gateway service",
    severity: "critical",
    source: "sentry-prod",
    service: "payment-gateway",
    timestamp: "2024-01-08 17:30",
    url: "https://sentry.io/alert/001",
    resolved: false
  },
  {
    id: "slack-001",
    title: "Data Center Switch Initiated",
    description: "DC failover from US-East to US-West started at 17:25",
    severity: "warning",
    source: "slack-dc",
    service: "infrastructure",
    timestamp: "2024-01-08 17:25",
    resolved: false
  },
  {
    id: "sentry-002",
    title: "Memory Usage Alert",
    description: "auth-service memory usage exceeded 85% threshold",
    severity: "warning",
    source: "sentry-nonprod",
    service: "auth-service",
    timestamp: "2024-01-08 16:45",
    url: "https://sentry.io/alert/002",
    resolved: true
  },
  {
    id: "sentry-003",
    title: "API Response Time Degradation",
    description: "Average response time increased by 200ms in last 15 minutes",
    severity: "info",
    source: "sentry-prod",
    service: "api-gateway",
    timestamp: "2024-01-08 16:15",
    url: "https://sentry.io/alert/003",
    resolved: false
  }
];

export function AlertsPanel() {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-info" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "slack-dc":
        return <Zap className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "sentry-prod":
        return <Badge variant="destructive" className="text-xs">Prod</Badge>;
      case "sentry-nonprod":
        return <Badge variant="secondary" className="text-xs">Non-Prod</Badge>;
      case "slack-dc":
        return <Badge variant="default" className="text-xs">DC Alert</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{source}</Badge>;
    }
  };

  const activeAlerts = mockAlerts.filter(alert => !alert.resolved);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Alerts & Observability
          <div className="flex items-center space-x-2">
            <Badge variant="destructive">
              {activeAlerts.filter(a => a.severity === "critical").length} critical
            </Badge>
            <Badge variant="secondary">{activeAlerts.length} active</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`border rounded-lg p-4 space-y-3 ${alert.resolved ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {alert.source === "slack-dc" ? getSourceIcon(alert.source) : getSeverityIcon(alert.severity)}
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={getSeverityVariant(alert.severity)}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </Badge>
                  {alert.resolved && (
                    <Badge variant="outline" className="text-xs">Resolved</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Service: {alert.service}</span>
                  {getSourceBadge(alert.source)}
                </div>
                <span className="text-muted-foreground">{alert.timestamp}</span>
              </div>
              
              <div className="flex space-x-2">
                {alert.url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={alert.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View in Sentry
                    </a>
                  </Button>
                )}
                {!alert.resolved && (
                  <Button size="sm" variant="default">
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}