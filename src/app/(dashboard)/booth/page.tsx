"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Map, MapPin, Navigation, Clock } from "lucide-react";
import { VoiceInput } from "@/components/dashboard/VoiceInput";

export default function BoothLocator() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Polling Booth Locator</h1>
          <p className="text-muted-foreground mt-1">Find your assigned voting location</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input placeholder="Enter Zip or Address..." className="w-full md:w-64 bg-input/50" />
          <Button variant="secondary"><MapPin className="h-4 w-4" /></Button>
          <VoiceInput placeholder="Find nearest booth" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Map Placeholder */}
        <Card className="lg:col-span-2 bg-muted/10 border-border overflow-hidden relative flex flex-col items-center justify-center min-h-[400px]">
          <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/shapes/svg?seed=map&backgroundColor=111322')] opacity-10 bg-cover bg-center mix-blend-overlay" />
          <Map className="h-16 w-16 text-primary mb-4 relative z-10" />
          <p className="text-lg font-medium relative z-10">Interactive Map Component</p>
          <p className="text-sm text-muted-foreground relative z-10">Powered by Google Maps Civic API</p>
        </Card>

        {/* Results List */}
        <div className="space-y-4 overflow-y-auto">
          <Card className="bg-card/80 border-primary shadow-[0_0_15px_rgba(33,197,93,0.1)]">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">Central High School Gym</h3>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">0.8 mi</span>
              </div>
              <p className="text-sm text-muted-foreground">123 Main St, Cityville</p>
              
              <div className="flex items-center gap-2 text-sm mt-4">
                <Clock className="h-4 w-4 text-accent" />
                <span>Wait time: <strong className="text-accent">~15 mins</strong></span>
              </div>

              <div className="pt-4 flex gap-2">
                <Button className="flex-1 text-xs h-9 shadow-lg shadow-primary/20"><Navigation className="h-3 w-3 mr-2"/> Navigate</Button>
                <Button variant="outline" className="flex-1 text-xs h-9">Details</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">Cityville Public Library</h3>
                <span className="text-xs bg-secondary/50 px-2 py-1 rounded-full font-bold text-muted-foreground">2.1 mi</span>
              </div>
              <p className="text-sm text-muted-foreground">456 Library Rd, Cityville</p>
              
              <div className="flex items-center gap-2 text-sm text-destructive mt-4">
                <Clock className="h-4 w-4" />
                <span>Wait time: <strong>~45 mins</strong> (Heavy)</span>
              </div>

              <div className="pt-4 flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs h-9"><Navigation className="h-3 w-3 mr-2"/> Navigate</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
