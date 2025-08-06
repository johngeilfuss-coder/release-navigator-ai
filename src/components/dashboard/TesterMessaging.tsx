
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, User, TestTube, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketTester {
  ticketId: string;
  title: string;
  assignee: string;
  email: string;
  slack: string;
  repository: string;
  priority: string;
  neededInProdDate?: string;
}

interface TesterMessagingProps {
  isOpen: boolean;
  onClose: () => void;
  incompleteTickets: TicketTester[];
}

export function TesterMessaging({ isOpen, onClose, incompleteTickets }: TesterMessagingProps) {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTicketToggle = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === incompleteTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(incompleteTickets.map(t => t.ticketId));
    }
  };

  const handleSendMessages = async () => {
    if (selectedTickets.length === 0) {
      toast({
        title: "No Tickets Selected",
        description: "Please select at least one ticket to send messages about",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Missing Message",
        description: "Please add a message to send to the testers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Group tickets by tester
      const ticketsByTester = selectedTickets.reduce((acc, ticketId) => {
        const ticket = incompleteTickets.find(t => t.ticketId === ticketId);
        if (ticket) {
          const key = ticket.assignee;
          if (!acc[key]) {
            acc[key] = {
              tester: ticket,
              tickets: []
            };
          }
          acc[key].tickets.push(ticket);
        }
        return acc;
      }, {} as Record<string, { tester: TicketTester; tickets: TicketTester[] }>);

      // Send messages to each tester
      for (const [testerName, { tester, tickets }] of Object.entries(ticketsByTester)) {
        const ticketList = tickets.map(t => `• ${t.ticketId}: ${t.title}`).join('\n');
        
        const payload = {
          text: `🧪 Testing Reminder`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Hi ${tester.slack}!*\n\nYou have tickets that still need non-prod testing completion:`
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Tickets requiring testing:*\n${ticketList}`
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Message from Release Manager:*\n${message}`
              }
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `Sent from Release Dashboard • ${new Date().toLocaleString()}`
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
      }

      toast({
        title: "Messages Sent",
        description: `Testing reminders sent to ${Object.keys(ticketsByTester).length} tester(s) about ${selectedTickets.length} ticket(s)`,
      });

      onClose();
      setSelectedTickets([]);
      setMessage("");
    } catch (error) {
      console.error("Error sending Slack messages:", error);
      toast({
        title: "Error",
        description: "Failed to send Slack messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Message Ticket Testers</span>
          </DialogTitle>
          <DialogDescription>
            Send reminders to testers about tickets that still need non-prod testing completion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TestTube className="h-4 w-4 text-warning" />
              <span className="font-medium">
                {incompleteTickets.length} tickets need testing completion
              </span>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Tickets to Message About</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedTickets.length === incompleteTickets.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {incompleteTickets.map((ticket) => (
                <div 
                  key={ticket.ticketId} 
                  className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                    selectedTickets.includes(ticket.ticketId) ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => handleTicketToggle(ticket.ticketId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={selectedTickets.includes(ticket.ticketId)}
                        onChange={() => handleTicketToggle(ticket.ticketId)}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{ticket.ticketId}</span>
                          <Badge variant="outline" className="text-xs">{ticket.repository}</Badge>
                          {ticket.neededInProdDate && (
                            <Badge variant="destructive" className="text-xs">
                              Due: {ticket.neededInProdDate}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{ticket.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {ticket.assignee} ({ticket.slack})
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={ticket.priority === "Critical" ? "destructive" : 
                                  ticket.priority === "High" ? "default" : "secondary"}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedTickets.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message to Testers</Label>
            <Textarea
              placeholder="Please complete non-prod testing for the selected tickets as they are needed for the upcoming release..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          {/* Slack Webhook */}
          <div className="space-y-2">
            <Label>Slack Webhook URL (Optional)</Label>
            <Input
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Enter your Slack webhook URL to actually send the messages. Leave empty for demo mode.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendMessages} disabled={isLoading}>
            {isLoading ? "Sending..." : `Send Messages (${selectedTickets.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
