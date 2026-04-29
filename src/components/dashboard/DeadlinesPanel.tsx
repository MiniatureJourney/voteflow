"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";
import { useState, useEffect } from "react";
import { getRealtimeDeadlines } from "@/app/dashboard/onboarding/actions";

interface DeadlinesPanelProps {
  defaultZip?: string;
}

interface Reminder {
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  daysRemaining: number;
}

export function DeadlinesPanel({ defaultZip = "10001" }: DeadlinesPanelProps) {
  const [data, setData] = useState<{ hasElections: boolean; reminders: Reminder[]; nextElectionYear: number | null; noElectionMessage?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      setLoading(true);
      try {
        const res = await getRealtimeDeadlines(defaultZip);
        setData(res);
      } catch (e) {
        setData({ hasElections: false, reminders: [], nextElectionYear: null, noElectionMessage: "Unable to load deadlines." });
      } finally {
        setLoading(false);
      }
    };
    fetchDeadlines();
  }, [defaultZip]);

  return (
    <Card className="col-span-1 border-border bg-card/50 backdrop-blur-sm shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-accent" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>Critical dates for {defaultZip}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-10 rounded bg-muted animate-pulse" />
              <div className="h-10 rounded bg-muted animate-pulse" />
            </div>
          ) : data?.hasElections ? (
            data.reminders.length > 0 ? (
              data.reminders.map((reminder, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{reminder.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {reminder.daysRemaining === 0 ? "Today" : reminder.daysRemaining < 0 ? `${Math.abs(reminder.daysRemaining)} days ago` : `in ${reminder.daysRemaining} days`}
                    </p>
                  </div>
                  <Badge variant={reminder.type === 'CRITICAL' ? 'destructive' : reminder.type === 'WARNING' ? 'secondary' : 'outline'}
                    className={reminder.type === 'CRITICAL' ? 'bg-destructive/20 text-destructive border-destructive/50' : ''}>
                    {reminder.type}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines found.</p>
            )
          ) : (
            <div className="text-center space-y-2 py-4 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm text-muted-foreground">{data?.noElectionMessage || "No upcoming elections."}</p>
              {data?.nextElectionYear && (
                <p className="text-sm font-semibold">Next expected election: {data.nextElectionYear}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
