"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useJourneyStore } from "@/store/journeyStore";
import { useEffect, useState } from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationsPanel() {
  const currentStep = useJourneyStore(state => state.currentStep);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const notifs: NotificationItem[] = [];
    
    // Base notification
    notifs.push({ id: 'n-welcome', title: "Welcome to VoteFlow", message: "Your civic journey starts now.", time: "System", read: true });

    if (currentStep !== 'onboarding') {
      notifs.unshift({ id: 'n-elig', title: "Eligibility Confirmed", message: "You meet the basic requirements to vote.", time: "Recent", read: currentStep !== 'eligibility' });
    }
    
    if (currentStep === 'registration' || currentStep === 'prep' || currentStep === 'voting_day' || currentStep === 'post_vote') {
      notifs.unshift({ id: 'n-reg', title: "Registration Task", message: "Ensure your voter registration is up to date.", time: "Recent", read: currentStep !== 'registration' });
    }

    if (currentStep === 'prep' || currentStep === 'voting_day' || currentStep === 'post_vote') {
      notifs.unshift({ id: 'n-doc', title: "Documents Verified", message: "Your voting documents are ready.", time: "Recent", read: currentStep !== 'prep' });
    }

    if (currentStep === 'voting_day') {
      notifs.unshift({ id: 'n-vote', title: "Election Day Approaches", message: "Review the polling process.", time: "Just now", read: false });
    }

    if (currentStep === 'post_vote') {
      notifs.unshift({ id: 'n-post', title: "Voting Completed", message: "Thank you for participating in democracy.", time: "Just now", read: false });
    }

    setNotifications(notifs);
  }, [currentStep]);

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
              <div key={n.id} className="flex gap-4 items-start relative p-2 rounded-md hover:bg-background/50 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
                {!n.read && <div className="absolute -left-1 top-4 h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />}
                <div className="flex-1 space-y-1">
                  <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono">{n.time}</p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="space-y-4 w-full">
                <div className="h-12 bg-muted/50 rounded-md animate-pulse w-full"></div>
                <div className="h-12 bg-muted/50 rounded-md animate-pulse w-full"></div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
