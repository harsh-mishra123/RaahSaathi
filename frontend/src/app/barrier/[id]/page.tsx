"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { ArrowUp, ArrowDown, MapPin, Flag, ChevronRight, Send, Image as ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  username: string;
  time: string;
  text: string;
  photo_url?: string;
  votes: number;
}

interface BarrierData {
  id: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  severity: "Severe" | "Moderate" | "Minor";
  photo_url: string;
  upvotes: number;
  downvotes: number;
  status: string;
  reported_by: string;
  created_at: string;
  comments: Comment[];
}

const mockBarrierDetails: BarrierData = {
  id: "1",
  description: `A large crack spans the entire footpath just outside the metro station exit on MG Road. The crack is approximately 30-35 cm wide and 10 cm deep at some points, making it completely impassable for wheelchair users and extremely hazardous for visually impaired individuals.

Two incidents of people tripping have been reported by local shopkeepers this week. The area is heavily trafficked during peak hours (8-10 AM and 5-8 PM). The BBMP maintenance team has reportedly been notified but no action has been taken in 3 weeks.

Suggested workaround: Use the parallel footpath on the opposite side of the road (requires crossing at the junction 150m north).`,
  category: "Broken Pavement",
  latitude: 12.9716,
  longitude: 77.5946,
  severity: "Severe",
  photo_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7185743?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  upvotes: 47,
  downvotes: 2,
  status: "active",
  reported_by: "priya_navigates",
  created_at: "2024-07-28T10:30:00Z",
  comments: [
    { id: "1", username: "accessibility_watch", time: "1 hour ago", text: "Confirmed this is still there as of this morning. The crack has actually widened slightly after last night's rain.", votes: 14 },
    { id: "2", username: "wheeltrails", time: "45 min ago", text: "I use this route daily. This is a major problem. I've had to detour via Residency Road adding 20 mins to my commute. Please fix ASAP!", votes: 22 },
    { id: "3", username: "safe_steps_bng", time: "20 min ago", text: "Submitted a BBMP complaint (ticket #BBK2024-3821). Let's upvote so this gets visibility.", votes: 8 },
  ],
};

const severityConfig = {
  Severe: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
  Moderate: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  Minor: { bg: "bg-green-100 text-green-700", dot: "bg-green-600" },
};

export default function BarrierDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [barrier, setBarrier] = useState<BarrierData | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentPhoto, setCommentPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [commentVotes, setCommentVotes] = useState<Record<string, "up" | "down" | null>>({});

  useEffect(() => {
    const fetchBarrierDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/v1/barriers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch barrier details");
        }
        const data = await response.json();
        setBarrier(data);
      } catch (error) {
        console.error(error);
        setBarrier(mockBarrierDetails);
      } finally {
        setLoading(false);
      }
    };

    fetchBarrierDetails();
  }, [id]);

  const handleVote = (dir: "up" | "down") => {
    setVoteState((current) => (current === dir ? null : dir));
  };

  const handleCommentVote = (commentId: string, dir: "up" | "down") => {
    setCommentVotes((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === dir ? null : dir,
    }));
    
    // Optimistically update the vote count in state
    if (barrier) {
      setBarrier({
        ...barrier,
        comments: barrier.comments.map(c => {
          if (c.id === commentId) {
            let newVotes = c.votes;
            const currentVote = commentVotes[commentId];
            if (currentVote === dir) {
              newVotes += dir === 'up' ? -1 : 1; // cancel vote
            } else {
              if (currentVote) { // changing vote direction
                 newVotes += dir === 'up' ? 2 : -2;
              } else { // new vote
                 newVotes += dir === 'up' ? 1 : -1;
              }
            }
            return { ...c, votes: newVotes };
          }
          return c;
        })
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newComment.trim() && !commentPhoto) || !barrier) return;

    const newCommentObj: Comment = {
      id: `c${barrier.comments.length + 1}`,
      username: "You",
      time: "Just now",
      text: newComment,
      photo_url: commentPhoto || undefined,
      votes: 0,
    };

    setBarrier({ ...barrier, comments: [...barrier.comments, newCommentObj] });
    setNewComment("");
    setCommentPhoto(null);

    try {
      await fetch(`http://localhost:8000/api/v1/barriers/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "a_valid_user_id_placeholder", content: newComment, photo_url: commentPhoto }),
      });
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mt-10" />
          <p className="mt-4 text-zinc-400">Loading barrier details...</p>
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
          <p>Barrier details are unavailable.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const cfg = severityConfig[barrier.severity];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>Barrier details</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <img src={barrier.photo_url} alt={barrier.category} className="h-72 w-full rounded-3xl object-cover" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${cfg.bg}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                  {barrier.severity}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                  <Flag className="w-3 h-3" />
                  {barrier.category}
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-white">Barrier on MG Road</h1>
              <p className="text-zinc-300 whitespace-pre-line">{barrier.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <span>Reported by {barrier.reported_by}</span>
                <span>•</span>
                <span>{new Date(barrier.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant={voteState === 'up' ? 'default' : 'outline'} 
                onClick={() => handleVote('up')}
                className={voteState === 'up' ? 'bg-accent hover:bg-accent/90 text-black' : ''}
              >
                <ArrowUp className="w-4 h-4 mr-2" /> Upvote
              </Button>
              <Button 
                variant={voteState === 'down' ? 'default' : 'outline'} 
                onClick={() => handleVote('down')}
                className={voteState === 'down' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
              >
                <ArrowDown className="w-4 h-4 mr-2" /> Downvote
              </Button>
              <span className="ml-auto text-sm text-zinc-300 font-medium text-lg">
                {barrier.upvotes - barrier.downvotes + (voteState === 'up' ? 1 : voteState === 'down' ? -1 : 0)} votes
              </span>
            </div>
          </section>

          <aside className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg flex flex-col h-[calc(100vh-12rem)]">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Location</h2>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span>{barrier.latitude.toFixed(4)}, {barrier.longitude.toFixed(4)}</span>
              </div>
            </div>

            <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <h2 className="text-xl font-semibold sticky top-0 bg-zinc-900 pb-2 z-10">Comments & Queries</h2>
              <div className="space-y-4">
                {barrier.comments.map((comment) => (
                  <div key={comment.id} className="rounded-3xl bg-zinc-950 p-4 border border-zinc-800/50">
                    <div className="flex items-center justify-between gap-4 text-sm text-zinc-400 mb-2">
                      <div className="font-medium text-zinc-300">{comment.username}</div>
                      <div>{comment.time}</div>
                    </div>
                    {comment.photo_url && (
                      <div className="mb-3 rounded-2xl overflow-hidden">
                        <img src={comment.photo_url} alt="Comment attachment" className="w-full h-auto max-h-48 object-cover" />
                      </div>
                    )}
                    <p className="text-sm text-zinc-300 whitespace-pre-line">{comment.text}</p>
                    <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-3">
                      <button 
                        onClick={() => handleCommentVote(comment.id, 'up')}
                        className={`p-1.5 rounded-full transition-colors ${commentVotes[comment.id] === 'up' ? 'bg-accent/20 text-accent' : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{comment.votes}</span>
                      <button 
                        onClick={() => handleCommentVote(comment.id, 'down')}
                        className={`p-1.5 rounded-full transition-colors ${commentVotes[comment.id] === 'down' ? 'bg-red-500/20 text-red-500' : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              {commentPhoto && (
                <div className="relative mb-3 inline-block">
                  <img src={commentPhoto} alt="Upload preview" className="h-20 w-auto rounded-lg object-cover border border-zinc-700" />
                  <button 
                    onClick={() => setCommentPhoto(null)}
                    className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 border border-zinc-600 hover:bg-zinc-700 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 rounded-3xl border border-zinc-800 bg-zinc-950 p-3">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a query or add a comment..."
                  className="bg-transparent border-none focus-visible:ring-0 px-2 py-1 text-white placeholder:text-zinc-500 shadow-none h-auto"
                />
                <div className="flex items-center justify-between px-2 pb-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-8 rounded-full px-4 bg-accent hover:bg-accent/90 text-black font-medium"
                    disabled={!newComment.trim() && !commentPhoto}
                  >
                    Post <Send className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
