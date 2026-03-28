"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Stat {
  endValue: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const stats: Stat[] = [
  { endValue: 10000, suffix: '+', label: 'Users Helped' },
  { endValue: 50000, suffix: '+', label: 'Barriers Reported' },
  { endValue: 1000, suffix: '+', label: 'Cities Covered' },
  { endValue: 98, suffix: '%', label: 'AI Accuracy Rate' },
];

function useCountUp(endValue: number, duration = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * endValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, endValue, duration]);

  return count;
}

const StatItem = ({ stat, trigger }: { stat: Stat; trigger: boolean }) => {
  const count = useCountUp(stat.endValue, 1800, trigger);
  const displayValue = count >= 1000 ? `${(count / 1000).toFixed(0)}k` : count.toString();

  return (
    <div className="flex flex-col items-center text-center p-6">
      <p className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
        {stat.prefix}{displayValue}{stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
    </div>
  );
};

const Stats = () => {
  const [triggered, setTriggered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border border border-border rounded-2xl overflow-hidden bg-white shadow-card">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} trigger={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;