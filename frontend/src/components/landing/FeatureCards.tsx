"use client";

import React from 'react';
import { Map, Eye, AlertTriangle, Route, WifiOff, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Map,
    iconBg: 'bg-blue-50 text-blue-600',
    title: 'Real-time Mapping',
    description: 'Get live updates on obstacles, construction, and safe paths visualized on an interactive community-powered map.',
  },
  {
    icon: Eye,
    iconBg: 'bg-purple-50 text-purple-600',
    title: 'AI-Powered Classification',
    description: 'Our AI automatically identifies and categorizes accessibility barriers from user-submitted photos in seconds.',
  },
  {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50 text-amber-600',
    title: 'Community Alerts',
    description: 'Receive and contribute real-time alerts for barriers reported by thousands of users around you.',
  },
  {
    icon: Route,
    iconBg: 'bg-green-50 text-green-600',
    title: 'Accessible Route Planning',
    description: 'Plan routes that avoid barriers, steps, and steep inclines. Customized for wheelchairs and mobility aids.',
  },
  {
    icon: WifiOff,
    iconBg: 'bg-rose-50 text-rose-600',
    title: 'Works Offline',
    description: 'Download areas for offline use. Access critical accessibility info even without an internet connection.',
  },
  {
    icon: BarChart3,
    iconBg: 'bg-cyan-50 text-cyan-600',
    title: 'Accessibility Scores',
    description: 'View accessibility scores for streets, neighborhoods, and venues based on real community data.',
  },
];

const FeatureCards = () => {
  return (
    <section className="py-20 bg-zinc-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-2">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How RaahSaathi Helps</h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-xl mx-auto">
            Everything you need to navigate the world safely and independently.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-white/10 bg-zinc-950 hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg} group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;