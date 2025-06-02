
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import EnterpriseFeatures from '@/components/EnterpriseFeatures';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import About from '@/components/About';
import TestimonialsStats from '@/components/TestimonialsStats';
import Pricing from '@/components/Pricing';
import CTAFooterSection from '@/components/CTAFooterSection';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show landing page if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <EnterpriseFeatures />
        <HowItWorks />
        <UseCases />
        <About />
        <TestimonialsStats />
        <Pricing />
        <CTAFooterSection />
        <Footer />
      </div>
    );
  }

  // This shouldn't render due to the useEffect redirect, but just in case
  return null;
};

export default Index;
