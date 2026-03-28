"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Map, FileText, Route, User, NavigationIcon, X } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  pathname: string;
}

const MobileNav = ({ isOpen, onClose, navLinks, pathname }: MobileNavProps) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-floating transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <div className="w-7 h-7 gradient-accent rounded-md flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground">RaahSaathi</span>
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 flex-grow">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-accent bg-accent/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : ''}`} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/profile"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/profile')
                  ? 'text-accent bg-accent/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <User className="w-4 h-4" aria-hidden="true" />
              Profile
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <Button variant="outline" className="w-full">Log In</Button>
            <Button className="w-full gradient-accent text-white border-0 hover:opacity-90">
              Sign Up
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileNav;
