
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, BarChart3, Shield, Zap, Globe, Code, Smartphone, Eye } from 'lucide-react';

const TechFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: QrCode,
      title: "AI-Powered Generation",
      description: "Advanced algorithms create optimized QR codes with perfect scanning rates",
      gradient: "from-blue-500 to-cyan-500",
      demo: "Generate QR codes 50% faster with AI optimization"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Monitor every scan with millisecond precision and actionable insights",
      gradient: "from-purple-500 to-pink-500",
      demo: "Track 10M+ scans daily with zero latency"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption with SOC2 compliance and GDPR protection",
      gradient: "from-green-500 to-emerald-500",
      demo: "99.99% security uptime across all data centers"
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Edge computing with 200+ data centers for lightning-fast performance",
      gradient: "from-orange-500 to-red-500",
      demo: "Sub-50ms response times worldwide"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-purple-900/50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-white rounded-full animate-bounce"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold mb-8">
            <Code className="h-5 w-5 mr-2 text-cyan-400" />
            Next-Generation Technology
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Built for the
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Future of QR
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the most advanced QR platform powered by cutting-edge technology, 
            designed for enterprises that demand performance, security, and scale.
          </p>
        </div>

        {/* Interactive Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div
                  key={index}
                  className={`p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 scale-105 shadow-2xl'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:scale-102'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg ${
                      isActive ? 'animate-pulse' : ''
                    }`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-300 text-lg mb-4 leading-relaxed">{feature.description}</p>
                      
                      {isActive && (
                        <div className="bg-gradient-to-r from-cyan-400/20 to-purple-400/20 p-4 rounded-xl border border-cyan-400/30 animate-fade-in">
                          <div className="flex items-center">
                            <Eye className="h-5 w-5 text-cyan-400 mr-2" />
                            <span className="text-cyan-400 font-semibold">{feature.demo}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Demo Area */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl">
              {/* Mock Dashboard */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-semibold text-lg">Live Demo</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">LIVE</span>
                  </div>
                </div>
                
                {/* Animated Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Active Scans", value: "847,293", change: "+24%" },
                    { label: "Response Time", value: "12ms", change: "-15%" },
                    { label: "Success Rate", value: "99.97%", change: "+0.3%" },
                    { label: "Global Reach", value: "184", change: "+7" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                      <div className="text-green-400 text-xs font-semibold">{stat.change}</div>
                    </div>
                  ))}
                </div>
                
                {/* Animated Chart */}
                <div className="bg-white/5 rounded-xl p-4 h-32 flex items-end space-x-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-t ${features[activeFeature].gradient} rounded-t flex-1 transition-all duration-1000`}
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Floating QR Code */}
              <div className="relative h-40 flex items-center justify-center">
                <div className={`w-32 h-32 bg-gradient-to-r ${features[activeFeature].gradient} rounded-2xl p-6 shadow-2xl transform transition-all duration-500 ${
                  isVisible ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
                }`}>
                  <div className="w-full h-full bg-white rounded-lg p-2">
                    <div className="grid grid-cols-6 gap-1 h-full">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm transition-all duration-300 ${
                            Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'
                          }`}
                          style={{
                            animationDelay: `${i * 100}ms`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Orbiting Elements */}
                <div className="absolute inset-0">
                  {[Smartphone, BarChart3, Shield, Zap].map((Icon, i) => (
                    <div
                      key={i}
                      className="absolute w-8 h-8 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 90}deg) translateX(4rem) translateY(-50%)`,
                        animation: `spin ${15 + i * 3}s linear infinite reverse`
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechFeatures;
