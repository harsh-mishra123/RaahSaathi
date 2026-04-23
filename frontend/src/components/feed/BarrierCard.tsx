"use client";

import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { XCard } from "@/components/ui/x-gradient-card";
import Link from "next/link";
import { Flag, MessageCircle, Share2, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

export interface BarrierData {
  id: string;
  title: string;
  username: string;
  created_at: string; // Changed from timeAgo
  severity: 'Severe' | 'Moderate' | 'Minor';
  category: string;
  location: string;
  description: string;
  upvotes: number;
  downvotes: number;
  comment_count: number; // Changed from commentCount
  image_url?: string; // Changed from imageUrl
}

const BarrierCard = ({ barrier }: { barrier: BarrierData }) => {
  const [votes, setVotes] = useState({ up: barrier.upvotes, down: barrier.downvotes });
  const [voteType, setVoteType] = useState<'up' | 'down' | null>(null);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    const voteValue = type === 'upvote' ? 1 : -1;
    
    // API call
    try {
      const response = await fetch(`http://localhost:8000/api/v1/barriers/${barrier.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: voteValue }),
      });

      if (!response.ok) throw new Error('Vote failed');
      
      const updatedBarrier = await response.json();
      
      // Update state from server response
      setVotes({ up: updatedBarrier.upvotes, down: updatedBarrier.downvotes });
      // You might want to manage the `voteType` state based on user's vote history from backend
      
    } catch (error) {
      console.error("Failed to vote", error);
      // Optionally revert optimistic update on failure
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const xCardData = {
    authorName: barrier.username,
    authorHandle: barrier.username,
    authorImage: barrier.image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: [barrier.title, barrier.description],
    timestamp: timeAgo(barrier.created_at),
    isVerified: true,
  };

  const severityConfig = {
    Severe: { bg: 'bg-red-500/10 text-red-400', dot: 'bg-red-500' },
    Moderate: { bg: 'bg-yellow-500/10 text-yellow-400', dot: 'bg-yellow-500' },
    Minor: { bg: 'bg-green-500/10 text-green-400', dot: 'bg-green-500' },
  };

  const cfg = severityConfig[barrier.severity];

  return (
    <article className="group relative flex flex-col sm:flex-row items-start gap-4 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 transition-all hover:bg-zinc-800">
      {/* Voting Section */}
      <div className="flex-shrink-0 flex sm:flex-col items-center gap-1">
        <button 
          onClick={() => handleVote('upvote')}
          className={`p-1.5 rounded-full hover:bg-zinc-700 ${voteType === 'up' ? 'text-green-500' : 'text-zinc-400'}`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm text-white">{votes.up - votes.down}</span>
        <button 
          onClick={() => handleVote('downvote')}
          className={`p-1.5 rounded-full hover:bg-zinc-700 ${voteType === 'down' ? 'text-red-500' : 'text-zinc-400'}`}
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <Link href={`/barrier/${barrier.id}`}>
          <h2 className="text-base font-semibold text-white leading-snug group-hover:text-violet-400 transition-colors line-clamp-2">
            {barrier.title}
          </h2>
        </Link>

        {/* Tags */}
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
            {barrier.severity}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-400 bg-zinc-700 px-2 py-0.5 rounded-full">
            <Flag className="w-3 h-3" aria-hidden="true" />
            {barrier.category}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {barrier.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3">
          <Link
            href={`/barrier/${barrier.id}#comments`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 px-2.5 py-1.5 rounded-md hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {barrier.comment_count} Comments
          </Link>
          <button
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 px-2.5 py-1.5 rounded-md hover:bg-zinc-700 hover:text-white transition-colors"
            onClick={() => navigator.clipboard?.writeText(window.location.origin + `/barrier/${barrier.id}`)}
          >
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            Share
          </button>
        </div>
      </div>

      {/* Thumbnail (if image) */}
      {barrier.image_url && (
        <div className="hidden sm:flex items-center pr-4">
          <div className="w-24 h-20 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
            <img
              src={barrier.image_url}
              alt={barrier.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default BarrierCard;