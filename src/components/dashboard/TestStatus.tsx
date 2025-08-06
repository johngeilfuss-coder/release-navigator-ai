import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, AlertTriangle, MessageSquare } from "lucide-react";

interface TestSuite {
  id: string;
  name: string;
  service: string;
  status: "running" | "passed" | "failed" | "pending";
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: string;
  lastRun: string;
  failureDetails?: string[];
}

const mockTestSuites: TestSuite[] = [
  {
    id: "e2e-001",
    name: "Authentication Flow Tests",
    service: "auth-service",
    status: "passed",
    totalTests: 45,
    passedTests: 45,
    failedTests: 0,
    duration: "3m 42s",
    lastRun: "2024-01-08 17:30"
  },
  {
    id: "e2e-002", 
    name: "Payment Processing Tests",
    service: "payment-gateway",
    status: "failed",
    totalTests: 32,
    passedTests: 28,
    failedTests: 4,
    duration: "2m 18s",
    lastRun: "2024-01-08 16:15",
    failureDetails: [
      "Payment timeout handling",
      "Credit card validation edge cases",
      "Refund processing workflow",
      "Currency conversion errors"
    ]
  },
  {
    id: "e2e-003",
    name: "User Interface Integration",
    service: "ui-app", 
    status: "running",
    totalTests: 67,
    passedTests: 52,
    failedTests: 2,
    duration: "5m 12s",
    lastRun: "2024-01-08 17:45"
  },
  {
    id: "e2e-004",
    name: "API Gateway Tests",
    service: "api-gateway",
    status: "pending",
    totalTests: 28,
    passedTests: 0,
    failedTests: 0,
    duration: "-",
    lastRun: "2024-01-08 14:30"
  }
];

export function TestStatus() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-info animate-pulse" />;
      case "passed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running":
        return "default";
      case "passed":
        return "secondary";
      case "failed":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const getPassRate = (suite: TestSuite) => {
    if (suite.totalTests === 0) return 0;
    return Math.round((suite.passedTests / suite.totalTests) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          E2E Test Status
          <Badge variant="secondary">
            {mockTestSuites.reduce((acc, suite) => acc + suite.totalTests, 0)} total tests
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTestSuites.map((suite) => (
            <div key={suite.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(suite.status)}
                  <div>
                    <h4 className="font-medium">{suite.name}</h4>
                    <p className="text-sm text-muted-foreground">{suite.service}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(suite.status)}>
                  {suite.status.charAt(0).toUpperCase() + suite.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-medium">{suite.totalTests}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Passed: </span>
                  <span className="font-medium text-success">{suite.passedTests}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Failed: </span>
                  <span className="font-medium text-destructive">{suite.failedTests}</span>
                </div>
              </div>
              
              {suite.status !== "pending" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pass Rate</span>
                    <span className="font-medium">{getPassRate(suite)}%</span>
                  </div>
                  <Progress value={getPassRate(suite)} className="h-2" />
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration: {suite.duration}</span>
                <span className="text-muted-foreground">Last run: {suite.lastRun}</span>
              </div>
              
              {suite.failureDetails && suite.failureDetails.length > 0 && (
                <div className="bg-destructive/10 p-3 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Failed Tests:</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {suite.failureDetails.map((failure, index) => (
                      <li key={index} className="text-muted-foreground">• {failure}</li>
                    ))}
                  </ul>
                  <Button size="sm" variant="outline" className="mt-2">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Send to Team
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}