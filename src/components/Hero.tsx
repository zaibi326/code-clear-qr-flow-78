
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowRight, Play, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/40 bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Trusted by 10,000+ businesses worldwide</span>
              <Zap className="w-4 h-4 text-purple-500" />
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Create{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart QR Campaigns
                </span>{' '}
                That Convert
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                The complete QR code marketing platform. Design, generate, track, and optimize campaigns that drive real business results.
              </p>
            </div>

            {/* Enhanced Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, text: "Drag & Drop Editor" },
                { icon: CheckCircle, text: "Bulk CSV Upload" },
                { icon: CheckCircle, text: "Real-time Analytics" },
                { icon: CheckCircle, text: "PDF Export & Mailers" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/90 transition-all duration-300 group">
                  <feature.icon className="h-5 w-5 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 font-semibold">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-8 py-4 text-lg group transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-6 font-medium">Trusted by industry leaders:</p>
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

          {/* Enhanced Right Content - Interactive Dashboard Preview */}
          <div className="relative animate-fade-in delay-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-all duration-500 border border-white/50">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700">Campaign Dashboard</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Mock Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">2,847</div>
                  <div className="text-sm text-blue-500">Total Scans</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">94.2%</div>
                  <div className="text-sm text-purple-500">Success Rate</div>
                </div>
              </div>

              {/* Mock QR Code */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 text-center">
                <div className="grid grid-cols-8 gap-1 mb-4 max-w-32 mx-auto">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm transition-all duration-1000 delay-${i * 20} ${
                        Math.random() > 0.5 
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse' 
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-700">Live Campaign QR</p>
                <p className="text-xs text-blue-600 font-medium">clearqr.io/campaign-123</p>
              </div>
            </div>
            
            {/* Enhanced Floating Stats */}
            <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce hover:animate-none transition-all duration-300">
              <div className="text-2xl font-bold text-green-600">+187%</div>
              <div className="text-sm text-gray-500">Engagement ↗</div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce delay-500 hover:animate-none transition-all duration-300">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-500">Live Tracking</div>
            </div>

            <div className="absolute top-1/3 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3 border border-gray-100 animate-bounce delay-1000 hover:animate-none transition-all duration-300">
              <div className="text-lg font-bold text-purple-600">CSV</div>
              <div className="text-xs text-gray-500">Bulk Upload</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
