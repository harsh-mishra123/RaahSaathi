"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ArrowUp, ArrowDown, MessageCircle, Share2, MapPin, Flag, ChevronRight, Home, Send, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

const barrier = {
  id: '1',
  title: 'Broken Pavement on MG Road Near Metro Station',
  username: 'priya_navigates',
  timeAgo: '2 hours ago',
  severity: 'Severe' as const,
  category: 'Broken Pavement',
  location: 'MG Road, Bangalore',
  description: `A large crack spans the entire footpath just outside the metro station exit on MG Road. The crack is approximately 30–35 cm wide and 10 cm deep at some points, making it completely impassable for wheelchair users and extremely hazardous for visually impaired individuals.

Two incidents of people tripping have been reported by local shopkeepers this week. The area is heavily trafficked during peak hours (8–10 AM and 5–8 PM). The BBMP maintenance team has reportedly been notified but no action has been taken in 3 weeks.

Suggested workaround: Use the parallel footpath on the opposite side of the road (requires crossing at the junction 150m north).`,
  votes: 47,
  commentCount: 3,
};

const severityConfig = {
  Severe: { bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  Moderate: { bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  Minor: { bg: 'bg-green-100 text-green-700', dot: 'bg-green-600' },
};

const mockComments = [
  { id: '1', username: 'accessibility_watch', time: '1 hour ago', text: 'Confirmed this is still there as of this morning. The crack has actually widened slightly after last night\'s rain.', votes: 14 },
  { id: '2', username: 'wheeltrails', time: '45 min ago', text: 'I use this route daily. This is a major problem. I\'ve had to detour via Residency Road adding 20 mins to my commute. Please fix ASAP!', votes: 22 },
  { id: '3', username: 'safe_steps_bng', time: '20 min ago', text: 'Submitted a BBMP complaint (ticket #BBK2024-3821). Let\'s upvote so this gets visibility.', votes: 8 },
];

export default function BarrierDetailPage({ params }: { params: { id: string } }) {
  const id = params.id as string;
  const [barrier, setBarrier] = useState<BarrierData & { comments: any[] } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBarrierDetails = async () => {
      setLoading(true);
      try {
        // This endpoint needs to be created in the backend.
        // For now, we assume it exists and fetches a barrier and its comments.
        const response = await fetch(`http://localhost:8000/api/v1/barriers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch barrier details');
        }
        const data = await response.json();
        setBarrier(data);
      } catch (error) {
        console.error(error);
        // Fallback to mock data on error for demonstration
        setBarrier(mockBarrierDetails);
      } finally {
        setLoading(false);
      }
    };

    fetchBarrierDetails();
  }, [id]);

  const handleVote = (dir: 'up' | 'down') => {
    if (voteState === dir) {
      setVoteState(null);
      setVoteCount(barrier.votes);
    } else {
      const delta = dir === 'up' ? 1 : -1;
      const prev = voteState === 'up' ? 1 : voteState === 'down' ? -1 : 0;
      setVoteCount(barrier.votes + delta - prev);
      setVoteState(dir);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Optimistic update
    const newCommentObj = {
      id: `c${barrier.comments.length + 1}`,
      username: 'You', // Placeholder
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      time: 'Just now',
      text: newComment,
    };

    setBarrier(prev => ({
      ...prev,
      comments: [...prev.comments, newCommentObj],
      commentCount: prev.commentCount + 1,
    }));
    setNewComment('');

    // API call
    try {
      await fetch(`/api/v1/barriers/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
    } catch (error) {
      console.error("Failed to post comment", error);
      // Optionally revert optimistic update
    }
  };

  const [voteState, setVoteState] = useState<'up' | 'down' | null>(null);
  const [voteCount, setVoteCount] = useState(barrier.votes);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p>Loading barrier details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!barrier) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p>Barrier not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-5" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="w-3 h-3" />Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/feed" className="hover:text-foreground transition-colors">Feed</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{barrier.title}</span>
          </nav>

          <div className="flex gap-4">
            {/* Vote column */}
            <div className="flex flex-col items-center gap-1 pt-4 flex-shrink-0">
              <button
                onClick={() => handleVote('up')}
                className={`p-2 rounded-md transition-colors ${voteState === 'up' ? 'text-upvote-active bg-orange-50' : 'text-muted-foreground hover:text-upvote-active hover:bg-orange-50'}`}
                aria-label="Upvote"
              >
                <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <span className={`text-sm font-bold tabular-nums ${voteState === 'up' ? 'text-upvote-active' : voteState === 'down' ? 'text-downvote-active' : 'text-muted-foreground'}`}>
                {voteCount}
              </span>
              <button
                onClick={() => handleVote('down')}
                className={`p-2 rounded-md transition-colors ${voteState === 'down' ? 'text-downvote-active bg-blue-50' : 'text-muted-foreground hover:text-downvote-active hover:bg-blue-50'}`}
                aria-label="Downvote"
              >
                <ArrowDown className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Main content */}
            <div className="flex-grow min-w-0 bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="p-5 sm:p-6">
                {/* Meta */}
                <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  <span>Posted by <span className="font-medium text-foreground">u/{barrier.username}</span></span>
                  <span>·</span><span>{barrier.timeAgo}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{barrier.location}</span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-snug mb-3">{barrier.title}</h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {barrier.severity}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                    <Flag className="w-3 h-3" />{barrier.category}
                  </span>
                </div>

                {/* Photo placeholder */}
                <div className="w-full aspect-video rounded-xl bg-secondary/50 flex items-center justify-center mb-5 border border-border">
                  <p className="text-sm text-muted-foreground">Barrier photo</p>
                </div>

                {/* Description */}
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">{barrier.description}</div>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-5 pt-4 border-t border-border">
                  <a href="#comments" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-2.5 py-1.5 rounded-md hover:bg-secondary hover:text-foreground transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />{barrier.commentCount} Comments
                  </a>
                  <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-2.5 py-1.5 rounded-md hover:bg-secondary hover:text-foreground transition-colors">
                    <Share2 className="w-3.5 h-3.5" />Share
                  </button>
                  <Link href="/report" className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md gradient-accent text-white font-semibold hover:opacity-90 transition-opacity">
                    Report Nearby
                  </Link>
                </div>
              </div>

              {/* Comments */}
              <div id="comments" className="border-t border-border">
                <div className="p-5 sm:p-6">
                  <h2 className="text-base font-semibold text-foreground mb-5">
                    {mockComments.length} Comments
                  </h2>

                  {/* Add comment */}
                  <div className="flex gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-grow flex gap-2">
                      <Input
                        placeholder="Add a comment…"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="text-sm"
                      />
                      <button
                        disabled={!newComment.trim()}
                        className="flex-shrink-0 px-3 py-2 rounded-lg gradient-accent text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                        aria-label="Submit comment"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comment list */}
                  <div className="space-y-5">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                          {comment.username[0].toUpperCase()}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-foreground">u/{comment.username}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{comment.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-upvote-active transition-colors">
                              <ArrowUp className="w-3 h-3" />{comment.votes}
                            </button>
                            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
