
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import Navigation from '@/components/Navigation';
import InteractiveHero from '@/components/InteractiveHero';
import TechFeatures from '@/components/TechFeatures';
import AnimatedHowItWorks from '@/components/AnimatedHowItWorks';
import InteractiveStats from '@/components/InteractiveStats';
import FuturisticPricing from '@/components/FuturisticPricing';
import NextGenCTA from '@/components/NextGenCTA';
import Footer from '@/components/Footer';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      console.log('Index: User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-r-4 border-l-4 border-purple-400 animate-ping mx-auto"></div>
          </div>
          <p className="text-white text-lg font-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  // Only show landing page if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-20 left-20 w-20 h-20 bg-blue-500/30 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-16 h-16 bg-purple-500/30 rounded-full animate-bounce"></div>
            <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-cyan-500/30 rounded-full animate-ping"></div>
          </div>
          
          {/* Particle Effects */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <Navigation />
          <InteractiveHero />
          <TechFeatures />
          <AnimatedHowItWorks />
          <InteractiveStats />
          <FuturisticPricing />
          <NextGenCTA />
          <Footer />
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
