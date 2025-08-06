
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Approver {
  id: string;
  name: string;
  role: "Approver" | "Release Manager";
  email: string;
  slack: string;
}

interface TicketAssignment {
  approverId: string;
  role: "Approver" | "Release Manager";
}

interface TicketApproverAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketTitle: string;
  currentAssignments: TicketAssignment[];
  onAssignmentsChange: (assignments: TicketAssignment[]) => void;
}

const mockAvailableApprovers: Approver[] = [
  { id: "1", name: "Sarah Connor", role: "Approver", email: "sarah.connor@company.com", slack: "@sarah.connor" },
  { id: "2", name: "John Smith", role: "Release Manager", email: "john.smith@company.com", slack: "@john.smith" },
  { id: "3", name: "Mike Johnson", role: "Approver", email: "mike.johnson@company.com", slack: "@mike.johnson" },
  { id: "4", name: "Lisa Chen", role: "Release Manager", email: "lisa.chen@company.com", slack: "@lisa.chen" },
  { id: "5", name: "Tom Wilson", role: "Approver", email: "tom.wilson@company.com", slack: "@tom.wilson" },
  { id: "6", name: "Anna Davis", role: "Release Manager", email: "anna.davis@company.com", slack: "@anna.davis" }
];

export function TicketApproverAssignment({ 
  isOpen, 
  onClose, 
  ticketId, 
  ticketTitle, 
  currentAssignments, 
  onAssignmentsChange 
}: TicketApproverAssignmentProps) {
  const [selectedApproverId, setSelectedApproverId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"Approver" | "Release Manager">("Approver");
  const { toast } = useToast();

  const handleAddAssignment = () => {
    if (!selectedApproverId) {
      toast({
        title: "Missing Selection",
        description: "Please select an approver to assign",
        variant: "destructive",
      });
      return;
    }

    // Check if approver is already assigned
    if (currentAssignments.find(a => a.approverId === selectedApproverId)) {
      toast({
        title: "Already Assigned",
        description: "This approver is already assigned to this ticket",
        variant: "destructive",
      });
      return;
    }

    const newAssignment: TicketAssignment = {
      approverId: selectedApproverId,
      role: selectedRole
    };

    const updatedAssignments = [...currentAssignments, newAssignment];
    onAssignmentsChange(updatedAssignments);
    setSelectedApproverId("");
    
    const approver = mockAvailableApprovers.find(a => a.id === selectedApproverId);
    toast({
      title: "Approver Assigned",
      description: `${approver?.name} assigned as ${selectedRole} for ${ticketId}`,
    });
  };

  const handleRemoveAssignment = (approverId: string) => {
    const updatedAssignments = currentAssignments.filter(a => a.approverId !== approverId);
    onAssignmentsChange(updatedAssignments);
    
    const approver = mockAvailableApprovers.find(a => a.id === approverId);
    toast({
      title: "Assignment Removed",
      description: `${approver?.name} removed from ${ticketId}`,
    });
  };

  const getApproverById = (id: string) => mockAvailableApprovers.find(a => a.id === id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Approvers</DialogTitle>
          <DialogDescription>
            Assign approvers and release managers for ticket {ticketId}: {ticketTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Assignment */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Add Assignment</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Approver</Label>
                <Select value={selectedApproverId} onValueChange={setSelectedApproverId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAvailableApprovers
                      .filter(approver => !currentAssignments.find(a => a.approverId === approver.id))
                      .map((approver) => (
                        <SelectItem key={approver.id} value={approver.id}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{approver.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {approver.role}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assignment Role</Label>
                <Select value={selectedRole} onValueChange={(value: "Approver" | "Release Manager") => setSelectedRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approver">Approver</SelectItem>
                    <SelectItem value="Release Manager">Release Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddAssignment} className="w-full">
              Add Assignment
            </Button>
          </div>

          {/* Current Assignments */}
          <div className="space-y-4">
            <h4 className="font-medium">Current Assignments ({currentAssignments.length})</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {currentAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No approvers assigned to this ticket
                </p>
              ) : (
                currentAssignments.map((assignment) => {
                  const approver = getApproverById(assignment.approverId);
                  return (
                    <div key={assignment.approverId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{approver?.name}</p>
                          <p className="text-sm text-muted-foreground">{approver?.slack}</p>
                        </div>
                        <Badge variant="secondary">
                          {assignment.role}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveAssignment(assignment.approverId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
