import React from 'react';
import Link from 'next/link';
import { MapPin, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-accent rounded-md flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground">RaahSaathi</span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/feed" className="hover:text-foreground transition-colors">Feed</Link>
            <Link href="/map" className="hover:text-foreground transition-colors">Map</Link>
            <Link href="/report" className="hover:text-foreground transition-colors">Report</Link>
            <Link href="/route-planner" className="hover:text-foreground transition-colors">Route Planner</Link>
            <Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link>
          </nav>

          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <span className="text-xs ml-2">© 2025 RaahSaathi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
