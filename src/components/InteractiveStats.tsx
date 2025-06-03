
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Globe, Zap, Shield, Award } from 'lucide-react';

const InteractiveStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    scans: 0,
    users: 0,
    countries: 0,
    uptime: 0
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const finalStats = {
    scans: 15000000,
    users: 250000,
    countries: 195,
    uptime: 99.99
  };

  const statsData = [
    {
      icon: TrendingUp,
      value: counters.scans,
      suffix: '+',
      label: 'QR Scans Monthly',
      description: 'Enterprise-grade performance',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Users,
      value: counters.users,
      suffix: '+',
      label: 'Active Businesses',
      description: 'Trusted worldwide',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: Globe,
      value: counters.countries,
      suffix: '',
      label: 'Countries Served',
      description: 'Global infrastructure',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: Shield,
      value: counters.uptime,
      suffix: '%',
      label: 'Uptime SLA',
      description: 'Mission-critical reliability',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10'
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
      const duration = 3000; // 3 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setCounters({
          scans: Math.floor(finalStats.scans * easeOut),
          users: Math.floor(finalStats.users * easeOut),
          countries: Math.floor(finalStats.countries * easeOut),
          uptime: Number((finalStats.uptime * easeOut).toFixed(2))
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="g1"><stop offset="0%" stop-color="rgb(59,130,246)" stop-opacity="0.2"/><stop offset="100%" stop-color="transparent"/></radialGradient><radialGradient id="g2"><stop offset="0%" stop-color="rgb(147,51,234)" stop-opacity="0.2"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><circle cx="200" cy="300" r="200" fill="url(%23g1)"><animateTransform attributeName="transform" type="translate" values="0,0;100,50;0,0" dur="10s" repeatCount="indefinite"/></circle><circle cx="700" cy="200" r="150" fill="url(%23g2)"><animateTransform attributeName="transform" type="translate" values="0,0;-50,100;0,0" dur="15s" repeatCount="indefinite"/></circle></svg>')] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold mb-8">
            <Award className="h-5 w-5 mr-2 text-green-400" />
            Performance That Speaks
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Trusted by
            <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Join thousands of businesses that rely on our platform for mission-critical 
            QR campaigns with enterprise-grade performance and reliability.
          </p>
        </div>

        {/* Interactive Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative group p-8 rounded-3xl backdrop-blur-xl border border-white/10 bg-gradient-to-br ${stat.bgGradient} hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* Background Animation */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                {/* Stats */}
                <div className="relative z-10">
                  <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.value === counters.uptime ? 
                      stat.value.toFixed(2) : 
                      formatNumber(stat.value)
                    }{stat.suffix}
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2">{stat.label}</h3>
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>

        {/* Interactive Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Response Time",
              value: "< 50ms",
              description: "Lightning-fast global performance",
              icon: Zap,
              gradient: "from-yellow-400 to-orange-500"
            },
            {
              title: "Data Centers",
              value: "200+",
              description: "Worldwide edge computing",
              icon: Globe,
              gradient: "from-blue-400 to-cyan-500"
            },
            {
              title: "Security Score",
              value: "A+",
              description: "Enterprise-grade protection",
              icon: Shield,
              gradient: "from-green-400 to-emerald-500"
            }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-3xl backdrop-blur-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`inline-flex p-6 rounded-full bg-gradient-to-r ${metric.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-12 w-12 text-white" />
                </div>
                
                <div className={`text-4xl font-black bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-4`}>
                  {metric.value}
                </div>
                
                <h3 className="text-white font-bold text-xl mb-2">{metric.title}</h3>
                <p className="text-gray-400">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InteractiveStats;
