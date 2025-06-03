
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Cog, BarChart3, ArrowRight, Play, CheckCircle } from 'lucide-react';

const AnimatedHowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: "Design & Upload",
      description: "Upload your content and customize with our advanced drag-and-drop editor. Position QR codes with pixel-perfect precision.",
      features: ["AI-powered positioning", "Brand customization", "Template library", "Real-time preview"],
      icon: Upload,
      gradient: "from-blue-500 to-cyan-500",
      demo: "Smart positioning reduces design time by 80%"
    },
    {
      number: "02", 
      title: "Generate & Deploy",
      description: "Create thousands of unique, trackable QR codes instantly. Bulk generation with CSV import and automated workflows.",
      features: ["Bulk generation", "CSV data import", "API integration", "Smart targeting"],
      icon: Cog,
      gradient: "from-purple-500 to-pink-500",
      demo: "Generate 10,000 codes in under 30 seconds"
    },
    {
      number: "03",
      title: "Track & Optimize", 
      description: "Monitor real-time analytics with location tracking, device data, and performance insights to maximize your ROI.",
      features: ["Real-time analytics", "Location tracking", "A/B testing", "ROI optimization"],
      icon: BarChart3,
      gradient: "from-green-500 to-emerald-500",
      demo: "Average 340% increase in campaign ROI"
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
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} id="demo" className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold mb-8">
            <Play className="h-5 w-5 mr-2 text-purple-400" />
            How It Works
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Transform Ideas into
            <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Digital Experiences
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Three powerful steps to create trackable, data-driven campaigns that deliver 
            measurable results and drive meaningful engagement.
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            
            return (
              <div
                key={index}
                className={`relative transition-all duration-1000 ${
                  isActive ? 'scale-105' : 'scale-100 opacity-70'
                }`}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Container */}
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  
                  {/* Content Side */}
                  <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    {/* Step Number and Title */}
                    <div className="flex items-center space-x-6">
                      <div className={`text-6xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-2">{step.title}</h3>
                        <div className={`w-20 h-1 bg-gradient-to-r ${step.gradient} rounded-full`}></div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-xl text-gray-300 leading-relaxed">{step.description}</p>
                    
                    {/* Features List */}
                    <div className="grid grid-cols-2 gap-4">
                      {step.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <CheckCircle className={`h-5 w-5 bg-gradient-to-r ${step.gradient} text-white rounded-full`} />
                          <span className="text-gray-300 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Demo Stat */}
                    {isActive && (
                      <div className={`bg-gradient-to-r ${step.gradient.replace('to-', 'to-transparent from-')} p-6 rounded-2xl border border-white/10 animate-fade-in`}>
                        <div className="flex items-center">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${step.gradient} mr-4`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">Performance Insight</div>
                            <div className="text-gray-300">{step.demo}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Visual Side */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl">
                      
                      {/* Step Icon */}
                      <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center shadow-2xl ${
                        isActive ? 'animate-pulse scale-110' : ''
                      }`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      
                      {/* Mock Interface */}
                      <div className="space-y-6">
                        <div className="bg-white/5 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-semibold">Step {step.number} Demo</h4>
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            </div>
                          </div>
                          
                          {/* Dynamic Content Based on Step */}
                          {index === 0 && (
                            <div className="space-y-4">
                              <div className="bg-white/10 rounded-lg p-4 h-24 flex items-center justify-center">
                                <div className="text-gray-400">Drag & Drop Interface</div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                  <div key={i} className={`h-8 bg-gradient-to-r ${step.gradient} rounded opacity-50`}></div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {index === 1 && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="text-gray-400">Generating QR Codes...</div>
                                <div className="text-green-400">10,000/10,000</div>
                              </div>
                              <div className="bg-white/10 rounded-full h-3">
                                <div className={`bg-gradient-to-r ${step.gradient} h-full rounded-full transition-all duration-2000 ${
                                  isActive ? 'w-full' : 'w-0'
                                }`}></div>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <div key={i} className="w-8 h-8 bg-white rounded border-2 border-gray-400"></div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-white">2.4M</div>
                                  <div className="text-gray-400 text-sm">Total Scans</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-green-400">+47%</div>
                                  <div className="text-gray-400 text-sm">Growth</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-purple-400">89%</div>
                                  <div className="text-gray-400 text-sm">Success Rate</div>
                                </div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-4 h-16 flex items-end space-x-1">
                                {Array.from({ length: 20 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`bg-gradient-to-t ${step.gradient} rounded-t flex-1 transition-all duration-1000`}
                                    style={{
                                      height: `${20 + Math.random() * 80}%`,
                                      animationDelay: `${i * 50}ms`
                                    }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-16">
                    <ArrowRight className="h-8 w-8 text-gray-500 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Step Navigation */}
        <div className="flex justify-center mt-16 space-x-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeStep === index
                  ? `bg-gradient-to-r ${steps[index].gradient} scale-125`
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedHowItWorks;
