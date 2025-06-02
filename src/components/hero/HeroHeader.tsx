
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
      <div className="absolute -top-10 left-10 animate-pulse">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
      </div>
      <div className="absolute top-20 right-20 animate-pulse delay-1000">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-20 blur-xl"></div>
      </div>
      
      {/* Badge */}
      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm">
        <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
        <span>The Future of QR Technology</span>
        <TrendingUp className="h-4 w-4 ml-2 text-green-600" />
      </div>

      {/* Main headline */}
      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tight">
          Create
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in">
            Smart QR Codes
          </span>
          <span className="block text-gray-800">That Drive Results</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed font-light">
          Transform your marketing with <span className="font-semibold text-blue-600">dynamic QR codes</span> that track engagement, 
          boost conversions, and provide <span className="font-semibold text-purple-600">deep insights</span> into customer behavior.
        </p>
      </div>
      
      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group border-0" 
          asChild
        >
          <Link to="/register">
            <span className="mr-3">Get Started Free</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="border-2 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 px-10 py-6 text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-105 group backdrop-blur-sm"
          onClick={handleScheduleDemo}
        >
          <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
          <span>Watch Demo</span>
        </Button>
      </div>

      {/* Trust indicators with enhanced design */}
      <div className="flex flex-wrap justify-center gap-8 text-base text-gray-600 mb-12">
        <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100">
          <Shield className="h-5 w-5 text-green-500 mr-2" />
          <span className="font-medium">No credit card required</span>
        </div>
        <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
          <span className="font-medium">14-day free trial</span>
        </div>
        <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100">
          <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
          <span className="font-medium">Cancel anytime</span>
        </div>
      </div>

      {/* Stats preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[
          { number: "5M+", label: "QR Scans Monthly", icon: "📊", color: "from-blue-500 to-cyan-500" },
          { number: "99.9%", label: "Uptime Guaranteed", icon: "⚡", color: "from-green-500 to-emerald-500" },
          { number: "150+", label: "Countries Served", icon: "🌍", color: "from-purple-500 to-pink-500" }
        ].map((stat, index) => (
          <div key={index} className="text-center bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
              {stat.number}
            </div>
            <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroHeader;
