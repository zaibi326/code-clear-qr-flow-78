
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowRight, Play, CheckCircle, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/40 bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Trusted by 10,000+ businesses worldwide</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Create{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart QR Codes
                </span>{' '}
                That Drive Results
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Generate, customize, and track high-performance QR codes for marketing campaigns, 
                customer engagement, and business growth. All in one powerful platform.
              </p>
            </div>

            {/* Enhanced Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, text: "Real-time Analytics" },
                { icon: CheckCircle, text: "Custom Branding" },
                { icon: CheckCircle, text: "Bulk Generation" },
                { icon: CheckCircle, text: "API Integration" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <feature.icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-8 py-4 text-lg group transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Enhanced Trust Indicators with Company Logos and Animations */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-6 font-medium">Trusted by businesses you know:</p>
              <div className="flex items-center justify-start gap-8 flex-wrap">
                <img 
                  src="/lovable-uploads/5a18dce6-2917-4c31-af16-17e4c3ac2cf1.png" 
                  alt="Toyota" 
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer animate-[float_6s_ease-in-out_infinite]"
                />
                <img 
                  src="/lovable-uploads/c925acce-4c43-44ea-a8b4-f18e82befd41.png" 
                  alt="Pepsi" 
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer animate-[float_6s_ease-in-out_infinite_1s]"
                />
                <img 
                  src="/lovable-uploads/c55dda3b-09a6-4f41-b0fe-351becec9f58.png" 
                  alt="Kit Kat" 
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer animate-[float_6s_ease-in-out_infinite_2s]"
                />
                <img 
                  src="/lovable-uploads/7044a335-27b6-407a-8043-23c1c5995404.png" 
                  alt="Amazon" 
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer animate-[float_6s_ease-in-out_infinite_3s]"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Right Content - QR Code Visualization */}
          <div className="relative animate-fade-in delay-300">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-1 transition-all duration-500 border border-white/50">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="grid grid-cols-10 gap-1 mb-6">
                  {/* Enhanced QR code pattern */}
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm transition-all duration-1000 delay-${i * 10} ${
                        Math.random() > 0.5 
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse' 
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Sample QR Code</p>
                  <p className="text-xs text-blue-600 font-medium">clearqr.io/demo</p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Floating Stats */}
            <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 animate-bounce">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-500">Scans Today</div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 animate-bounce delay-500">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>

            <div className="absolute top-1/2 -right-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100 animate-bounce delay-1000">
              <div className="text-lg font-bold text-green-600">+300%</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
