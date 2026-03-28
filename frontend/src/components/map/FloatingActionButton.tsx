import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const FloatingActionButton = () => {
  return (
    <Link
      href="/report"
      className="absolute bottom-24 right-4 sm:bottom-8 sm:right-6 w-14 h-14 rounded-full gradient-accent text-white flex items-center justify-center shadow-floating hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      aria-label="Report a barrier"
      title="Report a Barrier"
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
    </Link>
  );
};

export default FloatingActionButton;