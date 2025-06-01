
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Play, Sparkles, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DemoButton from './demo/DemoButton';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-20 overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Enhanced trust indicator */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full text-sm font-medium text-blue-700 shadow-lg">
              <Users className="h-4 w-4" />
              <span>Trusted by 50,000+ businesses worldwide</span>
              <div className="flex -space-x-1 ml-2">
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Enhanced main headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Create
              <span className="block relative">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart QR Codes
                </span>
                <div className="absolute -top-4 -right-8 hidden md:block">
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                </div>
              </span>
              <span className="block text-slate-800">That Drive Results</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
              Transform your marketing with <span className="text-blue-600 font-semibold">dynamic QR codes</span> that track engagement, 
              boost conversions, and provide <span className="text-purple-600 font-semibold">deep insights</span> into customer behavior.
            </p>
          </div>

          {/* Enhanced key benefits */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { icon: "🎨", text: "Custom Design" },
              { icon: "📊", text: "Real-time Analytics" },
              { icon: "⚡", text: "Bulk Generation" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-200/50">
                <span className="text-2xl">{benefit.icon}</span>
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-slate-700">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 h-auto" 
              asChild
            >
              <Link to="/register">
                <span className="mr-3">Create QR Code</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/90 backdrop-blur-sm border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 h-auto group"
            >
              <Play className="h-6 w-6 mr-3 group-hover:text-blue-600 transition-colors" />
              <span className="group-hover:text-blue-600 transition-colors">Watch Demo</span>
            </Button>
          </div>

          {/* Enhanced trust benefits */}
          <div className="flex flex-wrap justify-center gap-2 mb-16 text-sm">
            {[
              "No credit card required",
              "14-day free trial", 
              "Cancel anytime",
              "24/7 support"
            ].map((benefit, index, arr) => (
              <React.Fragment key={index}>
                <span className="text-slate-600 font-medium bg-white/60 px-3 py-1 rounded-full">
                  {benefit}
                </span>
                {index < arr.length - 1 && <span className="text-slate-400 self-center">•</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Enhanced Dashboard Preview */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 transform hover:scale-[1.02] transition-all duration-500">
              {/* Browser chrome */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-4 border-b border-slate-300/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    </div>
                    <div className="bg-white/80 px-4 py-1 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                      🔒 clearqr.io/dashboard
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-8 bg-gradient-to-br from-white to-slate-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { value: "12,847", label: "Total Scans", color: "blue", icon: "📊" },
                    { value: "24", label: "Active Campaigns", color: "green", icon: "🚀" },
                    { value: "18.4%", label: "Conversion Rate", color: "purple", icon: "📈" },
                    { value: "$24.8K", label: "Revenue", color: "orange", icon: "💰" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-100">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</div>
                      <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-700 font-bold">Live Analytics Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced trust logos */}
          <div className="mb-8">
            <p className="text-slate-600 mb-8 font-medium text-lg">Trusted by industry leaders worldwide</p>
            <div className="flex justify-center items-center space-x-12 opacity-80">
              <img 
                src="/lovable-uploads/b4c3c62e-0d2e-40ad-b6b5-53c875ec53d1.png" 
                alt="Amazon" 
                className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
              <img 
                src="/lovable-uploads/02a40581-58f3-4a8f-9289-addc9f13cab0.png" 
                alt="KitKat" 
                className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
              <img 
                src="/lovable-uploads/be72ecde-71f8-48bc-bf62-2eca4a681d94.png" 
                alt="Pepsi" 
                className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
              <img 
                src="/lovable-uploads/eaf3b04c-dd24-42ad-9c40-e965dcff4a0f.png" 
                alt="Toyota" 
                className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
