
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, QrCode, BarChart3, Users, CheckCircle, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const handleWatchDemo = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8 lg:space-y-12">
          {/* Trust badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-md text-blue-700 px-6 py-3 rounded-full text-sm font-semibold border border-blue-200/50 shadow-lg">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>Trusted by 50,000+ businesses worldwide</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight max-w-5xl mx-auto">
              Create
              <span className="relative mx-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Smart QR Codes
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-30"></div>
              </span>
              That Drive Results
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
              Transform your marketing with dynamic QR codes that track engagement, 
              boost conversions, and provide deep insights into customer behavior.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-8 justify-center text-gray-600 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200/50">
              <QrCode className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Custom Design</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200/50">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <span className="font-semibold">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200/50">
              <Users className="h-6 w-6 text-green-600" />
              <span className="font-semibold">Bulk Generation</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link to="/quick-generate">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl group">
                <Plus className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Create QR Code
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="px-10 py-6 text-xl font-semibold border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 rounded-2xl group"
              onClick={handleWatchDemo}
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Benefits list */}
          <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-600 pt-8">
            {['No credit card required', '14-day free trial', 'Cancel anytime', '24/7 support'].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="pt-16">
            <div className="relative max-w-6xl mx-auto">
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                {/* Mock browser header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="bg-white px-6 py-2 rounded-lg text-sm text-gray-600 font-medium">
                      clearqr.io/dashboard
                    </div>
                    <div className="w-16"></div>
                  </div>
                </div>
                
                {/* Mock dashboard content */}
                <div className="p-8 space-y-8 bg-gradient-to-br from-white to-blue-50/30">
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200/50">
                      <div className="text-3xl font-bold text-blue-600">12,847</div>
                      <div className="text-sm text-blue-600/70 font-medium">Total Scans</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200/50">
                      <div className="text-3xl font-bold text-purple-600">24</div>
                      <div className="text-sm text-purple-600/70 font-medium">Active Campaigns</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200/50">
                      <div className="text-3xl font-bold text-green-600">18.4%</div>
                      <div className="text-sm text-green-600/70 font-medium">Conversion Rate</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200/50">
                      <div className="text-3xl font-bold text-orange-600">$24.8K</div>
                      <div className="text-sm text-orange-600/70 font-medium">Revenue</div>
                    </div>
                  </div>
                  
                  {/* Mock chart */}
                  <div className="bg-gradient-to-br from-gray-50 to-white h-48 rounded-2xl flex items-end justify-center space-x-3 p-8 border border-gray-200/50">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-blue-600 via-purple-600 to-blue-500 rounded-t-lg shadow-sm"
                        style={{ 
                          height: `${Math.random() * 120 + 40}px`, 
                          width: '24px' 
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-200/50 animate-bounce">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-blue-600" />
                </div>
              </div>

              <div className="absolute -top-8 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">Live Analytics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="pt-16">
            <p className="text-sm text-gray-500 mb-8 font-medium">Trusted by industry leaders worldwide</p>
            <div className="flex items-center justify-center space-x-12 opacity-60">
              <img 
                src="/lovable-uploads/0af51d00-d352-417f-93bb-fd6aaca07809.png" 
                alt="Amazon" 
                className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 filter brightness-75"
              />
              <img 
                src="/lovable-uploads/83cd2073-42ea-432d-a04a-43858780a99c.png" 
                alt="KitKat" 
                className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 filter brightness-75"
              />
              <img 
                src="/lovable-uploads/8650ab3b-cc18-4ba8-af81-8b83f2ab88a1.png" 
                alt="Pepsi" 
                className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 filter brightness-75"
              />
              <img 
                src="/lovable-uploads/886c0218-76ad-42c0-a3a3-848ee33127dc.png" 
                alt="Toyota" 
                className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 filter brightness-75"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
