"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileCheck2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useJourneyStore } from "@/store/journeyStore";
import { useRouter } from "next/navigation";

export default function DocumentUpload() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const setJourneyStep = useJourneyStore((state) => state.setStep);
  const router = useRouter();

  const handleUpload = () => {
    setStatus('scanning');
    toast.info("OCR Engine analyzing document...");
    setTimeout(() => {
      setStatus('success');
      setJourneyStep('voting_day');
      toast.success("Document verified: Valid State ID");
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Verification</h1>
        <p className="text-muted-foreground mt-2">Upload your required identification securely.</p>
      </div>

      <Card className="bg-card/50 backdrop-blur border-border border-dashed border-2 shadow-xl shadow-black/20">
        <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-6">
          {status === 'idle' && (
            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                <UploadCloud className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Tap to upload State ID</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2">
                Our secure system will automatically scan and verify your document locally. Images are never stored on our servers.
              </p>
              <Button onClick={handleUpload} size="lg" className="mt-8 shadow-lg shadow-primary/20">
                Choose File
              </Button>
            </div>
          )}

          {status === 'scanning' && (
            <div className="space-y-6 animate-pulse flex flex-col items-center">
              <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center border-4 border-primary border-t-transparent animate-spin" />
              <h3 className="text-2xl font-semibold">Scanning with OCR Engine...</h3>
            </div>
          )}

          {status === 'success' && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 flex flex-col items-center">
              <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center text-primary shadow-[0_0_40px_rgba(33,197,93,0.3)] mb-6">
                <FileCheck2 className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-semibold text-primary">Verification Complete</h3>
              <p className="text-sm text-muted-foreground mt-2">ID confirmed. You are ready to vote!</p>
              <Button onClick={() => router.push('/dashboard')} size="lg" className="mt-6 shadow-lg shadow-primary/20 font-semibold">
                Return to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
