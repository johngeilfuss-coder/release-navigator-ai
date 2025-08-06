import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Settings, User } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Release Manager":
        return "default";
      case "Approver":
        return "secondary";
      case "View-Only":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RD</span>
            </div>
            <h1 className="text-xl font-bold">Release Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                {user.role}
              </Badge>
            </div>
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}