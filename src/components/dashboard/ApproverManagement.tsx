
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, Settings, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Approver {
  id: string;
  name: string;
  role: "Approver" | "Release Manager";
  email: string;
  slack: string;
}

const mockAvailableUsers = [
  { id: "1", name: "Sarah Connor", email: "sarah.connor@company.com", slack: "@sarah.connor" },
  { id: "2", name: "John Smith", email: "john.smith@company.com", slack: "@john.smith" },
  { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com", slack: "@mike.johnson" },
  { id: "4", name: "Lisa Chen", email: "lisa.chen@company.com", slack: "@lisa.chen" },
  { id: "5", name: "Tom Wilson", email: "tom.wilson@company.com", slack: "@tom.wilson" },
  { id: "6", name: "Anna Davis", email: "anna.davis@company.com", slack: "@anna.davis" }
];

const mockApprovers: Approver[] = [
  { id: "1", name: "Sarah Connor", role: "Approver", email: "sarah.connor@company.com", slack: "@sarah.connor" },
  { id: "2", name: "John Smith", role: "Release Manager", email: "john.smith@company.com", slack: "@john.smith" },
  { id: "4", name: "Lisa Chen", role: "Release Manager", email: "lisa.chen@company.com", slack: "@lisa.chen" },
  { id: "3", name: "Mike Johnson", role: "Approver", email: "mike.johnson@company.com", slack: "@mike.johnson" }
];

interface ApproverManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApproverManagement({ isOpen, onClose }: ApproverManagementProps) {
  const [approvers, setApprovers] = useState<Approver[]>(mockApprovers);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<"Approver" | "Release Manager">("Approver");
  const { toast } = useToast();

  const handleAddApprover = () => {
    if (!selectedUser) {
      toast({
        title: "Missing Selection",
        description: "Please select a user to add as approver",
        variant: "destructive",
      });
      return;
    }

    const user = mockAvailableUsers.find(u => u.id === selectedUser);
    if (!user) return;

    // Check if user is already assigned
    if (approvers.find(a => a.id === user.id)) {
      toast({
        title: "User Already Assigned",
        description: `${user.name} is already assigned as an approver`,
        variant: "destructive",
      });
      return;
    }

    const newApprover: Approver = {
      id: user.id,
      name: user.name,
      role: selectedRole,
      email: user.email,
      slack: user.slack
    };

    setApprovers([...approvers, newApprover]);
    setSelectedUser("");
    
    toast({
      title: "Approver Added",
      description: `${user.name} has been assigned as ${selectedRole}`,
    });
  };

  const handleRemoveApprover = (approverId: string) => {
    const approver = approvers.find(a => a.id === approverId);
    setApprovers(approvers.filter(a => a.id !== approverId));
    
    toast({
      title: "Approver Removed",
      description: `${approver?.name} has been removed from approvers`,
    });
  };

  const handleRoleChange = (approverId: string, newRole: "Approver" | "Release Manager") => {
    setApprovers(approvers.map(a => 
      a.id === approverId ? { ...a, role: newRole } : a
    ));
    
    const approver = approvers.find(a => a.id === approverId);
    toast({
      title: "Role Updated",
      description: `${approver?.name} is now assigned as ${newRole}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Manage Approvers & Release Managers</span>
          </DialogTitle>
          <DialogDescription>
            Assign team members as approvers and release managers for the release process.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Approver */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Add New Approver</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAvailableUsers
                      .filter(user => !approvers.find(a => a.id === user.id))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{user.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
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
            <Button onClick={handleAddApprover} className="w-full">
              Add Approver
            </Button>
          </div>

          {/* Current Approvers */}
          <div className="space-y-4">
            <h4 className="font-medium">Current Approvers ({approvers.length})</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {approvers.map((approver) => (
                <div key={approver.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{approver.name}</p>
                      <p className="text-sm text-muted-foreground">{approver.slack}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={approver.role} 
                      onValueChange={(value: "Approver" | "Release Manager") => handleRoleChange(approver.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Approver">Approver</SelectItem>
                        <SelectItem value="Release Manager">Release Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveApprover(approver.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
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
