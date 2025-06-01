
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import DemoButton from './demo/DemoButton';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Trust indicator */}
          <div className="mb-8 text-sm text-gray-600">
            <span>Trusted by 50,000+ businesses worldwide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Smart QR Codes
            </span>
            <span className="block">That Drive Results</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your marketing with dynamic QR codes that track engagement, boost conversions, 
            and provide deep insights into customer behavior.
          </p>

          {/* Key benefits list */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Custom Design</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Bulk Generation</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200" asChild>
              <Link to="/register">
                Create QR Code
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <DemoButton />
          </div>

          {/* Trust benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-600">
            <span>No credit card required</span>
            <span>•</span>
            <span>14-day free trial</span>
            <span>•</span>
            <span>Cancel anytime</span>
            <span>•</span>
            <span>24/7 support</span>
          </div>

          {/* Dashboard Preview */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-600">clearqr.io/dashboard</span>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12,847</div>
                    <div className="text-sm text-gray-600">Total Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-sm text-gray-600">Active Campaigns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">18.4%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">$24.8K</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
                <div className="text-center text-gray-600 font-semibold">Live Analytics</div>
              </div>
            </div>
          </div>

          {/* Trust logos */}
          <div className="mb-8">
            <p className="text-gray-600 mb-6">Trusted by industry leaders worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-70">
              <img 
                src="/lovable-uploads/b4c3c62e-0d2e-40ad-b6b5-53c875ec53d1.png" 
                alt="Amazon" 
                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
              <img 
                src="/lovable-uploads/02a40581-58f3-4a8f-9289-addc9f13cab0.png" 
                alt="KitKat" 
                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
              <img 
                src="/lovable-uploads/be72ecde-71f8-48bc-bf62-2eca4a681d94.png" 
                alt="Pepsi" 
                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
              <img 
                src="/lovable-uploads/eaf3b04c-dd24-42ad-9c40-e965dcff4a0f.png" 
                alt="Toyota" 
                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
