import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-zinc-900">
      <div className="container mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 p-12 sm:p-16 text-white text-center">
          {/* decorative elements */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
            aria-hidden="true"
          />

          <h2 className="text-3xl sm:text-4xl font-bold max-w-2xl mx-auto leading-tight">
            Ready to navigate with confidence?
          </h2>
          <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
            Join thousands of users making cities more accessible—one report at a time.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-indigo-600 font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all duration-150 shadow-lg"
            >
              Explore the Map
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-white/50 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/80 active:scale-95 transition-all duration-150"
            >
              Report a Barrier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
