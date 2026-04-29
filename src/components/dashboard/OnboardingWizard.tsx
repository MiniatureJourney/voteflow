"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitOnboarding } from "@/app/dashboard/onboarding/actions";
import { useJourneyStore } from "@/store/journeyStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const schema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  citizenship: z.enum(["yes", "no"]),
  zip_code: z.string().min(5, "Valid Zip Code is required"),
  language: z.string(),
});

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setJourneyStep = useJourneyStore((state) => state.setStep);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { citizenship: "yes", language: "en" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const formattedData = {
        ...data,
        citizenship: data.citizenship === "yes",
      };
      
      const res = await submitOnboarding(formattedData);
      
      if (res.success) {
        toast.success("Profile Setup Complete!");
        setJourneyStep("eligibility");
        router.push("/dashboard");
      }
    } catch {
      toast.error("An error occurred during setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-primary font-bold text-2xl">Voter Profile Setup</CardTitle>
        <CardDescription>Step {step} of 4</CardDescription>
        <Progress value={(step / 4) * 100} className="mt-4" />
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {step === 1 && (
            <div className="space-y-3">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input type="date" id="dob" {...form.register("dob")} className="bg-input/50" />
              {form.formState.errors.dob && <p className="text-destructive text-sm">{form.formState.errors.dob.message}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>Are you a US Citizen?</Label>
              <RadioGroup
                defaultValue="yes"
                onValueChange={(val) => form.setValue("citizenship", val as "yes" | "no")}
              >
                <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-input/20">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="cursor-pointer flex-1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-input/20">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="cursor-pointer flex-1">No</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label htmlFor="zip_code">Zip Code (Location)</Label>
              <Input type="text" id="zip_code" placeholder="10001" {...form.register("zip_code")} className="bg-input/50" />
              <p className="text-xs text-muted-foreground">Used for automatic Constituency Mapping.</p>
              {form.formState.errors.zip_code && <p className="text-destructive text-sm">{form.formState.errors.zip_code.message}</p>}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label>Preferred Language</Label>
              <RadioGroup
                defaultValue="en"
                onValueChange={(val) => form.setValue("language", val)}
              >
                <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-input/20">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en" className="cursor-pointer flex-1">English</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-input/20">
                  <RadioGroupItem value="es" id="es" />
                  <Label htmlFor="es" className="cursor-pointer flex-1">Spanish</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-border">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : <div></div>}
            {step === 4 ? (
              <Button type="submit" disabled={loading} className="font-semibold shadow-lg shadow-primary/20">
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={async () => {
                  let isValid = false;
                  if (step === 1) isValid = await form.trigger("dob");
                  if (step === 2) isValid = await form.trigger("citizenship");
                  if (step === 3) isValid = await form.trigger("zip_code");
                  if (isValid) setStep(step + 1);
                }} 
                className="font-semibold shadow-lg shadow-primary/20"
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
