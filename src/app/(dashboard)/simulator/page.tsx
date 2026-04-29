"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ShieldCheck, Trophy, HelpCircle } from "lucide-react";
import { VoiceInput } from "@/components/dashboard/VoiceInput";

export default function ElectionSimulator() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const scenarioSteps = [
    {
      title: "Step 1: Arriving at the Booth",
      text: "You arrive at the polling station. A volunteer asks for your identification.",
      question: "What should you hand them?",
      options: [
        { text: "My library card", correct: false },
        { text: "My verified State ID or approved document", correct: true },
        { text: "Nothing, they should know me", correct: false }
      ]
    },
    {
      title: "Step 2: Receiving Your Ballot",
      text: "The volunteer verifies your ID and hands you a paper ballot and a privacy sleeve.",
      question: "Where should you go next?",
      options: [
        { text: "Fill it out at the volunteer's desk", correct: false },
        { text: "Walk to an open privacy booth", correct: true }
      ]
    },
    {
      title: "Step 3: Casting the Vote",
      text: "You've marked your choices. You approach the digital scanner.",
      question: "How do you cast it?",
      options: [
        { text: "Feed it face down into the scanner to protect privacy", correct: true },
        { text: "Hand it to a random person", correct: false }
      ]
    }
  ];

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(score + 100);
    setStep(step + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Election Simulator</h1>
          <p className="text-muted-foreground mt-2">Practice voting safely and earn civic badges.</p>
        </div>
        <div className="flex gap-2 items-center bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
          <Trophy className="text-primary h-5 w-5" />
          <span className="font-bold text-lg">{score} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {step < scenarioSteps.length ? (
            <Card className="bg-card/50 backdrop-blur border-primary/50 shadow-xl shadow-primary/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-primary/5 p-4 border-b border-border flex justify-between items-center">
                <span className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Interactive Scenario</span>
                <span className="text-sm font-mono">{step + 1} / {scenarioSteps.length}</span>
              </div>
              <CardContent className="pt-8 space-y-6">
                <h2 className="text-2xl font-bold">{scenarioSteps[step].title}</h2>
                <p className="text-lg text-muted-foreground">{scenarioSteps[step].text}</p>
                
                <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <HelpCircle className="h-5 w-5 text-accent" />
                    {scenarioSteps[step].question}
                  </h3>
                  <div className="space-y-3">
                    {scenarioSteps[step].options.map((opt, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        className="w-full justify-start h-auto py-3 text-left hover:border-primary hover:bg-primary/5 transition-all"
                        onClick={() => handleAnswer(opt.correct)}
                      >
                        {opt.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 backdrop-blur border-primary shadow-xl shadow-primary/20 text-center py-12 animate-in zoom-in duration-500">
              <CardContent className="space-y-4">
                <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary shadow-[0_0_40px_rgba(33,197,93,0.3)]">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold text-primary">Simulation Complete!</h2>
                <p className="text-muted-foreground">You are now fully prepared for Election Day.</p>
                <div className="pt-6">
                  <Button onClick={() => { setStep(0); setScore(0); }} className="shadow-lg shadow-primary/20">Restart Simulation</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-lg">Gamification Badges</CardTitle>
              <CardDescription>Your civic achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border opacity-50 grayscale">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-bold text-sm">Registered Voter</h4>
                  <p className="text-xs text-muted-foreground">Verify your registration.</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${score >= 300 ? 'bg-primary/10 border-primary/50 opacity-100 scale-105' : 'bg-background/50 border-border opacity-50 grayscale'}`}>
                <Sparkles className="h-8 w-8 text-accent" />
                <div>
                  <h4 className="font-bold text-sm">Simulation Expert</h4>
                  <p className="text-xs text-muted-foreground">Complete the AI Simulator perfectly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <VoiceInput placeholder="Ask the AI a question..." />
        </div>
      </div>
    </div>
  );
}
