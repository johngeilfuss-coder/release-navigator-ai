import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, AlertTriangle, MessageSquare, Zap, Timer } from "lucide-react";
import { SlackAssignment } from "./SlackAssignment";

interface FailingTest {
  id: string;
  name: string;
  service: string;
  status: "failing" | "flaky" | "timeout";
  failingSince: string;
  failureCount: number;
  buildDuration: string;
  lastFailure: string;
  errorMessage: string;
  isFlaky: boolean;
}

interface TestOverview {
  totalTests: number;
  passingTests: number;
  failingTests: number;
  flakyTests: number;
  averageBuildTime: string;
}

const mockTestOverview: TestOverview = {
  totalTests: 172,
  passingTests: 125,
  failingTests: 8,
  flakyTests: 3,
  averageBuildTime: "4m 32s"
};

const mockFailingTests: FailingTest[] = [
  {
    id: "test-001",
    name: "Payment timeout handling",
    service: "payment-gateway",
    status: "failing",
    failingSince: "2024-01-07 14:30",
    failureCount: 12,
    buildDuration: "2m 18s",
    lastFailure: "2024-01-08 16:15",
    errorMessage: "Connection timeout after 30s",
    isFlaky: false
  },
  {
    id: "test-002",
    name: "Credit card validation edge cases",
    service: "payment-gateway",
    status: "failing",
    failingSince: "2024-01-08 09:45",
    failureCount: 3,
    buildDuration: "1m 42s",
    lastFailure: "2024-01-08 16:15",
    errorMessage: "Invalid card number format",
    isFlaky: false
  },
  {
    id: "test-003",
    name: "User login flow",
    service: "auth-service",
    status: "flaky",
    failingSince: "2024-01-06 11:20",
    failureCount: 8,
    buildDuration: "3m 12s",
    lastFailure: "2024-01-08 14:22",
    errorMessage: "Intermittent session timeout",
    isFlaky: true
  },
  {
    id: "test-004",
    name: "Dashboard loading performance",
    service: "ui-app",
    status: "timeout",
    failingSince: "2024-01-08 13:15",
    failureCount: 5,
    buildDuration: "6m 45s",
    lastFailure: "2024-01-08 17:45",
    errorMessage: "Test exceeded 5 minute timeout",
    isFlaky: false
  },
  {
    id: "test-005",
    name: "API rate limiting",
    service: "api-gateway",
    status: "flaky",
    failingSince: "2024-01-05 16:30",
    failureCount: 15,
    buildDuration: "2m 55s",
    lastFailure: "2024-01-08 12:10",
    errorMessage: "Rate limit exceeded sporadically",
    isFlaky: true
  }
];

export function TestStatus() {
  const [assignmentDialog, setAssignmentDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  } | null>(null);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "failing":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "flaky":
        return <Zap className="h-4 w-4 text-warning" />;
      case "timeout":
        return <Timer className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "failing":
        return "destructive";
      case "flaky":
        return "secondary";
      case "timeout":
        return "outline";
      default:
        return "outline";
    }
  };

  const getFailureDuration = (failingSince: string) => {
    const since = new Date(failingSince);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - since.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          E2E Test Status
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {mockTestOverview.totalTests} total tests
            </Badge>
            <Badge variant="outline">
              Avg: {mockTestOverview.averageBuildTime}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{mockTestOverview.passingTests}</div>
            <div className="text-sm text-muted-foreground">Passing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{mockTestOverview.failingTests}</div>
            <div className="text-sm text-muted-foreground">Failing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{mockTestOverview.flakyTests}</div>
            <div className="text-sm text-muted-foreground">Flaky</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockTestOverview.averageBuildTime}</div>
            <div className="text-sm text-muted-foreground">Avg Build</div>
          </div>
        </div>

        {/* Failing Tests */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Failing & Flaky Tests</h3>
          {mockFailingTests.map((test) => (
            <div key={test.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    <p className="text-sm text-muted-foreground">{test.service}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {test.isFlaky && (
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Flaky
                    </Badge>
                  )}
                  <Badge variant={getStatusVariant(test.status)}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Failing for: </span>
                  <span className="font-medium text-destructive">{getFailureDuration(test.failingSince)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Failures: </span>
                  <span className="font-medium">{test.failureCount}x</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Build time: </span>
                  <span className="font-medium">{test.buildDuration}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last failure: </span>
                  <span className="font-medium">{test.lastFailure}</span>
                </div>
              </div>
              
              <div className="bg-destructive/10 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Error:</span>
                    <span className="text-sm text-muted-foreground">{test.errorMessage}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setAssignmentDialog({
                      isOpen: true,
                      title: test.name,
                      description: `Test failing for ${getFailureDuration(test.failingSince)} - ${test.errorMessage}`
                    })}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Assign via Slack
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {assignmentDialog && (
        <SlackAssignment
          isOpen={assignmentDialog.isOpen}
          onClose={() => setAssignmentDialog(null)}
          title={assignmentDialog.title}
          description={assignmentDialog.description}
          type="test"
        />
      )}
    </Card>
  );
}