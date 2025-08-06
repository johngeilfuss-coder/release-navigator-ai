import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle, CheckCircle, Clock, Calendar, TestTube, Rocket, GitBranch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done" | "Ready for Release";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignee: string;
  jiraLink: string;
  riskLevel: "Low" | "Medium" | "High";
  summary: string;
  neededInProdDate?: string;
  nonProdTestingComplete: boolean;
  repository: string;
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
    neededInProdDate: "2024-01-15",
    nonProdTestingComplete: true,
    repository: "auth-service"
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
    neededInProdDate: "2024-01-12",
    nonProdTestingComplete: true,
    repository: "payment-gateway"
  },
  {
    id: "PROJ-1236",
    title: "Add new reporting dashboard",
    status: "In Progress",
    priority: "Medium",
    assignee: "Mike Johnson",
    jiraLink: "https://jira.company.com/PROJ-1236",
    riskLevel: "Low",
    summary: "New analytics dashboard for business metrics. Low risk - new feature, no existing functionality affected.",
    nonProdTestingComplete: false,
    repository: "ui-app"
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
    neededInProdDate: "2024-01-18",
    nonProdTestingComplete: false,
    repository: "user-service"
  },
  {
    id: "PROJ-1238",
    title: "Critical security patch for API",
    status: "In Progress",
    priority: "Critical",
    assignee: "Tom Wilson",
    jiraLink: "https://jira.company.com/PROJ-1238",
    riskLevel: "High",
    summary: "Emergency security fix for API vulnerability. High risk due to critical system changes.",
    neededInProdDate: "2024-01-10",
    nonProdTestingComplete: false,
    repository: "api-gateway"
  },
  {
    id: "PROJ-1239",
    title: "Performance optimization for search",
    status: "To Do",
    priority: "High",
    assignee: "Emma Davis",
    jiraLink: "https://jira.company.com/PROJ-1239",
    riskLevel: "High",
    summary: "Database query optimization for search functionality. High risk due to database performance changes.",
    neededInProdDate: "2024-01-20",
    nonProdTestingComplete: false,
    repository: "search-service"
  },
  {
    id: "PROJ-1240",
    title: "Update UI components library",
    status: "Ready for Release",
    priority: "Low",
    assignee: "Alex Johnson",
    jiraLink: "https://jira.company.com/PROJ-1240",
    riskLevel: "Low",
    summary: "Minor UI component updates and bug fixes.",
    nonProdTestingComplete: true,
    repository: "ui-app"
  },
  {
    id: "PROJ-1241",
    title: "Payment service refactoring",
    status: "Ready for Release",
    priority: "Medium",
    assignee: "Sarah Smith",
    jiraLink: "https://jira.company.com/PROJ-1241",
    riskLevel: "Medium",
    summary: "Code refactoring for better maintainability.",
    nonProdTestingComplete: true,
    repository: "payment-gateway"
  }
];

export function ReleaseManagement() {
  const { toast } = useToast();
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

  // Filter logic for priority tickets
  const priorityTickets = mockTickets.filter(ticket => 
    ticket.neededInProdDate || 
    !ticket.nonProdTestingComplete || 
    ticket.riskLevel === "High"
  );

  const ticketsWithProdDate = mockTickets.filter(ticket => ticket.neededInProdDate);
  const incompleteTestingTickets = mockTickets.filter(ticket => !ticket.nonProdTestingComplete);
  const highRiskTickets = mockTickets.filter(ticket => ticket.riskLevel === "High");
  
  // Group tickets by repository
  const ticketsByRepo = mockTickets.reduce((acc, ticket) => {
    if (!acc[ticket.repository]) {
      acc[ticket.repository] = [];
    }
    acc[ticket.repository].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);

  const readyForReleaseTickets = mockTickets.filter(ticket => ticket.status === "Ready for Release");

  const handleRelease = () => {
    toast({
      title: "Release Initiated",
      description: `Starting release process for ${readyForReleaseTickets.length} tickets across ${Object.keys(ticketsByRepo).length} repositories.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Priority Tickets Section */}
      <Card className="border-warning/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-warning">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Priority Tickets</span>
            </div>
            <Badge variant="destructive">{priorityTickets.length} tickets</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-destructive/20">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Needed in PROD</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-destructive">{ticketsWithProdDate.length}</div>
                <p className="text-xs text-muted-foreground">tickets with deadlines</p>
              </CardContent>
            </Card>
            
            <Card className="border-warning/20">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <TestTube className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Testing Incomplete</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-warning">{incompleteTestingTickets.length}</div>
                <p className="text-xs text-muted-foreground">non-prod testing pending</p>
              </CardContent>
            </Card>
            
            <Card className="border-destructive/20">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">High Risk</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-destructive">{highRiskTickets.length}</div>
                <p className="text-xs text-muted-foreground">high risk changes</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {priorityTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
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
                  <div className="flex items-center space-x-4">
                    {ticket.neededInProdDate && (
                      <div className="flex items-center space-x-1 text-destructive">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">PROD: {ticket.neededInProdDate}</span>
                      </div>
                    )}
                    {!ticket.nonProdTestingComplete && (
                      <div className="flex items-center space-x-1 text-warning">
                        <TestTube className="h-3 w-3" />
                        <span className="text-xs">Testing pending</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(ticket.riskLevel)}
                      <span className="text-muted-foreground">Risk: {ticket.riskLevel}</span>
                    </div>
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

      {/* Release Control Section */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span>Release Control</span>
            </div>
            <Button onClick={handleRelease} className="bg-primary hover:bg-primary/90">
              <Rocket className="h-4 w-4 mr-2" />
              Initiate Release ({readyForReleaseTickets.length} tickets)
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Ready</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-success">{readyForReleaseTickets.length}</div>
                <p className="text-xs text-muted-foreground">tickets ready for release</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium">Repositories</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-info">{Object.keys(ticketsByRepo).length}</div>
                <p className="text-xs text-muted-foreground">repositories affected</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">High Risk</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-warning">{readyForReleaseTickets.filter(t => t.riskLevel === "High").length}</div>
                <p className="text-xs text-muted-foreground">high risk tickets ready</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Tickets by Repository */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Tickets by Repository
            <Badge variant="secondary">{mockTickets.length} total tickets</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(ticketsByRepo).map(([repo, tickets]) => (
              <div key={repo} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{repo}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{tickets.length} tickets</Badge>
                    <Badge variant="secondary">
                      {tickets.filter(t => t.status === "Ready for Release").length} ready
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-3 space-y-2 bg-muted/20">
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
                        <div className="flex items-center space-x-4">
                          {ticket.neededInProdDate && (
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">PROD: {ticket.neededInProdDate}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <TestTube className={`h-3 w-3 ${ticket.nonProdTestingComplete ? 'text-success' : 'text-warning'}`} />
                            <span className="text-xs text-muted-foreground">
                              Testing: {ticket.nonProdTestingComplete ? 'Complete' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getRiskIcon(ticket.riskLevel)}
                            <span className="text-muted-foreground">Risk: {ticket.riskLevel}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-2 rounded-md">
                        <p className="text-sm">{ticket.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}