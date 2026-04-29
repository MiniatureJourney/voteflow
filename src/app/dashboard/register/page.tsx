"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { VoiceInput } from "@/components/dashboard/VoiceInput";

import { useJourneyStore } from "@/store/journeyStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function RegistrationGuidance() {
  const setJourneyStep = useJourneyStore((state) => state.setStep);
  const setRegistrationState = useJourneyStore((state) => state.setRegistration);
  const router = useRouter();
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voter Registration</h1>
          <p className="text-muted-foreground mt-2">Official guidance flow for your district</p>
        </div>
        <VoiceInput placeholder="Say 'Help me register to vote'" />
      </div>

      <Card className="bg-card/50 backdrop-blur border-border overflow-hidden shadow-xl shadow-black/20">
        <div className="bg-muted p-4 border-b border-border flex justify-between items-center">
          <span className="text-sm font-medium">Step 2 of 4: Address Verification</span>
          <Progress value={50} className="w-1/3" />
        </div>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-2">
            <Label>Street Address</Label>
            <Input placeholder="123 Main St" className="bg-input/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input placeholder="Cityville" className="bg-input/50" />
            </div>
            <div className="space-y-2">
              <Label>Zip Code</Label>
              <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="10001" className="bg-input/50" />
            </div>
          </div>
          <div className="flex justify-between pt-6 border-t border-border mt-4">
            <Button onClick={() => router.push('/dashboard/eligibility')} variant="outline">Back</Button>
            <Button 
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const supabase = createClient();
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user && zipCode) {
                    await supabase.from('profiles').upsert({ id: user.id, zip_code: zipCode });
                  }
                  setRegistrationState(true);
                  setJourneyStep('prep');
                  toast.success("Address registered successfully!");
                  router.push('/dashboard/documents');
                } catch {
                  toast.error("Failed to save profile data.");
                } finally {
                  setLoading(false);
                }
              }} 
              className="shadow-lg shadow-primary/20 font-semibold"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
