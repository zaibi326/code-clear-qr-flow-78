
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Play, Sparkles, Shield, Zap, TrendingUp, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroHeaderProps {
  scrollToSection: (sectionId: string) => void;
  openPreviewInNewTab: () => void;
  handleScheduleDemo: () => void;
}

const HeroHeader = ({ scrollToSection, openPreviewInNewTab, handleScheduleDemo }: HeroHeaderProps) => {
  return (
    <div className="text-center">
      {/* Enterprise Trust Badge */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-full text-sm font-semibold text-blue-700 shadow-lg">
          <Shield className="h-5 w-5 text-green-500" />
          <span>Enterprise-Grade Security</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-600">GDPR Compliant</span>
        </div>
      </div>

      {/* Enhanced main headline */}
      <div className="mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
          <span className="block">Smarter</span>
          <span className="block relative">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              QR Codes
            </span>
            <div className="absolute -top-4 -right-8 hidden md:block">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
          </span>
          <span className="block text-slate-800">for Smarter Engagement</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
          Create <span className="text-blue-600 font-bold">dynamic QR codes</span>, track performance, and personalize every scan — 
          <span className="text-purple-600 font-bold"> no coding required</span>.
        </p>
      </div>

      {/* Enhanced key benefits */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {[
          { icon: <Zap className="h-5 w-5" />, text: "Dynamic Generation", color: "blue" },
          { icon: <TrendingUp className="h-5 w-5" />, text: "Real-time Analytics", color: "green" },
          { icon: <Globe className="h-5 w-5" />, text: "Global Reach", color: "purple" }
        ].map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-full shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className={`text-${benefit.color}-600`}>{benefit.icon}</div>
            <Check className="h-5 w-5 text-green-500" />
            <span className="font-bold text-slate-700">{benefit.text}</span>
          </div>
        ))}
      </div>
      
      {/* Enhanced CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0 h-auto" 
          asChild
        >
          <Link to="/register">
            <span className="mr-3">Start Free</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="bg-white/95 backdrop-blur-sm border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 px-12 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 h-auto group"
          onClick={handleScheduleDemo}
        >
          <Play className="h-6 w-6 mr-3 group-hover:text-blue-600 transition-colors" />
          <span className="group-hover:text-blue-600 transition-colors">Schedule Demo</span>
        </Button>
      </div>

      {/* Enhanced trust benefits */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 text-sm">
        {[
          "✓ No credit card required",
          "✓ 14-day free trial", 
          "✓ Cancel anytime",
          "✓ Enterprise support"
        ].map((benefit, index) => (
          <span key={index} className="text-slate-600 font-semibold bg-white/70 px-4 py-2 rounded-full border border-slate-200/50">
            {benefit}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HeroHeader;
