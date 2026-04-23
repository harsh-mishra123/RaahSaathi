"use client";

import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarrierCard, { BarrierData } from './BarrierCard';

const tabs = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Sparkles },
  { value: 'top', label: 'Top', icon: TrendingUp },
];

const mockFeedBarriers: BarrierData[] = [
  {
    id: 'b1',
    title: 'Huge crack outside MG Road Metro',
    username: 'priya_navigates',
    description: 'A large crack spans the entire footpath just outside the metro station exit on MG Road. Making it completely impassable for wheelchair users.',
    category: 'Broken Pavement',
    location: 'MG Road Metro Station, Bangalore',
    severity: 'Severe',
    image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7185743?q=80&w=2940&auto=format&fit=crop',
    upvotes: 142,
    downvotes: 4,
    created_at: '2024-05-20T10:30:00Z',
    comment_count: 15
  },
  {
    id: 'b2',
    title: 'Scaffolding blocking the entire sidewalk',
    username: 'rahul_walker',
    description: 'Construction scaffolding blocks the entire sidewalk, forcing pedestrians to walk on the busy street.',
    category: 'Construction',
    location: 'Brigade Road, Bangalore',
    severity: 'Severe',
    image_url: 'https://images.unsplash.com/photo-1541888009257-88981f964098?q=80&w=2940&auto=format&fit=crop',
    upvotes: 89,
    downvotes: 2,
    created_at: '2024-05-21T08:15:00Z',
    comment_count: 8
  },
  {
    id: 'b3',
    title: 'No curb cut at major intersection',
    username: 'access_advocate',
    description: 'There is no curb cut at this major intersection, making it very difficult for strollers and wheelchairs to cross.',
    category: 'Missing Ramp',
    location: 'Indiranagar 100ft Road, Bangalore',
    severity: 'Moderate',
    image_url: 'https://images.unsplash.com/photo-1574092496253-1cc7099f6b92?q=80&w=2940&auto=format&fit=crop',
    upvotes: 256,
    downvotes: 12,
    created_at: '2024-05-18T14:45:00Z',
    comment_count: 32
  },
  {
    id: 'b4',
    title: 'Tactile paving completely worn out',
    username: 'safe_steps',
    description: 'The tactile paving here is completely worn out, providing no guidance for visually impaired individuals.',
    category: 'Tactile Paving',
    location: 'HSR Layout Sector 1, Bangalore',
    severity: 'Minor',
    image_url: 'https://images.unsplash.com/photo-1621509172205-d143c7b3967b?q=80&w=2940&auto=format&fit=crop',
    upvotes: 45,
    downvotes: 1,
    created_at: '2024-05-22T09:20:00Z',
    comment_count: 3
  }
];

const FeedTabs = () => {
  const [barriers, setBarriers] = useState<BarrierData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setBarriers(mockFeedBarriers);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getSortedBarriers = (sortBy: 'hot' | 'new' | 'top') => {
    switch (sortBy) {
      case 'hot':
        return [...barriers].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'new':
        return [...barriers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'top':
        return [...barriers].sort((a, b) => b.comment_count - a.comment_count);
      default:
        return barriers;
    }
  };

  if (loading) {
    return <div className="text-zinc-400 py-8 text-center animate-pulse">Loading barriers...</div>;
  }

  return (
    <Tabs defaultValue="hot" className="w-full">
      <TabsList className="mb-4 bg-zinc-800 border-zinc-700 p-1 rounded-lg">
        {tabs.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex items-center gap-1.5 text-sm text-zinc-400 data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value }) => (
        <TabsContent key={value} value={value} className="flex flex-col gap-4 mt-0">
          {getSortedBarriers(value as any).map((barrier) => (
            <BarrierCard key={barrier.id} barrier={barrier} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FeedTabs;