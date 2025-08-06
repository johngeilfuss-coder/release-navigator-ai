import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExternalLink, AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react";
import { useState } from "react";

interface Ticket {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done" | "Ready for Release" | "Testing in Non-Prod";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignee: string;
  jiraLink: string;
  riskLevel: "Low" | "Medium" | "High";
  summary: string;
  prodDeadline: string;
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
    summary: "Authentication flow updates with enhanced security measures. Medium risk due to auth system changes.",
    prodDeadline: "2024-02-15"
  },
  {
    id: "PROJ-1235",
    title: "Fix payment gateway timeout issues",
    status: "Ready for Release",
    priority: "Critical",
    assignee: "Sarah Smith",
    jiraLink: "https://jira.company.com/PROJ-1235",
    riskLevel: "Low",
    summary: "Timeout configuration adjustments for payment processing. Low risk - configuration only changes.",
    prodDeadline: "2024-02-10"
  },
  {
    id: "PROJ-1236",
    title: "Add new reporting dashboard",
    status: "Testing in Non-Prod",
    priority: "Medium",
    assignee: "Mike Johnson",
    jiraLink: "https://jira.company.com/PROJ-1236",
    riskLevel: "Low",
    summary: "New analytics dashboard for business metrics. Low risk - new feature, no existing functionality affected.",
    prodDeadline: "2024-02-20"
  },
  {
    id: "PROJ-1237",
    title: "Database migration for user preferences",
    status: "Ready for Release",
    priority: "Medium",
    assignee: "Lisa Chen",
    jiraLink: "https://jira.company.com/PROJ-1237",
    riskLevel: "High",
    summary: "Schema changes for user preference storage. High risk due to database migration and potential data loss.",
    prodDeadline: "2024-02-12"
  },
  {
    id: "PROJ-1238",
    title: "API rate limiting implementation",
    status: "Testing in Non-Prod",
    priority: "High",
    assignee: "Alex Rodriguez",
    jiraLink: "https://jira.company.com/PROJ-1238",
    riskLevel: "High",
    summary: "Implementation of rate limiting to prevent API abuse. High risk due to potential service disruption.",
    prodDeadline: "2024-02-08"
  }
];

export function ReleaseManagement() {
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
      case "Ready for Release":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "In Progress":
      case "Testing in Non-Prod":
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

  const filteredTickets = mockTickets.filter((ticket) => {
    if (deadlineFilter && ticket.prodDeadline !== deadlineFilter) {
      return false;
    }
    if (riskFilter !== "all" && ticket.riskLevel !== riskFilter) {
      return false;
    }
    if (statusFilter === "non-prod" && ticket.status !== "Testing in Non-Prod") {
      return false;
    }
    if (statusFilter !== "all" && statusFilter !== "non-prod" && ticket.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Release Management
          <Badge variant="secondary">{filteredTickets.length} tickets</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">PROD Deadline</label>
                <Input
                  type="date"
                  value={deadlineFilter}
                  onChange={(e) => setDeadlineFilter(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="High">High Risk Only</SelectItem>
                    <SelectItem value="Medium">Medium Risk</SelectItem>
                    <SelectItem value="Low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="non-prod">Testing in Non-Prod</SelectItem>
                    <SelectItem value="Ready for Release">Ready for Release</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {filteredTickets.map((ticket) => (
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
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">Assignee: {ticket.assignee}</span>
                  <span className="text-muted-foreground">PROD Deadline: {ticket.prodDeadline}</span>
                </div>
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