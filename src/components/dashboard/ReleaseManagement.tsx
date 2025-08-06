import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done" | "Ready for Release";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignee: string;
  jiraLink: string;
  riskLevel: "Low" | "Medium" | "High";
  summary: string;
}

const mockTickets: Ticket[] = [
  {
    id: "PROJ-1234",
    title: "Implement user authentication improvements",
    status: "Ready for Release",
    priority: "High",
    assignee: "John Doe",
    jiraLink: "https://jira.company.com/PROJ-1234",
    riskLevel: "Medium",
    summary: "Authentication flow updates with enhanced security measures. Medium risk due to auth system changes."
  },
  {
    id: "PROJ-1235",
    title: "Fix payment gateway timeout issues",
    status: "Ready for Release",
    priority: "Critical",
    assignee: "Sarah Smith",
    jiraLink: "https://jira.company.com/PROJ-1235",
    riskLevel: "Low",
    summary: "Timeout configuration adjustments for payment processing. Low risk - configuration only changes."
  },
  {
    id: "PROJ-1236",
    title: "Add new reporting dashboard",
    status: "In Progress",
    priority: "Medium",
    assignee: "Mike Johnson",
    jiraLink: "https://jira.company.com/PROJ-1236",
    riskLevel: "Low",
    summary: "New analytics dashboard for business metrics. Low risk - new feature, no existing functionality affected."
  },
  {
    id: "PROJ-1237",
    title: "Database migration for user preferences",
    status: "Ready for Release",
    priority: "Medium",
    assignee: "Lisa Chen",
    jiraLink: "https://jira.company.com/PROJ-1237",
    riskLevel: "High",
    summary: "Schema changes for user preference storage. High risk due to database migration and potential data loss."
  }
];

export function ReleaseManagement() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
      case "Ready for Release":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskIcon = (risk: string) => {
    const color = risk === "High" ? "text-destructive" : 
                 risk === "Medium" ? "text-warning" : "text-success";
    return <AlertTriangle className={`h-4 w-4 ${color}`} />;
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive";
      case "High":
        return "default";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Release Management
          <Badge variant="secondary">{mockTickets.length} tickets</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(ticket.status)}
                  <div>
                    <h4 className="font-medium">{ticket.id}</h4>
                    <p className="text-sm text-muted-foreground">{ticket.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityVariant(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={ticket.jiraLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assignee: {ticket.assignee}</span>
                <div className="flex items-center space-x-2">
                  {getRiskIcon(ticket.riskLevel)}
                  <span className="text-muted-foreground">Risk: {ticket.riskLevel}</span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm">{ticket.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}