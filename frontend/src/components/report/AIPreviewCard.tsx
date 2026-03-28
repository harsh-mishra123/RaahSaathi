"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, Edit, Sparkles, AlertTriangle } from 'lucide-react';

interface AIPreviewCardProps {
  imageFile: File | null;
  onConfirm: (data: { type: string; severity: string }) => void;
  onEdit: () => void;
}

export const AIPreviewCard = ({ imageFile, onConfirm, onEdit }: AIPreviewCardProps) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ type: string; severity: string; confidence: number } | null>(null);

  // Simulate AI analysis
  useEffect(() => {
    if (!imageFile) return;
    setLoading(true);
    setResult(null);
    const timer = setTimeout(() => {
      setLoading(false);
      setResult({ type: 'Broken Pavement', severity: 'Moderate', confidence: 87 });
    }, 2000);
    return () => clearTimeout(timer);
  }, [imageFile]);

  if (!imageFile) return null;

  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-card mt-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-accent/5 border-b border-accent/20">
        <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
        <span className="text-sm font-semibold text-accent">AI Analysis</span>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              Analyzing your photo…
            </div>
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        ) : result ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/60">
                <p className="text-xs text-muted-foreground mb-1">Detected Type</p>
                <p className="text-sm font-semibold text-foreground">{result.type}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/60">
                <p className="text-xs text-muted-foreground mb-1">Suggested Severity</p>
                <p className="text-sm font-semibold text-amber-600">{result.severity}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              AI Confidence: <span className="font-semibold text-foreground">{result.confidence}%</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onConfirm({ type: result.type, severity: result.severity })}
                className="flex-grow flex items-center justify-center gap-1.5 py-2.5 rounded-lg gradient-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Suggestions
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AIPreviewCard;
