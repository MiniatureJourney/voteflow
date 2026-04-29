"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, AlertTriangle, Radio } from "lucide-react";
import { CivicInsightsEngine } from "@/lib/engines/CivicInsightsEngine";

export default function CompanionMode() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [density, setDensity] = useState(CivicInsightsEngine.predictCrowdDensity(currentHour));

  // Simulate real-time updates feed
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this syncs with Supabase Realtime subscriptions
      const newHour = new Date().getHours();
      setCurrentHour(newHour);
      setDensity(CivicInsightsEngine.predictCrowdDensity(newHour));
    }, 60000);
    return () => clearInterval(interval);
  }, [currentHour]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-8">
      <div className="flex justify-between items-center bg-primary text-primary-foreground p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-background/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-2 font-mono">
            <Radio className="h-3 w-3 mr-2 animate-pulse" /> LIVE MODE
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Election Day Companion</h1>
          <p className="mt-1 opacity-90 text-sm">Real-time guidance for Central High School Gym.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Crowd Density Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
              <div>
                <p className="text-sm text-muted-foreground font-mono">Status (Hour: {currentHour}:00)</p>
                <h3 className={`text-2xl font-bold mt-1 ${density.level === 'CRITICAL' || density.level === 'HIGH' ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                  {density.level} CROWD
                </h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Est. Wait Time</p>
                <h3 className="text-2xl font-mono font-bold mt-1 flex items-center justify-end gap-1">
                  <Clock className="h-5 w-5" /> {density.waitTime}m
                </h3>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Behavior Nudge</p>
              {density.level === 'HIGH' || density.level === 'CRITICAL' ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3 items-start animate-in fade-in">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive-foreground leading-relaxed">
                    Lines are currently very long. If your schedule allows, we recommend returning between 2 PM and 4 PM for the shortest wait times.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex gap-3 items-start animate-in fade-in">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">
                    Right now is a great time to vote! Head over to the polling station to beat the evening rush.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary animate-pulse" />
              Real-time Updates Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative border-l-2 border-border ml-3 pl-6">
              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                <p className="text-sm font-bold">Line moving faster</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">The polling station just opened 2 additional privacy booths. Wait times have dropped by 10 mins.</p>
                <span className="text-[10px] text-muted-foreground/60 font-mono mt-1 block">Just now</span>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-secondary ring-4 ring-background" />
                <p className="text-sm font-bold">Parking Update</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">The main lot is full. Overflow parking is available at the church next door.</p>
                <span className="text-[10px] text-muted-foreground/60 font-mono mt-1 block">45 mins ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
