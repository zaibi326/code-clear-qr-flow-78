import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Shield, Globe, Zap, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
const NextGenCTA = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const benefits = [{
    icon: Rocket,
    text: "Launch in 60 seconds"
  }, {
    icon: Shield,
    text: "Enterprise security"
  }, {
    icon: Globe,
    text: "Global infrastructure"
  }, {
    icon: Zap,
    text: "Lightning performance"
  }];
  const stats = [{
    number: "250K+",
    label: "Active Users"
  }, {
    number: "15M+",
    label: "QR Codes Created"
  }, {
    number: "99.99%",
    label: "Uptime SLA"
  }, {
    number: "195",
    label: "Countries"
  }];
  return <section className="py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-20 w-20 h-20 bg-cyan-500/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-16 h-16 bg-purple-500/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-blue-500/30 rounded-full animate-ping"></div>
        </div>
        
        {/* Particle Network */}
        
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Main Content */}
        <div className="text-center space-y-16">
          {/* Header */}
          <div className="space-y-8">
            {/* Floating Badge */}
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 rounded-full text-white font-bold shadow-2xl hover:scale-105 transition-all duration-300 group">
              <Sparkles className="h-6 w-6 mr-3 text-cyan-400 group-hover:animate-spin" />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-lg">
                The Future is Now
              </span>
              <div className="ml-3 flex space-x-1">
                {Array.from({
                length: 5
              }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
              <span className="block mb-4">Ready to Transform</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Your Business?
              </span>
              <span className="block text-gray-200 text-4xl md:text-5xl lg:text-6xl">
                Start Your Journey Today
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-light">
              Join the QR revolution with the most advanced platform on the planet. 
              <span className="font-bold text-cyan-400"> Create, track, and optimize</span> campaigns 
              that deliver extraordinary results and drive unprecedented growth.
            </p>
          </div>

          {/* Interactive Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => <div key={index} className="relative group p-6 rounded-2xl backdrop-blur-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>)}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                <benefit.icon className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white font-semibold">{benefit.text}</span>
              </div>)}
          </div>

          {/* Mega CTA Section */}
          <div className="space-y-12">
            {/* Primary CTAs */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white px-16 py-8 text-2xl font-black shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 group border-0 relative overflow-hidden rounded-3xl" asChild>
                <Link to="/register">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Rocket className="h-8 w-8 mr-4 relative z-10 group-hover:animate-bounce" />
                  <span className="mr-4 relative z-10">Launch Your Campaign</span>
                  <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform relative z-10" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="border-2 border-cyan-400/50 hover:border-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 hover:text-white px-16 py-8 text-2xl font-black backdrop-blur-xl rounded-3xl transition-all duration-300 hover:scale-110 group shadow-xl" onClick={() => {
              const demoSection = document.getElementById('demo');
              if (demoSection) {
                demoSection.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }}>
                <Globe className="h-8 w-8 mr-4 group-hover:rotate-12 transition-transform" />
                <span>Explore Platform</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-white">
              {["🚀 Launch in 60 seconds", "🔒 Enterprise-grade security", "🌍 Global infrastructure", "⚡ 99.99% uptime SLA", "🎯 No setup fees", "📱 Mobile-first design"].map((indicator, index) => <span key={index} className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  {indicator}
                </span>)}
            </div>

            {/* Final Message */}
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-300 leading-relaxed">
                <span className="font-bold text-white">🎉 Special Launch Offer:</span> 
                Get started with our Professional plan free for 30 days. 
                No credit card required, cancel anytime. Join thousands of businesses 
                already transforming their customer experiences with next-generation QR technology.
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="relative h-32">
            {[Rocket, Shield, Globe, Zap].map((Icon, index) => <div key={index} className="absolute w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20" style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${index * 90}deg) translateX(8rem) translateY(-50%)`,
            animation: `float ${10 + index * 2}s ease-in-out infinite`
          }}>
                <Icon className="w-8 h-8 text-white" />
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default NextGenCTA;