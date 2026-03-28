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

const FeedTabs = () => {
  const [barriers, setBarriers] = useState<BarrierData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarriers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/v1/barriers/nearby');
        if (!response.ok) {
          throw new Error('Failed to fetch barriers');
        }
        const data = await response.json();
        setBarriers(data);
      } catch (error) {
        console.error(error);
        // Handle error, maybe show a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchBarriers();
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
    return <div>Loading barriers...</div>;
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