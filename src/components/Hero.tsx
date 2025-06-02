
import React from 'react';
import HeroHeader from './hero/HeroHeader';
import HeroTrustedBy from './hero/HeroTrustedBy';

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
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-32 pb-32 overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <HeroHeader 
          scrollToSection={scrollToSection}
          openPreviewInNewTab={openPreviewInNewTab}
          handleScheduleDemo={handleScheduleDemo}
        />
        
        <HeroTrustedBy />
      </div>
    </div>
  );
};

export default Hero;
