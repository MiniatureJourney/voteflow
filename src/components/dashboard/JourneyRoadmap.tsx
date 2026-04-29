"use client";

import { useJourneyStore } from "@/store/journeyStore";
import { JourneyStateMachine, JourneyState } from "@/lib/engines/JourneyStateMachine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const steps: { id: JourneyState; label: string }[] = [
  { id: 'NOT_REGISTERED', label: 'Check Eligibility' },
  { id: 'REGISTER', label: 'Register to Vote' },
  { id: 'VERIFY', label: 'Verify Documents' },
  { id: 'READY', label: 'Ready to Vote' },
  { id: 'VOTED', label: 'Voted!' }
];

export function JourneyRoadmap() {
  const currentStep = useJourneyStore(state => state.currentStep) as string;
  const router = useRouter();
  
  const engineState: JourneyState = currentStep === 'onboarding' ? 'NOT_REGISTERED' :
    currentStep === 'eligibility' ? 'REGISTER' :
    currentStep === 'registration' ? 'VERIFY' : 'READY';

  const action = JourneyStateMachine.getNextAction(engineState);
  
  const currentIndex = steps.findIndex(s => s.id === engineState);
  const progressValue = action.percentage;

  return (
    <Card className="col-span-1 md:col-span-2 border-border bg-card/50 backdrop-blur-sm relative overflow-hidden shadow-xl shadow-black/20">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-xl">Your Election Journey</CardTitle>
        <CardDescription>Track your progress towards election day</CardDescription>
        <Progress value={progressValue} className="h-2 mt-4 bg-background" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mt-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 w-1/5">
                {isCompleted ? (
                  <CheckCircle2 className="text-primary h-8 w-8 mb-2 drop-shadow-[0_0_8px_rgba(33,197,93,0.8)] transition-all" />
                ) : isCurrent ? (
                  <div className="h-8 w-8 rounded-full border-2 border-primary flex items-center justify-center mb-2 animate-pulse bg-primary/20">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                ) : (
                  <Circle className="text-muted-foreground h-8 w-8 mb-2" />
                )}
                <span className={`text-xs text-center font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'} hidden md:block`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-10 p-4 border border-primary/20 rounded-lg bg-primary/5 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground">Next Action Required</h4>
            <p className="text-sm text-muted-foreground">{action.label}</p>
          </div>
          <Button onClick={() => router.push(action.href)} className="shadow-lg shadow-primary/20 group">
            Start <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
