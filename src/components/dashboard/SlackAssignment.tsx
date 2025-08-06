import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User, Hash } from "lucide-react";
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

const mockChannels = [
  { id: "1", name: "engineering", channel: "#engineering" },
  { id: "2", name: "qa-testing", channel: "#qa-testing" },
  { id: "3", name: "release-alerts", channel: "#release-alerts" },
  { id: "4", name: "dev-ops", channel: "#dev-ops" },
  { id: "5", name: "frontend-team", channel: "#frontend-team" },
  { id: "6", name: "backend-team", channel: "#backend-team" }
];

export function SlackAssignment({ isOpen, onClose, title, description, type }: SlackAssignmentProps) {
  const [assignmentType, setAssignmentType] = useState<"user" | "channel">("user");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [message, setMessage] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAssign = async () => {
    const isUserAssignment = assignmentType === "user";
    const selectedTarget = isUserAssignment ? selectedUser : selectedChannel;
    
    if (!selectedTarget || !message) {
      toast({
        title: "Missing Information",
        description: `Please select a ${isUserAssignment ? "user" : "channel"} and add a message`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const target = isUserAssignment 
        ? mockUsers.find(u => u.id === selectedUser)
        : mockChannels.find(c => c.id === selectedChannel);
      
      const targetName = isUserAssignment 
        ? (target as typeof mockUsers[0])?.slack
        : (target as typeof mockChannels[0])?.channel;

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
              text: `*${isUserAssignment ? "Assigned to" : "Sent to"}:* ${targetName}\n*Message:* ${message}`
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

      const targetDisplayName = isUserAssignment 
        ? (target as typeof mockUsers[0])?.name
        : (target as typeof mockChannels[0])?.name;

      toast({
        title: "Assignment Sent",
        description: `${type === "test" ? "Test" : "Alert"} sent to ${targetDisplayName} via Slack`,
      });

      onClose();
      setSelectedUser("");
      setSelectedChannel("");
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

          <Tabs value={assignmentType} onValueChange={(value) => setAssignmentType(value as "user" | "channel")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Team Member</span>
              </TabsTrigger>
              <TabsTrigger value="channel" className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Channel</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="space-y-2">
              <Label htmlFor="user">Select Team Member</Label>
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
            </TabsContent>
            
            <TabsContent value="channel" className="space-y-2">
              <Label htmlFor="channel">Select Channel</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Slack channel" />
                </SelectTrigger>
                <SelectContent>
                  {mockChannels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4" />
                        <span>{channel.name} ({channel.channel})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
          </Tabs>

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