import React from "react";
import { 
  ArrowRight, 
  Play, 
  Target, 
  Crown, 
  Star,
  // Brand Icons
  Hexagon,
  Triangle,
  Command,
  Ghost,
  Gem,
  Cpu
} from "lucide-react";

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
  </div>
);

const CLIENTS = [
  { name: "Acme Corp", icon: Hexagon },
  { name: "Quantum", icon: Triangle },
  { name: "Command+Z", icon: Command },
  { name: "Phantom", icon: Ghost },
  { name: "Ruby", icon: Gem },
  { name: "Chipset", icon: Cpu },
];

export default function HeroSection() {
  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans">
      {/* 
        SCOPED ANIMATIONS 
      */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; /* Slower for readability */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background Image with Gradient Mask */}
      <div 
        className="absolute inset-0 z-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80)] bg-cover bg-center opacity-40"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">
            
            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  Making Cities Accessible For All
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 
              className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
              }}
            >
              Navigate Your World, <br />
              <span className="bg-gradient-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                Barrier-Free
              </span>
            </h1>

            {/* Subheading */}
            <p className="animate-fade-in delay-300 max-w-xl text-base sm:text-lg text-zinc-400">
              RaahSaathi is a community-driven platform that maps and identifies accessibility barriers in public spaces, empowering people with mobility challenges to navigate their cities with confidence.
            </p>

            {/* Action Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-b from-zinc-50 to-zinc-200 text-zinc-900 font-semibold text-sm shadow-lg hover:shadow-zinc-900/20 transition-all duration-300 hover:scale-105 active:scale-100">
                <Target className="w-4 h-4" />
                Report a Barrier
              </button>
              <button className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-zinc-300 font-medium text-sm transition-colors hover:text-white">
                <Play className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-110" />
                How It Works
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN (GLASSMORPHISM CARD) --- */}
          <div className="lg:col-span-5 animate-fade-in delay-500">
            <div 
              className="relative w-full h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              style={{
                boxShadow: "inset 0px 1px 0px 0px rgba(255, 255, 255, 0.05), 0px 10px 30px 0px rgba(0,0,0,0.2)",
              }}
            >
              {/* Inner content of the card */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Featured Contributor</h3>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    Our platform is powered by community heroes who map their cities.
                  </p>
                </div>
                <div className="mt-8 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <StatItem value="12K+" label="Barriers Mapped" />
                    <div className="w-px h-8 bg-white/10"></div>
                    <StatItem value="5K+" label="Active Users" />
                    <div className="w-px h-8 bg-white/10"></div>
                    <StatItem value="98%" label="Route Accuracy" />
                  </div>
                </div>
              </div>
              
              {/* Decorative gradient glow */}
              <div 
                className="absolute -top-1/3 -left-1/3 w-[200%] h-[200%] -z-10"
                style={{
                  backgroundImage: "radial-gradient(circle at center, rgba(128, 90, 213, 0.15) 0%, rgba(128, 90, 213, 0) 40%)"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- CLIENTS/PARTNERS SECTION --- */}
      <div className="relative z-10 mt-24 md:mt-32">
        <p className="text-center text-sm font-medium text-zinc-500 mb-6">
          TRUSTED BY LEADING ACCESSIBILITY ORGANIZATIONS
        </p>
        <div className="relative h-12 w-full overflow-hidden">
          <div className="absolute left-0 top-0 flex w-[200%] h-full animate-marquee items-center">
            {CLIENTS.concat(CLIENTS).map((client, index) => (
              <div key={index} className="flex items-center justify-center w-[16.66%] px-4">
                <client.icon className="w-auto h-6 text-zinc-600 transition-colors hover:text-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
