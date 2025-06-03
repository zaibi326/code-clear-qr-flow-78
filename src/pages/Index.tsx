
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
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="g" cx="50%" cy="50%"><stop offset="0%" stop-color="rgb(59,130,246)" stop-opacity="0.3"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23g)"><animate attributeName="cx" values="200;800;200" dur="20s" repeatCount="indefinite"/></circle><circle cx="800" cy="400" r="150" fill="url(%23g)"><animate attributeName="cy" values="400;100;400" dur="15s" repeatCount="indefinite"/></circle><circle cx="500" cy="700" r="120" fill="url(%23g)"><animate attributeName="r" values="120;200;120" dur="10s" repeatCount="indefinite"/></circle></svg>')] opacity-40"></div>
          
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
