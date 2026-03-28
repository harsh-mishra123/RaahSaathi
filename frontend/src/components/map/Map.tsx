"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!MAPBOX_TOKEN || mapInstance.current || !mapContainer.current) return;

    const initMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;

        (mapboxgl as { accessToken: string }).accessToken = MAPBOX_TOKEN;

        const map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [77.5946, 12.9716],
          zoom: 12,
        });

        mapInstance.current = map;

        map.on('load', () => {
          setMapLoaded(true);
          map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
          map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), 'top-right');

          // Add custom markers
          mockBarriers.forEach((barrier) => {
            const el = document.createElement('div');
            el.className = `marker-${barrier.severity.toLowerCase()}`;
            el.setAttribute('aria-label', `${barrier.severity} barrier: ${barrier.title}`);
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');

            el.addEventListener('click', () => onSelectBarrier(barrier));
            el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') onSelectBarrier(barrier); });

            new mapboxgl.Marker({ element: el })
              .setLngLat([barrier.lng, barrier.lat])
              .addTo(map);
          });
        });

        map.on('click', () => onSelectBarrier(null));

      } catch {
        setMapError(true);
      }
    };

    initMap();
    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [onSelectBarrier]);

  if (!MAPBOX_TOKEN || mapError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-center p-8">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Map preview unavailable</p>
        <p className="text-xs text-muted-foreground mt-1">Add <code className="bg-secondary px-1 rounded">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to .env.local</p>
        <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-sm">
          {mockBarriers.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelectBarrier(b)}
              className="p-2 rounded-lg border border-border bg-white text-xs text-left hover:border-accent transition-colors shadow-card"
            >
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${b.severity === 'Severe' ? 'bg-red-500' : b.severity === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'}`} />
              {b.title.slice(0, 20)}…
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-full">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/70 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground">Loading map…</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { MapComponent };