"use client";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function VoiceInput({ placeholder = "Tap to speak..." }: { placeholder?: string }) {
  const [isListening, setIsListening] = useState(false);

  const toggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info("Listening...", { description: placeholder });
      // Mock finishing after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        toast.success("Voice input captured!");
      }, 3000);
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "secondary"}
      className={`rounded-full h-10 px-4 md:px-6 flex items-center gap-2 transition-all duration-300 ${isListening ? 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}
      onClick={toggleListen}
      aria-label="Voice Input"
    >
      <Mic className={isListening ? "animate-bounce" : ""} size={16} />
      <span className="hidden md:inline">{isListening ? "Listening..." : "Use Voice"}</span>
    </Button>
  );
}
