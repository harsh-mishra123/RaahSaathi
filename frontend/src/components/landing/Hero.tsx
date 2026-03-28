"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Users, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-24">
      {/* Decorative floating accent blobs */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(262 83% 78% / 0.5) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[20rem] h-[20rem] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(199 89% 70% / 0.6) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-semibold mb-6 animate-fade-in-up"
        style={{ animationDelay: '0ms' }}
      >
        <Shield className="w-3 h-3" aria-hidden="true" />
        Community-Powered Accessibility Platform
      </div>

      {/* Headline */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight animate-fade-in-up"
        style={{ animationDelay: '80ms' }}
      >
        Navigate Your World{' '}
        <span className="text-gradient">with Confidence</span>
      </h1>

      {/* Description */}
      <p
        className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
        style={{ animationDelay: '160ms' }}
      >
        Real-time accessibility information, community barrier reports, and AI-powered route planning—so everyone can move through the world safely.
      </p>

      {/* CTAs */}
      <div
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
        style={{ animationDelay: '240ms' }}
      >
        <Link
          href="/map"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-accent text-white font-semibold text-sm shadow-card-hover hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          Start Navigating
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-border text-foreground font-semibold text-sm hover:bg-secondary active:scale-95 transition-all duration-150 shadow-card"
        >
          <Users className="w-4 h-4" aria-hidden="true" />
          See Community Feed
        </Link>
      </div>

      {/* Social proof */}
      <p
        className="mt-8 text-xs text-muted-foreground animate-fade-in-up"
        style={{ animationDelay: '320ms' }}
      >
        Trusted by <span className="font-semibold text-foreground">10,000+</span> users across{' '}
        <span className="font-semibold text-foreground">1,000+</span> cities
      </p>
    </section>
  );
};

export default Hero;