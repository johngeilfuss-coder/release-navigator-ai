import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  Play, 
  RotateCcw, 
  ArrowRight,
  GitBranch,
  Package
} from "lucide-react";

const mockRepositories = [
  {
    name: "frontend-app",
    tickets: [
      { id: "JIRA-123", title: "Update user dashboard", status: "prod2", priority: "high" },
      { id: "JIRA-124", title: "Fix login bug", status: "prod3", priority: "critical" }
    ]
  },
  {
    name: "backend-api",
    tickets: [
      { id: "JIRA-125", title: "Add new endpoints", status: "ready", priority: "medium" },
      { id: "JIRA-126", title: "Database migration", status: "prod2", priority: "high" }
    ]
  },
  {
    name: "mobile-app",
    tickets: [
      { id: "JIRA-127", title: "Push notifications", status: "complete", priority: "low" },
      { id: "JIRA-128", title: "UI improvements", status: "prod3", priority: "medium" }
    ]
  }
];

const statusConfig = {
  ready: { label: "Ready to Release", color: "bg-blue-500", icon: Play },
  prod2: { label: "Prod 2", color: "bg-yellow-500", icon: Clock },
  prod3: { label: "Prod 3", color: "bg-orange-500", icon: Clock },
  complete: { label: "Complete", color: "bg-green-500", icon: CheckCircle }
};

export function ReleaseWorkflow() {
  const { toast } = useToast();

  const handleRelease = (repoName: string, ticketId: string) => {
    toast({
      title: "Release Initiated",
      description: `Started release for ${ticketId} in ${repoName}`,
    });
  };

  const handleApprove = (ticketId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "prod2" ? "prod3" : "complete";
    toast({
      title: "Release Approved",
      description: `${ticketId} moved to ${statusConfig[nextStatus as keyof typeof statusConfig].label}`,
    });
  };

  const handleRevert = (ticketId: string) => {
    toast({
      title: "Release Reverted",
      description: `${ticketId} has been reverted`,
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {mockRepositories.map((repo) => (
        <Card key={repo.name}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {repo.name}
              <Badge variant="outline" className="ml-auto">
                {repo.tickets.length} ticket{repo.tickets.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repo.tickets.map((ticket) => {
                const StatusIcon = statusConfig[ticket.status as keyof typeof statusConfig].icon;
                return (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="secondary" 
                          className="font-mono text-xs"
                        >
                          {ticket.id}
                        </Badge>
                        <span className="font-medium">{ticket.title}</span>
                      </div>
                      <Badge 
                        variant={ticket.priority === "critical" ? "destructive" : 
                                ticket.priority === "high" ? "default" : "secondary"}
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span 
                          className={`px-2 py-1 rounded-full text-xs text-white ${statusConfig[ticket.status as keyof typeof statusConfig].color}`}
                        >
                          {statusConfig[ticket.status as keyof typeof statusConfig].label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {ticket.status === "ready" && (
                          <Button
                            size="sm"
                            onClick={() => handleRelease(repo.name, ticket.id)}
                            className="flex items-center gap-1"
                          >
                            <Package className="h-3 w-3" />
                            Release to Prod 2
                          </Button>
                        )}
                        
                        {(ticket.status === "prod2" || ticket.status === "prod3") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRevert(ticket.id)}
                              className="flex items-center gap-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Revert
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(ticket.id, ticket.status)}
                              className="flex items-center gap-1"
                            >
                              <ArrowRight className="h-3 w-3" />
                              {ticket.status === "prod2" ? "Approve to Prod 3" : "Mark Complete"}
                            </Button>
                          </>
                        )}
                        
                        {ticket.status === "complete" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevert(ticket.id)}
                            className="flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Revert
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}