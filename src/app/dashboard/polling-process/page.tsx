"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJourneyStore } from "@/store/journeyStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PollingProcessPage() {
  const setJourneyStep = useJourneyStore((state) => state.setStep);
  const router = useRouter();
  
  // The user will provide the exact YouTube link later.
  // For now, this is a placeholder or can be updated easily.
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/w3NgV8f3rKM");

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">The Polling Process</h1>
          <p className="text-muted-foreground mt-2">Watch this comprehensive guide from start to finish</p>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur border-border overflow-hidden shadow-xl shadow-black/20">
        <CardContent className="p-0">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="Polling Process Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t border-border mt-4">
        <Button onClick={() => router.push('/dashboard')} variant="outline">Back to Dashboard</Button>
        <Button 
          onClick={() => {
            setJourneyStep('post_vote');
            router.push('/dashboard');
          }} 
          className="shadow-lg shadow-primary/20 font-semibold"
        >
          Mark as Completed
        </Button>
      </div>
    </div>
  );
}
