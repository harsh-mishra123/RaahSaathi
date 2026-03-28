"use client";
import React, { useState } from 'react';
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapComponent as Map } from '@/components/map/Map';
import { ArrowRight, MapPin, Zap } from 'lucide-react';

export default function RoutePlannerPage() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [route, setRoute] = useState(null);

  const handlePlanRoute = () => {
    // Placeholder for route planning logic
    console.log("Planning route from", start, "to", end);
    // In a real app, you would call a routing service here
    // and then set the route state to display it on the map.
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
      <Header />
      <main className="flex-grow">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(124,58,237,0.2),rgba(255,255,255,0))]"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-purple-400/30 bg-purple-500/10 text-sm text-purple-300">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Accessible Routing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Plan Your Accessible Journey
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-400">
              Enter your start and end points to generate a route that avoids reported barriers and prioritizes accessibility.
            </p>

            <div className="mt-10 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input 
                    type="text" 
                    placeholder="Starting point" 
                    className="pl-10 bg-zinc-800 border-zinc-700 focus:ring-purple-500"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input 
                    type="text" 
                    placeholder="Destination" 
                    className="pl-10 bg-zinc-800 border-zinc-700 focus:ring-purple-500"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              </div>
              <Button size="lg" className="mt-4 w-full sm:w-auto group bg-purple-600 hover:bg-purple-700" onClick={handlePlanRoute}>
                Generate Route
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="aspect-[16/9] w-full bg-zinc-800/50 rounded-2xl border border-zinc-700 flex items-center justify-center">
            <Map onSelectBarrier={() => {}} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
