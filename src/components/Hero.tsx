
import React from 'react';
import HeroHeader from './hero/HeroHeader';
import HeroTrustedBy from './hero/HeroTrustedBy';
import HeroStats from './hero/HeroStats';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPreviewInNewTab = () => {
    window.open('/quick-generate', '_blank', 'noopener,noreferrer');
  };

  const handleScheduleDemo = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Demo scheduling will be available soon. Please contact us at demo@clearqr.io');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced background pattern with Uniqode-style design */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>
      
      {/* Multiple gradient orbs for depth */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-r from-orange-400/15 to-red-400/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      {/* Geometric shapes */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-400/30 rotate-45 animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-purple-400/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-pink-400/30 rotate-12 animate-pulse delay-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <HeroHeader 
          scrollToSection={scrollToSection}
          openPreviewInNewTab={openPreviewInNewTab}
          handleScheduleDemo={handleScheduleDemo}
        />
        
        {/* Dashboard Preview Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Dashboard Experience
            </h3>
            <p className="text-lg text-gray-600">
              Monitor your campaigns with enterprise-grade analytics and insights
            </p>
          </div>
          <HeroStats />
        </div>
        
        <HeroTrustedBy />
      </div>
    </div>
  );
};

export default Hero;
