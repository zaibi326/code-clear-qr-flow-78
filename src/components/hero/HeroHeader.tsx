
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroHeaderProps {
  scrollToSection: (sectionId: string) => void;
  openPreviewInNewTab: () => void;
  handleScheduleDemo: () => void;
}

const HeroHeader = ({ scrollToSection, openPreviewInNewTab, handleScheduleDemo }: HeroHeaderProps) => {
  return (
    <div className="text-center max-w-6xl mx-auto">
      {/* Main headline */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Create
          <span className="block text-blue-600">Smart QR Codes</span>
          <span className="block">That Drive Results</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Transform your marketing with dynamic QR codes that track engagement, 
          boost conversions, and provide deep insights into customer behavior.
        </p>
      </div>
      
      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
          asChild
        >
          <Link to="/register">
            <span className="mr-2">Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
          onClick={handleScheduleDemo}
        >
          <Play className="h-5 w-5 mr-2" />
          <span>Watch Demo</span>
        </Button>
      </div>

      {/* Trust indicators */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>✓ No credit card required</span>
        <span>✓ 14-day free trial</span>
        <span>✓ Cancel anytime</span>
      </div>
    </div>
  );
};

export default HeroHeader;
