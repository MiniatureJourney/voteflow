import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, MapPin } from "lucide-react";

export function InsightsPanel() {
  return (
    <Card className="col-span-1 border-border bg-gradient-to-br from-card to-accent/5 backdrop-blur-sm shadow-xl shadow-black/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          AI Insights
        </CardTitle>
        <CardDescription>Hyperlocal election info for you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-background/50 rounded-lg border border-border">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
              <MapPin className="h-3 w-3 text-primary" /> State Prop 14
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on your location, this proposition aims to fund new public school infrastructure. 
              It is the most hotly debated topic in your district right now.
            </p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg border border-border">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
              <Sparkles className="h-3 w-3 text-primary" /> Voter Turnout
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your district typically sees a 45% turnout in midterms. Try voting before 10 AM to avoid long lines!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
