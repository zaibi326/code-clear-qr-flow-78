
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroHeaderProps {
  scrollToSection: (sectionId: string) => void;
  openPreviewInNewTab: () => void;
  handleScheduleDemo: () => void;
}

const HeroHeader = ({ scrollToSection, openPreviewInNewTab, handleScheduleDemo }: HeroHeaderProps) => {
  return (
    <div className="text-center max-w-7xl mx-auto relative">
      {/* Floating elements for visual appeal */}
      <div className="absolute -top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-10 right-32 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute -bottom-10 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Badge */}
      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200/50 rounded-full text-blue-700 text-sm font-bold mb-8 shadow-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
        <Sparkles className="h-4 w-4 mr-2 text-blue-600 animate-pulse" />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">The Future of QR Technology</span>
        <TrendingUp className="h-4 w-4 ml-2 text-green-600" />
      </div>

      {/* Main headline with enhanced typography */}
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-10 leading-[0.85] tracking-tight">
          <span className="block mb-2">Create</span>
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in mb-2">
            Smart QR Codes
          </span>
          <span className="block text-gray-800">That Drive Results</span>
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed font-light">
          Transform your marketing with <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">dynamic QR codes</span> that track engagement, 
          boost conversions, and provide <span className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">deep insights</span> into customer behavior.
        </p>
      </div>
      
      {/* Enhanced CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-12 py-7 text-xl font-black rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group border-0 relative overflow-hidden" 
          asChild
        >
          <Link to="/register">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="mr-3 relative z-10">Get Started Free</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="border-2 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 px-12 py-7 text-xl font-black rounded-2xl transition-all duration-300 hover:scale-105 group backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl"
          onClick={handleScheduleDemo}
        >
          <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform text-blue-600" />
          <span className="text-gray-700 group-hover:text-blue-700">Watch Demo</span>
        </Button>
      </div>

      {/* Enhanced trust indicators */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-base text-gray-600 mb-16">
        <div className="flex items-center bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Shield className="h-5 w-5 text-green-500 mr-3" />
          <span className="font-bold text-gray-700">No credit card required</span>
        </div>
        <div className="flex items-center bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-3" />
          <span className="font-bold text-gray-700">14-day free trial</span>
        </div>
        <div className="flex items-center bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Sparkles className="h-5 w-5 text-purple-500 mr-3" />
          <span className="font-bold text-gray-700">Cancel anytime</span>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
