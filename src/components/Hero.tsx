import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Play, Sparkles, Users, TrendingUp, Shield, Zap, Globe, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPreviewInNewTab = () => {
    // Open the actual preview URL in a new tab
    window.open('https://preview--code-clear-qr-flow-78.lovable.app/quick-generate', '_blank', 'noopener,noreferrer');
  };

  const handleScheduleDemo = () => {
    // Scroll to contact section or open a demo scheduling modal
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: open a simple alert for demo
      alert('Demo scheduling will be available soon. Please contact us at demo@clearqr.io');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-20 overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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

          {/* Navigation buttons for sections */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-blue-600 font-semibold"
              onClick={() => scrollToSection('features')}
            >
              View Features
            </Button>
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-blue-600 font-semibold"
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </Button>
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-2"
              onClick={openPreviewInNewTab}
            >
              Open Preview
              <ExternalLink className="h-4 w-4" />
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

          {/* Enterprise Dashboard Preview with Stats */}
          <div className="max-w-6xl mx-auto mb-16">
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
                      🔒 enterprise.clearqr.io/dashboard
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-green-600">LIVE</span>
                  </div>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-8 bg-gradient-to-br from-white to-slate-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { value: "2.4M", label: "Monthly Scans", color: "blue", icon: "📊", trend: "+24%" },
                    { value: "1,847", label: "Active Campaigns", color: "green", icon: "🚀", trend: "+12%" },
                    { value: "34.8%", label: "Engagement Rate", color: "purple", icon: "📈", trend: "+8%" },
                    { value: "$847K", label: "Revenue Tracked", color: "orange", icon: "💰", trend: "+31%" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
                      <div className="text-3xl mb-3">{stat.icon}</div>
                      <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}</div>
                      <div className="text-sm text-slate-600 font-medium mb-2">{stat.label}</div>
                      <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {stat.trend}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-8 py-4 rounded-full border border-blue-200/50">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-bold text-lg">Enterprise Analytics Dashboard</span>
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted by section with major brands */}
          <div className="mb-12">
            <p className="text-slate-600 mb-8 font-semibold text-lg">Trusted by 50,000+ businesses worldwide</p>
            <div className="flex justify-center items-center space-x-16 opacity-70">
              <img 
                src="/lovable-uploads/b4c3c62e-0d2e-40ad-b6b5-53c875ec53d1.png" 
                alt="Amazon" 
                className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
              <img 
                src="/lovable-uploads/02a40581-58f3-4a8f-9289-addc9f13cab0.png" 
                alt="KitKat" 
                className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
              <img 
                src="/lovable-uploads/be72ecde-71f8-48bc-bf62-2eca4a681d94.png" 
                alt="Pepsi" 
                className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
              <img 
                src="/lovable-uploads/eaf3b04c-dd24-42ad-9c40-e965dcff4a0f.png" 
                alt="Toyota" 
                className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              />
            </div>
          </div>

          {/* Social proof stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { stat: "5M+", label: "QR Scans Monthly", icon: "📱" },
              { stat: "99.9%", label: "Uptime Guaranteed", icon: "⚡" },
              { stat: "150+", label: "Countries Served", icon: "🌍" }
            ].map((item, index) => (
              <div key={index} className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{item.stat}</div>
                <div className="text-slate-600 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
