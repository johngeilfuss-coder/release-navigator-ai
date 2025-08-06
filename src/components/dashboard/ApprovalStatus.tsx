
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, User, Settings, Users } from "lucide-react";
import { ApproverManagement } from "./ApproverManagement";
import { TicketApproverAssignment } from "./TicketApproverAssignment";

interface TicketAssignment {
  approverId: string;
  role: "Approver" | "Release Manager";
}

interface Approval {
  id: string;
  releaseName: string;
  requiredApprovals: string[];
  currentApprovals: { role: string; approver: string; status: "approved" | "pending" | "rejected"; timestamp?: string }[];
  status: "pending" | "approved" | "rejected";
  approverAssignments: TicketAssignment[];
}

const mockApprovals: Approval[] = [
  {
    id: "REL-2024-001",
    releaseName: "Authentication Service v2.1.0",
    requiredApprovals: ["Approver", "Release Manager"],
    currentApprovals: [
      { role: "Approver", approver: "Sarah Connor", status: "approved", timestamp: "2024-01-08 14:30" },
      { role: "Release Manager", approver: "John Smith", status: "pending" }
    ],
    status: "pending",
    approverAssignments: [
      { approverId: "1", role: "Approver" },
      { approverId: "2", role: "Release Manager" }
    ]
  },
  {
    id: "REL-2024-002",
    releaseName: "Payment Gateway Hotfix v1.2.3",
    requiredApprovals: ["Approver", "Release Manager"],
    currentApprovals: [
      { role: "Approver", approver: "Mike Johnson", status: "approved", timestamp: "2024-01-08 16:15" },
      { role: "Release Manager", approver: "Lisa Chen", status: "approved", timestamp: "2024-01-08 16:45" }
    ],
    status: "approved",
    approverAssignments: [
      { approverId: "3", role: "Approver" },
      { approverId: "4", role: "Release Manager" }
    ]
  },
  {
    id: "REL-2024-003",
    releaseName: "Database Migration v3.0.0",
    requiredApprovals: ["Approver", "Release Manager"],
    currentApprovals: [
      { role: "Approver", approver: "Tom Wilson", status: "rejected", timestamp: "2024-01-08 12:00" },
      { role: "Release Manager", approver: "Anna Davis", status: "pending" }
    ],
    status: "rejected",
    approverAssignments: [
      { approverId: "5", role: "Approver" }
    ]
  }
];

export function ApprovalStatus() {
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [approverAssignmentTicket, setApproverAssignmentTicket] = useState<string | null>(null);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default" as const;
      case "rejected":
        return "destructive" as const;
      case "pending":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const handleApproverAssignmentsChange = (ticketId: string, assignments: TicketAssignment[]) => {
    setApprovals(prevApprovals => 
      prevApprovals.map(approval => 
        approval.id === ticketId 
          ? { ...approval, approverAssignments: assignments }
          : approval
      )
    );
  };

  const getAssignedTicket = () => approvals.find(a => a.id === approverAssignmentTicket);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Approval Status
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{approvals.length} releases</Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsManagementOpen(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Manage Approvers
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{approval.id}</h4>
                  <p className="text-sm text-muted-foreground">{approval.releaseName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(approval.status)}>
                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setApproverAssignmentTicket(approval.id)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                {approval.currentApprovals.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.role}</span>
                      <span className="text-sm text-muted-foreground">({item.approver})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.timestamp && (
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      )}
                      {getStatusIcon(item.status)}
                    </div>
                  </div>
                ))}
              </div>

              {approval.approverAssignments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Assigned Approvers:</span>
                  <div className="flex space-x-1">
                    {approval.approverAssignments.map((assignment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {assignment.role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {approval.status === "pending" && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="default">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      <ApproverManagement 
        isOpen={isManagementOpen}
        onClose={() => setIsManagementOpen(false)}
      />

      {approverAssignmentTicket && (
        <TicketApproverAssignment
          isOpen={!!approverAssignmentTicket}
          onClose={() => setApproverAssignmentTicket(null)}
          ticketId={approverAssignmentTicket}
          ticketTitle={getAssignedTicket()?.releaseName || ""}
          currentAssignments={getAssignedTicket()?.approverAssignments || []}
          onAssignmentsChange={(assignments) => 
            handleApproverAssignmentsChange(approverAssignmentTicket, assignments)
          }
        />
      )}
    </Card>
  );
}
