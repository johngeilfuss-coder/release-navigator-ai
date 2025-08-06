import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SlackAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: "test" | "alert";
}

const mockUsers = [
  { id: "1", name: "John Doe", slack: "@john.doe" },
  { id: "2", name: "Sarah Smith", slack: "@sarah.smith" },
  { id: "3", name: "Mike Johnson", slack: "@mike.johnson" },
  { id: "4", name: "Lisa Chen", slack: "@lisa.chen" },
  { id: "5", name: "Tom Wilson", slack: "@tom.wilson" },
  { id: "6", name: "Emma Davis", slack: "@emma.davis" }
];

export function SlackAssignment({ isOpen, onClose, title, description, type }: SlackAssignmentProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAssign = async () => {
    if (!selectedUser || !message) {
      toast({
        title: "Missing Information",
        description: "Please select a user and add a message",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = mockUsers.find(u => u.id === selectedUser);
      const payload = {
        text: `🔔 New ${type === "test" ? "Test" : "Alert"} Assignment`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${title}*\n${description}`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Assigned to:* ${user?.slack}\n*Message:* ${message}`
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Assigned from Release Dashboard • ${new Date().toLocaleString()}`
              }
            ]
          }
        ]
      };

      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify(payload),
        });
      }

      toast({
        title: "Assignment Sent",
        description: `${type === "test" ? "Test" : "Alert"} assigned to ${user?.name} via Slack`,
      });

      onClose();
      setSelectedUser("");
      setMessage("");
    } catch (error) {
      console.error("Error sending Slack message:", error);
      toast({
        title: "Error",
        description: "Failed to send Slack message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Assign {type === "test" ? "E2E Test" : "Alert"} via Slack</span>
          </DialogTitle>
          <DialogDescription>
            Assign this {type === "test" ? "test failure" : "alert"} to a team member and send them a Slack notification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">Assign to</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team member" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.name} ({user.slack})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Add any additional context or instructions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook">Slack Webhook URL (Optional)</Label>
            <Input
              id="webhook"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Enter your Slack webhook URL to actually send the message. Leave empty for demo mode.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isLoading}>
            {isLoading ? "Sending..." : "Assign & Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}