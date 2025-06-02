
import React from 'react';
import { Upload, Zap, BarChart3, ArrowRight, Sparkles, Target, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload & Design",
      description: "Upload your marketing materials and use our intuitive drag-and-drop editor to position QR codes exactly where you want them with perfect precision.",
      features: ["Drag & drop editor", "Template library", "Brand customization"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      number: "02",
      icon: Zap,
      title: "Generate & Deploy",
      description: "Create single campaigns or bulk generate thousands of unique, trackable QR codes from CSV data with automated workflows and smart targeting.",
      features: ["Bulk generation", "CSV import", "API integration"],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      number: "03",
      icon: BarChart3,
      title: "Track & Optimize",
      description: "Monitor real-time analytics, track scan locations, device data, and campaign performance to optimize your marketing ROI with actionable insights.",
      features: ["Real-time analytics", "Location tracking", "Performance optimization"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-700 text-lg font-bold mb-8 shadow-lg backdrop-blur-sm">
            <Rocket className="h-5 w-5 mr-2" />
            <span>Simple Process</span>
            <Sparkles className="h-5 w-5 ml-2" />
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            How It{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            Transform your marketing materials into <span className="font-semibold text-blue-600">trackable, data-driven campaigns</span> in three simple steps that deliver measurable results.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Content */}
              <div className="flex-1 space-y-8">
                <div className="flex items-center space-x-6">
                  <div className={`text-8xl font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-30`}>
                    {step.number}
                  </div>
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <h3 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">{step.title}</h3>
                <p className="text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">{step.description}</p>
                
                <div className="space-y-4">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-4 group">
                      <div className={`w-3 h-3 bg-gradient-to-r ${step.color} rounded-full group-hover:scale-125 transition-transform`}></div>
                      <span className="text-xl text-gray-700 font-semibold group-hover:text-gray-900 transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <button className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${step.color} text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 group`}>
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Enhanced Visual */}
              <div className="flex-1">
                <div className={`bg-gradient-to-br ${step.bgColor} rounded-3xl p-12 h-96 flex items-center justify-center shadow-2xl border border-white/50 backdrop-blur-sm hover:scale-105 transition-all duration-500 group relative overflow-hidden`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  
                  <div className="text-center relative z-10">
                    <div className={`w-32 h-32 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                      <step.icon className="h-16 w-16 text-white" />
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-4">{step.title}</div>
                    <div className={`text-lg font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      Step {step.number}
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className={`absolute top-6 right-6 w-4 h-4 bg-gradient-to-r ${step.color} rounded-full opacity-60 group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`absolute bottom-8 left-8 w-6 h-6 bg-gradient-to-r ${step.color} rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500 delay-200`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center mt-32">
          <div className="bg-gradient-to-r from-white to-blue-50 rounded-3xl p-12 shadow-2xl border border-white/50 backdrop-blur-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full text-green-700 text-lg font-bold mb-8">
                <Target className="h-5 w-5 mr-2" />
                <span>Ready to Start?</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto font-light">
                Join thousands of successful businesses who have transformed their marketing with our powerful QR code platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:scale-105 group">
                  <span className="mr-3">Start Free Trial</span>
                  <ArrowRight className="h-6 w-6 inline group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 group">
                  <Sparkles className="h-6 w-6 inline mr-3 group-hover:rotate-12 transition-transform" />
                  <span>Schedule Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
