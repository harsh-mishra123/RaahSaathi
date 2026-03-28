import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import FeedTabs from '@/components/feed/FeedTabs';
import SearchComponent from '@/components/ui/animated-glowing-search-bar';
import { SlidersHorizontal, MapPin } from 'lucide-react';

export default function FeedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Barrier Feed</h1>
          <p className="text-md text-zinc-400 mt-2">
            Community-reported accessibility barriers, sorted and filtered for you.
          </p>
          <div className="mt-4 flex justify-center">
            <SearchComponent />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main feed */}
          <div className="flex-grow min-w-0">
            <FeedTabs />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
            {/* Filters */}
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold">Filter</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Severity</p>
                  {['Severe', 'Moderate', 'Minor'].map((s) => (
                    <label key={s} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-violet-500 focus:ring-violet-500" />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{s}</span>
                    </label>
                  ))}
                </div>
                <div className="border-t border-zinc-700 pt-3">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Category</p>
                  {['Broken Pavement', 'Missing Ramp', 'Construction', 'Tactile Paving', 'Steep Ramp'].map((c) => (
                    <label key={c} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-violet-500 focus:ring-violet-500" />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* About card */}
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 gradient-accent rounded flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-semibold">About RaahSaathi</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A community platform for reporting and discovering accessibility barriers. Help make cities more navigable for everyone.
              </p>
              <a
                href="/report"
                className="mt-4 flex items-center justify-center w-full py-2 rounded-lg gradient-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                + Report a Barrier
              </a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
