"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { X, MapPin, ArrowRight, Flag } from 'lucide-react';

interface Barrier {
  id: string;
  title: string;
  severity: 'Severe' | 'Moderate' | 'Minor';
  category: string;
  description: string;
  location: string;
}

const severityConfig = {
  Severe: { bg: 'bg-red-100 text-red-700', border: 'border-red-200' },
  Moderate: { bg: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  Minor: { bg: 'bg-green-100 text-green-700', border: 'border-green-200' },
};

interface FloatingPanelProps {
  selectedBarrier: Barrier | null;
  onClose: () => void;
}

const FloatingPanel = ({ selectedBarrier, onClose }: FloatingPanelProps) => {
  if (!selectedBarrier) {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md pointer-events-auto animate-slide-in-up">
        <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl border border-zinc-700 shadow-floating p-4 flex items-center gap-3">
          <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm text-zinc-400">
            Click on a <span className="font-semibold text-white">colored marker</span> to see barrier details
          </p>
        </div>
      </div>
    );
  }

  const cfg = severityConfig[selectedBarrier.severity];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md pointer-events-auto animate-slide-in-up">
      <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl border border-zinc-700 shadow-floating overflow-hidden">
        {/* Header stripe */}
        <div className={`px-4 py-2 flex items-center justify-between border-b ${cfg.border}`}>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg}`}>
            {selectedBarrier.severity}
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-700 transition-colors text-zinc-400"
            aria-label="Close panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm leading-snug">{selectedBarrier.title}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {selectedBarrier.location}
            </span>
            <span className="flex items-center gap-1">
              <Flag className="w-3 h-3" />
              {selectedBarrier.category}
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {selectedBarrier.description}
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href={`/barrier/${selectedBarrier.id}`}
              className="flex-grow flex items-center justify-center gap-1.5 py-2 rounded-lg gradient-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              View Full Report
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/report"
              className="px-3 py-2 rounded-lg border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              + Report Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;