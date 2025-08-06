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
  Package,
  Check
} from "lucide-react";

const mockRepositories = [
  {
    name: "frontend-app",
    parentTicket: { id: "EPIC-001", title: "Q1 Frontend Improvements", status: "prod3", priority: "high" },
    childTickets: [
      { id: "JIRA-123", title: "Update user dashboard" },
      { id: "JIRA-124", title: "Fix login bug" },
      { id: "JIRA-129", title: "Improve navigation" }
    ]
  },
  {
    name: "backend-api",
    parentTicket: { id: "EPIC-002", title: "API Enhancement Release", status: "release_accepted", priority: "medium" },
    childTickets: [
      { id: "JIRA-125", title: "Add new endpoints" },
      { id: "JIRA-126", title: "Database migration" },
      { id: "JIRA-130", title: "Performance optimization" }
    ]
  },
  {
    name: "mobile-app",
    parentTicket: { id: "EPIC-003", title: "Mobile App Feature Pack", status: "pending", priority: "low" },
    childTickets: [
      { id: "JIRA-127", title: "Push notifications" },
      { id: "JIRA-128", title: "UI improvements" },
      { id: "JIRA-131", title: "Offline support" }
    ]
  }
];

const statusConfig = {
  pending: { label: "Pending Release", color: "bg-gray-500", icon: Clock },
  release_accepted: { label: "Release Accepted", color: "bg-blue-500", icon: Check },
  prod2: { label: "In Prod 2", color: "bg-yellow-500", icon: Clock },
  prod3: { label: "In Prod 3", color: "bg-orange-500", icon: Clock },
  verified: { label: "Verified", color: "bg-green-500", icon: CheckCircle }
};

export function ReleaseWorkflow() {
  const { toast } = useToast();

  const handleAcceptRelease = (repoName: string, parentTicketId: string) => {
    toast({
      title: "Release Accepted",
      description: `Created release branch for ${parentTicketId} in ${repoName}`,
    });
  };

  const handleSendToProd2 = (repoName: string, parentTicketId: string) => {
    toast({
      title: "Sent to Prod 2",
      description: `${parentTicketId} sent to demo and prod2 in ${repoName}`,
    });
  };

  const handleSendToProd3 = (parentTicketId: string) => {
    toast({
      title: "Sent to Prod 3",
      description: `${parentTicketId} sent to prod3`,
    });
  };

  const handleVerifyRelease = (parentTicketId: string) => {
    toast({
      title: "Release Verified",
      description: `${parentTicketId} has been verified and completed`,
    });
  };

  const handleRevert = (parentTicketId: string) => {
    toast({
      title: "Release Reverted",
      description: `${parentTicketId} has been reverted`,
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
                {repo.childTickets.length} child ticket{repo.childTickets.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Parent Ticket */}
              <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="default" 
                      className="font-mono text-xs"
                    >
                      {repo.parentTicket.id}
                    </Badge>
                    <span className="font-semibold">{repo.parentTicket.title}</span>
                    <Badge variant="outline" className="text-xs">Parent Ticket</Badge>
                  </div>
                  <Badge 
                    variant={repo.parentTicket.priority === "critical" ? "destructive" : 
                            repo.parentTicket.priority === "high" ? "default" : "secondary"}
                  >
                    {repo.parentTicket.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = statusConfig[repo.parentTicket.status as keyof typeof statusConfig].icon;
                      return <StatusIcon className="h-4 w-4" />;
                    })()}
                    <span 
                      className={`px-2 py-1 rounded-full text-xs text-white ${statusConfig[repo.parentTicket.status as keyof typeof statusConfig].color}`}
                    >
                      {statusConfig[repo.parentTicket.status as keyof typeof statusConfig].label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {repo.parentTicket.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRelease(repo.name, repo.parentTicket.id)}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Accept Release
                      </Button>
                    )}

                    {repo.parentTicket.status === "release_accepted" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevert(repo.parentTicket.id)}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Revert
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendToProd2(repo.name, repo.parentTicket.id)}
                          className="flex items-center gap-1"
                        >
                          <Package className="h-3 w-3" />
                          Send to Prod 2
                        </Button>
                      </>
                    )}
                    
                    {repo.parentTicket.status === "prod2" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevert(repo.parentTicket.id)}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Revert
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendToProd3(repo.parentTicket.id)}
                          className="flex items-center gap-1"
                        >
                          <ArrowRight className="h-3 w-3" />
                          Send to Prod 3
                        </Button>
                      </>
                    )}

                    {repo.parentTicket.status === "prod3" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevert(repo.parentTicket.id)}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Revert
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleVerifyRelease(repo.parentTicket.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Verify Release
                        </Button>
                      </>
                    )}
                    
                    {repo.parentTicket.status === "verified" && (
                      <Badge variant="secondary" className="text-green-700">
                        Release Complete
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Child Tickets */}
                <div className="mt-4 pl-4 border-l-2 border-muted">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Child Tickets:</h4>
                  <div className="space-y-2">
                    {repo.childTickets.map((childTicket) => (
                      <div key={childTicket.id} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs font-mono">
                          {childTicket.id}
                        </Badge>
                        <span className="text-muted-foreground">{childTicket.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}