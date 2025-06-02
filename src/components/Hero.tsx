
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
    <div className="relative bg-white pt-24 pb-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
