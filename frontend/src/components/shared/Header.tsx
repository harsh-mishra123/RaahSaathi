"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NavigationIcon, Menu, X, MapPin, Map, FileText, Route, User, Bell } from 'lucide-react';
import MobileNav from './MobileNav';

const navLinks = [
  { href: '/feed', label: 'Barriers', icon: NavigationIcon },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/report', label: 'Report', icon: FileText },
  { href: '/route-planner', label: 'Route Planner', icon: Route },
];

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-zinc-950/95 backdrop-blur-sm shadow-nav border-b border-zinc-800'
            : 'bg-zinc-950 border-b border-zinc-900'
        }`}
        style={{ height: 'var(--header-height)' }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              RaahSaathi
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/5'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <Link href="/profile" className="hidden md:block">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-4 h-4 text-accent" />
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-2 ml-1">
              <Button variant="ghost" size="sm" className="text-sm text-white hover:bg-white/10">Log In</Button>
              <Button size="sm" className="text-sm gradient-accent text-white border-0 hover:opacity-90">
                Sign Up
              </Button>
            </div>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navLinks={navLinks}
        pathname={pathname}
      />
    </>
  );
};

export default Header;