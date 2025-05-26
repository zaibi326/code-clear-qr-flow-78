
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star, Users, Shield, Zap } from 'lucide-react';

const CTABanner = () => {
  const benefits = [
    { icon: CheckCircle, text: "14-day free trial" },
    { icon: Shield, text: "No setup fees" },
    { icon: Zap, text: "Cancel anytime" },
    { icon: Users, text: "24/7 support" }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "10M+", label: "QR Codes Generated" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9★", label: "Customer Rating" }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Trust badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">Rated 4.9/5 by 10,000+ customers</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight max-w-5xl mx-auto">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Marketing Strategy?
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful businesses using ClearQR.io to create engaging, 
              trackable QR experiences that drive measurable results and real growth.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <benefit.icon className="h-5 w-5 text-green-400" />
                <span className="text-white font-semibold">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl group"
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-12 py-6 text-xl font-semibold backdrop-blur-sm rounded-2xl transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Final trust statement */}
          <div className="pt-8">
            <p className="text-blue-200 text-lg font-medium">
              🔒 Enterprise-grade security • 🌍 Used in 100+ countries • 🏆 Award-winning platform
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
