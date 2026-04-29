"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { VoiceInput } from "@/components/dashboard/VoiceInput";
import { CheckCircle2, XCircle } from "lucide-react";
import { EligibilityEngine } from "@/lib/engines/EligibilityEngine";

export default function EligibilityChecker() {
  const [result, setResult] = useState<{ eligible: boolean; reasons: string[] } | null>(null);

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const dob = formData.get("dob") as string;
    
    // Using mock CA rule for UI demo
    const res = EligibilityEngine.evaluate(
      { dob, citizenship: true }, 
      { region_code: 'US-CA', min_age: 18, requires_photo_id: false, allows_mail_in: true },
      "2026-11-03"
    );
    setResult(res);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Check Eligibility</h1>
      
      <Card className="bg-card/50 backdrop-blur border-border shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle>Verify Your Voting Status</CardTitle>
          <CardDescription>Enter your details to instantly check your eligibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={checkEligibility} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input name="dob" id="dob" type="date" required className="bg-input/50" />
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-border mt-6">
              <Button type="submit" className="shadow-lg shadow-primary/20">Check Status</Button>
              <VoiceInput placeholder="Say 'Check my eligibility for California'" />
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className={`border-2 ${result.eligible ? 'border-primary' : 'border-destructive'} bg-card/80 animate-in fade-in slide-in-from-bottom-4`}>
          <CardContent className="pt-6 flex items-start gap-4">
            {result.eligible ? <CheckCircle2 className="h-8 w-8 text-primary shrink-0" /> : <XCircle className="h-8 w-8 text-destructive shrink-0" />}
            <div>
              <h3 className="text-lg font-bold">{result.eligible ? "You are eligible to vote!" : "Action Required"}</h3>
              {result.reasons.length > 0 && (
                <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
                  {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
