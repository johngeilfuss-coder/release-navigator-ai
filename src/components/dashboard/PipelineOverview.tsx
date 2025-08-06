import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, Square, Clock, CheckCircle, XCircle } from "lucide-react";

interface Pipeline {
  id: string;
  name: string;
  service: string;
  status: "running" | "success" | "failed" | "pending" | "stopped";
  progress: number;
  duration: string;
  lastRun: string;
  branch: string;
}

const mockPipelines: Pipeline[] = [
  {
    id: "jenkins-001",
    name: "Authentication Service Build",
    service: "auth-service",
    status: "running",
    progress: 75,
    duration: "4m 32s",
    lastRun: "2024-01-08 17:15",
    branch: "release/v2.1.0"
  },
  {
    id: "jenkins-002",
    name: "Payment Gateway Deploy",
    service: "payment-gateway",
    status: "success",
    progress: 100,
    duration: "2m 18s",
    lastRun: "2024-01-08 16:45",
    branch: "hotfix/timeout-fix"
  },
  {
    id: "jenkins-003",
    name: "API Gateway Tests",
    service: "api-gateway",
    status: "failed",
    progress: 45,
    duration: "1m 23s",
    lastRun: "2024-01-08 15:30",
    branch: "release/v1.5.2"
  },
  {
    id: "jenkins-004",
    name: "User Interface Build",
    service: "ui-app",
    status: "pending",
    progress: 0,
    duration: "-",
    lastRun: "2024-01-08 14:00",
    branch: "release/v3.2.1"
  },
  {
    id: "jenkins-005",
    name: "Database Migration",
    service: "data-service",
    status: "stopped",
    progress: 30,
    duration: "45s",
    lastRun: "2024-01-08 13:15",
    branch: "migration/user-prefs"
  }
];

export function PipelineOverview() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-info animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "stopped":
        return <Square className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running":
        return "default";
      case "success":
        return "secondary";
      case "failed":
        return "destructive";
      case "pending":
        return "outline";
      case "stopped":
        return "outline";
      default:
        return "outline";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-primary";
      case "success":
        return "bg-success";
      case "failed":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Pipeline Overview
          <Badge variant="secondary">
            {mockPipelines.filter(p => p.status === "running").length} running
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPipelines.map((pipeline) => (
            <div key={pipeline.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(pipeline.status)}
                  <div>
                    <h4 className="font-medium">{pipeline.name}</h4>
                    <p className="text-sm text-muted-foreground">{pipeline.service}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(pipeline.status)}>
                  {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{pipeline.progress}%</span>
                </div>
                <Progress 
                  value={pipeline.progress} 
                  className={`h-2 ${getProgressColor(pipeline.status)}`}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="space-x-4">
                  <span className="text-muted-foreground">Branch: {pipeline.branch}</span>
                  <span className="text-muted-foreground">Duration: {pipeline.duration}</span>
                </div>
                <span className="text-muted-foreground">Last run: {pipeline.lastRun}</span>
              </div>
              
              <div className="flex space-x-2">
                {pipeline.status === "pending" && (
                  <Button size="sm" variant="default">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                {pipeline.status === "running" && (
                  <Button size="sm" variant="outline">
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                )}
                {(pipeline.status === "failed" || pipeline.status === "stopped") && (
                  <Button size="sm" variant="default">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Restart
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