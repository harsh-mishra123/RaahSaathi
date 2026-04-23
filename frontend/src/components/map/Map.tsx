"use client";

import React, { useState } from 'react';

interface Barrier {
  id: string;
  lat: number;
  lng: number;
  title: string;
  severity: 'Severe' | 'Moderate' | 'Minor';
  category: string;
  description: string;
  location: string;
}

const mockBarriers: Barrier[] = [
  { id: '1', lat: 12.9716, lng: 77.5946, title: 'Broken Pavement - MG Road', severity: 'Severe', category: 'Broken Pavement', description: 'Large crack spanning entire footpath, 30cm wide.', location: 'MG Road, Bangalore' },
  { id: '2', lat: 12.9654, lng: 77.5978, title: 'Scaffolding Blocking Path', severity: 'Severe', category: 'Construction', description: 'Construction scaffolding blocks entire sidewalk.', location: 'Brigade Road, Bangalore' },
  { id: '3', lat: 12.9784, lng: 77.6408, title: 'Missing Curb Cut', severity: 'Moderate', category: 'Missing Ramp', description: 'No curb cut at intersection.', location: 'Indiranagar, Bangalore' },
  { id: '4', lat: 12.9352, lng: 77.6245, title: 'Uneven Market Tiles', severity: 'Moderate', category: 'Uneven Surface', description: 'Market area tiles severely uneven.', location: 'Koramangala, Bangalore' },
  { id: '5', lat: 12.9121, lng: 77.6446, title: 'Worn Tactile Paving', severity: 'Minor', category: 'Tactile Paving', description: 'Tactile guiding strip near bus stop worn out.', location: 'HSR Layout, Bangalore' },
  { id: '6', lat: 12.9698, lng: 77.7499, title: 'Steep Driveway Ramp', severity: 'Moderate', category: 'Steep Ramp', description: 'Driveway cuts footpath at steep angle.', location: 'Whitefield, Bangalore' },
];

interface MapComponentProps {
  onSelectBarrier: (barrier: Barrier | null) => void;
}

const MapComponent = ({ onSelectBarrier }: MapComponentProps) => {
  // We calculate pseudo-positions for markers based on lat/lng range 
  // to spread them over the static map image.
  const minLat = 12.9000;
  const maxLat = 13.0000;
  const minLng = 77.5500;
  const maxLng = 77.7800;

  const getPosition = (lat: number, lng: number) => {
    const top = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    const left = ((lng - minLng) / (maxLng - minLng)) * 100;
    return { top: `${Math.max(10, Math.min(90, top))}%`, left: `${Math.max(10, Math.min(90, left))}%` };
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-secondary">
      <img 
        src="/map_background.png" 
        alt="Map background" 
        className="absolute inset-0 w-full h-full object-cover"
        onClick={() => onSelectBarrier(null)}
      />
      
      {/* Markers */}
      {mockBarriers.map((barrier) => {
        const { top, left } = getPosition(barrier.lat, barrier.lng);
        const bgColors = {
          'Severe': 'bg-red-500',
          'Moderate': 'bg-amber-500',
          'Minor': 'bg-green-500'
        };
        const bgColor = bgColors[barrier.severity] || 'bg-blue-500';
        
        return (
          <div
            key={barrier.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectBarrier(barrier);
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-10"
            style={{ top, left }}
            aria-label={`${barrier.severity} barrier: ${barrier.title}`}
            role="button"
            tabIndex={0}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${bgColor}`} />
            <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${bgColor}`} />
          </div>
        );
      })}
    </div>
  );
};

export default MapComponent;