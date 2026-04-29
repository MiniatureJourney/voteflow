import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome to VoteFlow</h1>
          <p className="text-muted-foreground mt-2">Let's personalize your election journey.</p>
        </div>
        <OnboardingWizard />
      </div>
    </div>
  );
}
