import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";
import { DeadlineEngine, ElectionDeadlines } from "@/lib/engines/DeadlineEngine";

export function DeadlinesPanel() {
  const mockDeadlines: ElectionDeadlines = {
    election_date: "2026-11-03",
    voter_reg_deadline: "2026-10-19",
    mail_in_request_deadline: "2026-10-27",
    mail_in_return_deadline: "2026-11-03"
  };

  const reminders = DeadlineEngine.generateReminders(mockDeadlines);

  return (
    <Card className="col-span-1 border-border bg-card/50 backdrop-blur-sm shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-accent" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>Critical dates for your region</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder, idx) => (
            <div key={idx} className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{reminder.message}</p>
                <p className="text-xs text-muted-foreground">in {reminder.daysRemaining} days</p>
              </div>
              <Badge variant={reminder.type === 'CRITICAL' ? 'destructive' : reminder.type === 'WARNING' ? 'secondary' : 'outline'}
                className={reminder.type === 'CRITICAL' ? 'bg-destructive/20 text-destructive border-destructive/50' : ''}>
                {reminder.type}
              </Badge>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
