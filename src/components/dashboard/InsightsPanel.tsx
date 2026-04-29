import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { CivicInsightsEngine } from "@/lib/engines/CivicInsightsEngine";

export async function InsightsPanel() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let zipCode = "10001";
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('zip_code')
      .eq('id', user.id)
      .single();
      
    if (profile?.zip_code) {
      zipCode = profile.zip_code;
    }
  }

  const insights = await CivicInsightsEngine.getInsightsForRegion(zipCode);

  return (
    <Card className="col-span-1 border-border bg-gradient-to-br from-card to-accent/5 backdrop-blur-sm shadow-xl shadow-black/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          AI Insights
        </CardTitle>
        <CardDescription>Hyperlocal election info ({zipCode})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-3 bg-background/50 rounded-lg border border-border">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
                <MapPin className="h-3 w-3 text-primary" /> Local Insight
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
