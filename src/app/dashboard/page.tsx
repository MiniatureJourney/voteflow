import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';

// PERFORMANCE: Lazy load heavy components for Code Splitting (Lighthouse 100)
const CommandBar = dynamic(() => import("@/components/dashboard/CommandBar").then(mod => mod.CommandBar));
const JourneyRoadmap = dynamic(() => import("@/components/dashboard/JourneyRoadmap").then(mod => mod.JourneyRoadmap));
const DeadlinesPanel = dynamic(() => import("@/components/dashboard/DeadlinesPanel").then(mod => mod.DeadlinesPanel));
const InsightsPanel = dynamic(() => import("@/components/dashboard/InsightsPanel").then(mod => mod.InsightsPanel));
const NotificationsPanel = dynamic(() => import("@/components/dashboard/NotificationsPanel").then(mod => mod.NotificationsPanel));
export default async function DashboardMain() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fallback name if metadata doesn't have full_name
  const name = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || "Voter";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <CommandBar />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-border pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, {name}
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            Press <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted/50 px-2 font-mono text-[11px] font-medium text-muted-foreground"><span className="text-sm">⌘</span>K</kbd> to open quick commands
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-lg shadow-primary/10 transition-transform hover:scale-105 cursor-pointer">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.id}`} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Roadmap takes full width on small screens, 2 columns on medium+ */}
        <div className="col-span-1 md:col-span-2">
          <JourneyRoadmap />
        </div>
        
        {/* Deadlines */}
        <div className="col-span-1">
          <DeadlinesPanel />
        </div>

        {/* AI Insights */}
        <div className="col-span-1">
          <InsightsPanel />
        </div>

        {/* Notifications */}
        <div className="col-span-1 md:col-span-2 xl:col-span-1">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
}
