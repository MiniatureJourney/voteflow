"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, MapPin, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getRealtimeInsights } from "@/app/dashboard/onboarding/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InsightsPanelProps {
  defaultZip?: string;
}

// Simple in-memory cache to prevent redundant Gemini API calls
const insightsCache: Record<string, string[]> = {};

export function InsightsPanel({ defaultZip = "10001" }: InsightsPanelProps) {
  const [query, setQuery] = useState(defaultZip);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    
    if (insightsCache[normalizedQuery]) {
      setInsights(insightsCache[normalizedQuery]);
      return;
    }

    setLoading(true);
    try {
      const res = await getRealtimeInsights(searchQuery);
      insightsCache[normalizedQuery] = res;
      setInsights(res);
    } catch {
      setInsights(["Unable to fetch AI insights at this time."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(defaultZip);
  }, [defaultZip]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchInsights(query);
    }
  };

  return (
    <Card className="col-span-1 border-border bg-gradient-to-br from-card to-accent/5 backdrop-blur-sm shadow-xl shadow-black/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          Hyperlocal AI Insights
        </CardTitle>
        <CardDescription>Search any location globally for active elections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Enter Zip, City, or Constituency (e.g., Kolkata North)" 
            className="bg-input/50 focus-visible:ring-primary/50 transition-shadow"
          />
          <Button type="submit" disabled={loading} size="icon" className="shrink-0 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-3 mt-2 max-h-[300px] overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-primary/30 animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <div className="h-2 w-full bg-muted/60 rounded animate-pulse" />
                    <div className="h-2 w-5/6 bg-muted/60 rounded animate-pulse" />
                    <div className="h-2 w-4/6 bg-muted/60 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : insights.map((insight, index) => (
            <div key={index} className="p-3 bg-background/50 rounded-lg border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-xs font-semibold flex items-center gap-2 mb-1 text-primary/80">
                <MapPin className="h-3 w-3" /> AI Grounding Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          ))}

          {!loading && insights.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No data returned.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
