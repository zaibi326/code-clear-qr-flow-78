
import React from 'react';
import { ArrowRight, Zap, BarChart3, Target, Brain, Shield, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload & Design",
      description: "Upload your marketing materials and use our intuitive drag-and-drop editor to position QR codes exactly where you want them with perfect precision.",
      features: ["Drag & drop editor", "Template library", "Brand customization"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      accentColor: "blue",
      icon: <Target className="w-8 h-8" />,
      techFeatures: ["AI-powered placement", "Vector graphics support", "Real-time preview"]
    },
    {
      number: "02", 
      title: "Generate & Deploy",
      description: "Create single campaigns or bulk generate thousands of unique, trackable QR codes from CSV data with automated workflows and smart targeting.",
      features: ["Bulk generation", "CSV import", "API integration"],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      accentColor: "purple",
      icon: <Zap className="w-8 h-8" />,
      techFeatures: ["Machine learning optimization", "Cloud-native architecture", "99.9% uptime guarantee"]
    },
    {
      number: "03",
      title: "Track & Optimize",
      description: "Monitor real-time analytics, track scan locations, device data, and campaign performance to optimize your marketing ROI with actionable insights.",
      features: ["Real-time analytics", "Location tracking", "Performance optimization"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      accentColor: "green",
      icon: <BarChart3 className="w-8 h-8" />,
      techFeatures: ["Advanced ML analytics", "Predictive modeling", "Custom dashboards"]
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-full text-blue-700 text-sm font-bold mb-8 shadow-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered Technology</span>
            <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
            <span className="block mb-2">How It</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Transform your marketing materials into{' '}
            <span className="font-bold text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 rounded-lg border border-blue-200">trackable, data-driven campaigns</span>{' '}
            in three simple steps that deliver{' '}
            <span className="font-bold text-purple-600 bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-1 rounded-lg border border-purple-200">measurable results</span>.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className={`bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 md:p-12 border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden`}>
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className="flex flex-col lg:flex-row items-start gap-12 relative z-10">
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-8 mb-8">
                      {/* Step Number & Icon */}
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {step.icon}
                        </div>
                        <div className="text-6xl font-black text-gray-200 group-hover:text-gray-300 transition-colors duration-300">
                          {step.number}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-4xl font-black text-gray-900 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium">
                          {step.description}
                        </p>
                        
                        {/* Core Features */}
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                              <div className={`w-3 h-3 bg-gradient-to-r ${step.color} rounded-full shadow-lg`}></div>
                              <span className="text-gray-800 font-bold text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tech Features */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Advanced Technology</span>
                          </div>
                          {step.techFeatures.map((techFeature, techIndex) => (
                            <div key={techIndex} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity duration-300">
                              <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full animate-pulse`}></div>
                              <span className="text-gray-700 font-medium text-sm">{techFeature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Connection Arrow (for all except last) */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-8">
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center mt-24">
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-16 rounded-3xl shadow-2xl max-w-5xl mx-auto relative overflow-hidden">
            {/* Background Tech Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 font-bold mb-8">
                <Zap className="h-4 w-4 animate-pulse" />
                <span>Ready to Transform Your Marketing?</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Start Your QR Revolution
                </span>
              </h3>
              <p className="text-blue-100 text-xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Join thousands of successful businesses using our AI-powered platform to create engaging, trackable QR experiences that drive real results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group border-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="mr-3 relative z-10">Start Free Trial</span>
                  <ArrowRight className="inline w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
                <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105">
                  <Brain className="inline w-6 h-6 mr-3" />
                  Watch AI Demo
                </button>
              </div>

              {/* Tech Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/20">
                {[
                  { stat: "99.9%", label: "Uptime SLA" },
                  { stat: "<50ms", label: "Response time" },
                  { stat: "256-bit", label: "Encryption" },
                  { stat: "AI-Powered", label: "Analytics" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-white mb-2">{item.stat}</div>
                    <div className="text-blue-200 text-sm font-bold uppercase tracking-wide">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
