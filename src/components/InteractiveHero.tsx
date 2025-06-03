
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Globe, Code, Smartphone, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const InteractiveHero = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = [
    { icon: Code, title: "Smart QR Generation", desc: "AI-powered codes" },
    { icon: BarChart3, title: "Real-time Analytics", desc: "Live insights" },
    { icon: Shield, title: "Enterprise Security", desc: "Bank-grade protection" },
    { icon: Globe, title: "Global Reach", desc: "Worldwide coverage" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      {/* Interactive Background Elements */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transition-all duration-1000"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          {/* Animated Badge */}
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-bold mb-12 shadow-2xl hover:scale-105 transition-all duration-300 group">
            <Zap className="h-5 w-5 mr-3 text-yellow-400 group-hover:animate-pulse" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary QR Technology Platform
            </span>
            <div className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Headline with Typing Effect */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.8] tracking-tight">
            <span className="block mb-4">Create</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse mb-4">
              Smart QR
            </span>
            <span className="block text-gray-200">Experiences</span>
          </h1>
          
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-16 max-w-6xl mx-auto leading-relaxed font-light">
            Transform physical touchpoints into <span className="font-bold text-cyan-400 bg-cyan-400/10 px-3 py-2 rounded-lg">digital experiences</span> with 
            AI-powered QR codes that <span className="font-bold text-purple-400 bg-purple-400/10 px-3 py-2 rounded-lg">track, analyze, and optimize</span> every interaction.
          </p>
        </div>

        {/* Interactive Feature Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 cursor-pointer ${
                  activeFeature === index
                    ? 'border-cyan-400/50 bg-cyan-400/10 scale-105'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <Icon className={`h-8 w-8 mb-4 transition-colors duration-300 ${
                  activeFeature === index ? 'text-cyan-400' : 'text-gray-400'
                }`} />
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white px-16 py-8 text-2xl font-black rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 group border-0 relative overflow-hidden" 
            asChild
          >
            <Link to="/register">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Smartphone className="h-8 w-8 mr-4 relative z-10" />
              <span className="mr-4 relative z-10">Start Creating</span>
              <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform relative z-10" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-cyan-400/50 hover:border-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/20 text-cyan-400 hover:text-white px-16 py-8 text-2xl font-black rounded-2xl transition-all duration-300 hover:scale-110 group backdrop-blur-xl shadow-lg hover:shadow-xl"
            onClick={() => {
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Globe className="h-8 w-8 mr-4 group-hover:rotate-12 transition-transform" />
            <span>View Demo</span>
          </Button>
        </div>

        {/* Floating QR Code Animation */}
        <div className="relative h-64 mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-48 h-48 bg-white rounded-3xl shadow-2xl p-8 animate-bounce">
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-4">
                  <div className="grid grid-cols-8 gap-1 h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm transition-all duration-500 ${
                          Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'
                        }`}
                        style={{
                          animationDelay: `${i * 50}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Orbiting Elements */}
              <div className="absolute -inset-16">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 90}deg) translateX(5rem) translateY(-50%)`,
                      animation: `spin ${10 + i * 2}s linear infinite`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: "10M+", label: "QR Codes Generated", icon: "🚀" },
            { number: "99.99%", label: "Uptime Guarantee", icon: "⚡" },
            { number: "180+", label: "Countries Worldwide", icon: "🌍" }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400 font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveHero;
