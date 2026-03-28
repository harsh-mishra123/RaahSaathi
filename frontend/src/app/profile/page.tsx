import React from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Trophy, Settings, MapPin, ThumbsUp, Award, Star, Shield, Heart, Zap, Target, Globe } from 'lucide-react';
import BarrierCard, { BarrierData } from '@/components/feed/BarrierCard';

const userReports: BarrierData[] = [
  { id: '1', title: 'Broken Pavement on MG Road', username: 'rahul_navigates', timeAgo: '2 days ago', severity: 'Severe', category: 'Broken Pavement', location: 'MG Road, Bangalore', description: 'Large crack spanning the entire footpath.', votes: 47, commentCount: 12 },
  { id: '3', title: 'Missing Curb Cut at Indiranagar', username: 'rahul_navigates', timeAgo: '1 week ago', severity: 'Moderate', category: 'Missing Ramp', location: 'Indiranagar, Bangalore', description: 'Intersection lacks a curb cut entirely.', votes: 29, commentCount: 5 },
];

const badges = [
  { icon: Star, label: 'First Report', color: 'text-amber-500 bg-amber-50', earned: true },
  { icon: Shield, label: 'Verified Reporter', color: 'text-blue-500 bg-blue-50', earned: true },
  { icon: Heart, label: 'Community Helper', color: 'text-rose-500 bg-rose-50', earned: true },
  { icon: Zap, label: 'Fast Responder', color: 'text-purple-500 bg-purple-50', earned: true },
  { icon: Target, label: '10 Reports', color: 'text-green-500 bg-green-50', earned: false },
  { icon: Globe, label: 'City Champion', color: 'text-cyan-500 bg-cyan-50', earned: false },
  { icon: Award, label: 'Top Contributor', color: 'text-orange-500 bg-orange-50', earned: false },
  { icon: Trophy, label: 'Legend', color: 'text-yellow-500 bg-yellow-50', earned: false },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow">
        {/* Cover + Avatar */}
        <div className="relative">
          <div className="h-36 sm:h-48 gradient-accent opacity-70" />
          <div
            className="h-36 sm:h-48 absolute inset-0"
            style={{ background: 'linear-gradient(135deg, hsl(262 83% 58% / 0.8) 0%, hsl(230 75% 60% / 0.8) 100%)' }}
          />
          <div className="container mx-auto px-4">
            <div className="relative flex items-end gap-4 -mt-12 pb-4">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-card bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-2xl sm:text-3xl font-bold text-white">R</span>
              </div>
              <div className="pb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Rahul Navigates</h1>
                <p className="text-sm text-muted-foreground">u/rahul_navigates · Bangalore, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-b border-border bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-8 py-3">
              {[
                { label: 'Reports', value: '24' },
                { label: 'Upvotes', value: '342' },
                { label: 'Badges', value: '4' },
                { label: 'Joined', value: 'Jan 2024' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center sm:items-start">
                  <span className="text-base sm:text-lg font-bold text-foreground">{value}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="reports">
            <TabsList className="bg-white border border-border mb-6 p-1 rounded-lg shadow-card">
              <TabsTrigger value="reports" className="flex items-center gap-1.5 text-sm">
                <FileText className="w-3.5 h-3.5" />
                My Reports
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1.5 text-sm">
                <Trophy className="w-3.5 h-3.5" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5 text-sm">
                <Settings className="w-3.5 h-3.5" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-3">
              {userReports.map((b) => (
                <BarrierCard key={b.id} barrier={b} />
              ))}
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badges.map(({ icon: Icon, label, color, earned }) => (
                  <div
                    key={label}
                    className={`bg-white rounded-xl border border-border p-4 flex flex-col items-center text-center shadow-card transition-card hover-lift ${!earned ? 'opacity-40 grayscale' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${earned ? color : 'bg-secondary text-muted-foreground'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="text-2xs text-muted-foreground mt-0.5">{earned ? 'Earned' : 'Locked'}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-white rounded-xl border border-border shadow-card p-6 max-w-lg space-y-5">
                <h2 className="text-base font-semibold text-foreground">Profile Settings</h2>
                {[
                  { id: 'name', label: 'Display Name', value: 'Rahul Navigates' },
                  { id: 'email', label: 'Email', value: 'rahul@example.com', type: 'email' },
                  { id: 'city', label: 'City', value: 'Bangalore' },
                ].map(({ id, label, value, type }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      id={id}
                      type={type || 'text'}
                      defaultValue={value}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
                <button className="px-5 py-2.5 rounded-lg gradient-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
