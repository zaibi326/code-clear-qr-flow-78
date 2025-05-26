
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, QrCode, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const handleWatchDemo = () => {
    // Create a modal or redirect to demo video
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  return (
    <section className="relative pt-20 pb-28 lg:pt-32 lg:pb-40 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Trusted by 10,000+ Marketers</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Marketing Materials
                </span>
                Into Trackable QR Campaigns
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Create, manage, and track QR code campaigns with our drag-and-drop editor. 
                Transform static materials into dynamic, data-driven marketing assets.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <span>Custom QR Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>Bulk Campaigns</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 group"
                onClick={handleWatchDemo}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted by industry leaders</p>
              <div className="flex items-center justify-center lg:justify-start space-x-8 opacity-60">
                <img 
                  src="/lovable-uploads/0af51d00-d352-417f-93bb-fd6aaca07809.png" 
                  alt="Amazon" 
                  className="h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
                <img 
                  src="/lovable-uploads/83cd2073-42ea-432d-a04a-43858780a99c.png" 
                  alt="KitKat" 
                  className="h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
                <img 
                  src="/lovable-uploads/8650ab3b-cc18-4ba8-af81-8b83f2ab88a1.png" 
                  alt="Pepsi" 
                  className="h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
                <img 
                  src="/lovable-uploads/886c0218-76ad-42c0-a3a3-848ee33127dc.png" 
                  alt="Toyota" 
                  className="h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Mock browser header */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 bg-white px-4 py-1 rounded text-sm text-gray-600">
                    clearqr.io/dashboard
                  </div>
                </div>
              </div>
              
              {/* Mock dashboard content */}
              <div className="p-6 space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Total Scans</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">18</div>
                    <div className="text-sm text-gray-600">Active Campaigns</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8.4%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
                
                {/* Mock chart */}
                <div className="bg-gray-50 h-32 rounded-lg flex items-end justify-center space-x-2 p-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t"
                      style={{ 
                        height: `${Math.random() * 80 + 20}%`, 
                        width: '12px' 
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating QR code */}
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 animate-bounce">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            {/* Floating analytics */}
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
