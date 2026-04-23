"use client";

import React, { useState, useCallback } from 'react';
import Header from '@/components/shared/Header';
import MapComponent from '@/components/map/Map';
import FloatingPanel from '@/components/map/FloatingPanel';
import FloatingActionButton from '@/components/map/FloatingActionButton';
import { LocationMap } from '@/components/ui/expand-map';
import Globe from '@/components/ui/globe';

interface Barrier {
  id: string;
  title: string;
  severity: 'Severe' | 'Moderate' | 'Minor';
  category: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
}

export default function MapPage() {
  const [selectedBarrier, setSelectedBarrier] = useState<Barrier | null>(null);

  const handleSelectBarrier = useCallback((barrier: Barrier | null) => {
    setSelectedBarrier(barrier);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-white">
      <Header />

      {/* Map legend */}
      <div className="flex items-center gap-4 px-4 py-1.5 bg-zinc-800 border-b border-zinc-700 text-xs text-zinc-400 flex-shrink-0">
        <span className="font-medium text-white">Legend:</span>
        {[
          { label: 'Severe', color: 'bg-red-500' },
          { label: 'Moderate', color: 'bg-amber-500' },
          { label: 'Minor', color: 'bg-green-500' },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            {label}
          </span>
        ))}
        <span className="ml-auto text-xs">Click a marker to see details</span>
      </div>

      {/* Full-viewport map */}
      <div className="relative flex-grow">
        <MapComponent onSelectBarrier={handleSelectBarrier} />
        <FloatingPanel
          selectedBarrier={selectedBarrier}
          onClose={() => setSelectedBarrier(null)}
        />
        <FloatingActionButton />
        <div className="absolute bottom-10 left-10">
          <LocationMap />
        </div>
        <div className="absolute top-10 right-10">
          <Globe />
        </div>
      </div>
    </div>
  );
}
