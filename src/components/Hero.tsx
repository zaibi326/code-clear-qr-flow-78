
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowRight, Play, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>Trusted by 10,000+ businesses worldwide</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Create{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dynamic QR Codes
                </span>{' '}
                That Drive Results
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Generate, customize, and track high-performance QR codes for marketing campaigns, 
                customer engagement, and business growth. All in one powerful platform.
              </p>
            </div>

            {/* Feature Points */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 font-medium">Analytics & Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 font-medium">Custom Branding</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 font-medium">Bulk Generation</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-400 px-8 py-4 text-lg group"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 text-sm text-gray-500">
              <p className="mb-4">Trusted by leading companies:</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="font-semibold text-gray-400">Microsoft</div>
                <div className="font-semibold text-gray-400">Shopify</div>
                <div className="font-semibold text-gray-400">Airbnb</div>
                <div className="font-semibold text-gray-400">Stripe</div>
              </div>
            </div>
          </div>

          {/* Right Content - QR Code Visualization */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-1 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6">
                <div className="grid grid-cols-8 gap-1">
                  {/* Simple QR code pattern */}
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        Math.random() > 0.5 
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-gray-700">Sample QR Code</p>
                  <p className="text-xs text-gray-500">clearqr.io/sample</p>
                </div>
              </div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-500">Scans Today</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
