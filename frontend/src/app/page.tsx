import HeroSection from '@/components/ui/glassmorphism-trust-hero';
import Testimonials from '@/components/ui/testimonials-demo';
import FeatureCards from '@/components/landing/FeatureCards';
import Stats from '@/components/landing/Stats';
import CTASection from '@/components/landing/CTASection';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeatureCards />
        <Stats />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
