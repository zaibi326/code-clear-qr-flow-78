
import React from 'react';
import HeroHeader from './hero/HeroHeader';
import HeroStats from './hero/HeroStats';
import HeroTrustedBy from './hero/HeroTrustedBy';
import HeroSocialProof from './hero/HeroSocialProof';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPreviewInNewTab = () => {
    // Open the quick-generate page in a new tab
    window.open('/quick-generate', '_blank', 'noopener,noreferrer');
  };

  const handleScheduleDemo = () => {
    // Scroll to contact section or open a demo scheduling modal
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: open a simple alert for demo
      alert('Demo scheduling will be available soon. Please contact us at demo@clearqr.io');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-20 overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <HeroHeader 
          scrollToSection={scrollToSection}
          openPreviewInNewTab={openPreviewInNewTab}
          handleScheduleDemo={handleScheduleDemo}
        />
        
        <HeroStats />
        
        <HeroTrustedBy />
        
        <HeroSocialProof />
      </div>
    </div>
  );
};

export default Hero;
