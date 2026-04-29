import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotificationsPanel() {
  const notifications = [
    { id: 1, title: "Registration Confirmed", message: "Your voter registration was verified by the state.", time: "2 hours ago", read: false },
    { id: 2, title: "New Document Requirement", message: "Check the new ID requirements for Texas.", time: "1 day ago", read: true },
    { id: 3, title: "Welcome to VoteFlow", message: "Your civic journey starts now.", time: "2 days ago", read: true },
  ];

  return (
    <Card className="col-span-1 xl:col-span-1 border-border bg-card/50 backdrop-blur-sm shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] pr-4">
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-4 items-start relative p-2 rounded-md hover:bg-background/50 transition-colors">
                {!n.read && <div className="absolute -left-1 top-4 h-2 w-2 rounded-full bg-primary" />}
                <div className="flex-1 space-y-1">
                  <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
