import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0D17] text-foreground flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-3xl text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs tracking-widest uppercase mx-auto">
          <Sparkles className="h-4 w-4" /> Empowering Voters with AI
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
          VoteFlow Civic Platform
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          The complete, production-ready platform helping you navigate registration, polling locations, and interactive civic education safely.
        </p>

        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row pt-4">
          <Link 
            href="/login" 
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "font-semibold text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 group")}
          >
            Launch Dashboard
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            href="/register" 
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "font-semibold text-base px-8 py-6 rounded-xl border-border bg-card/50 backdrop-blur hover:bg-card")}
          >
            Create Voter Profile
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-center text-xs text-muted-foreground font-mono uppercase tracking-wider z-10">
        Secure • Accessible • Extensible
      </footer>
    </div>
  );
}
