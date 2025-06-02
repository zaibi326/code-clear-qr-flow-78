
import React from 'react';
import { Upload, Zap, BarChart3, ArrowRight, Sparkles, Target, Rocket, Users, Globe, Settings } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Design & Create",
      subtitle: "Beautiful QR Codes",
      description: "Use our intuitive drag-and-drop editor to create stunning QR codes. Choose from hundreds of templates, customize colors, add your logo, and create codes that perfectly match your brand identity.",
      features: ["Drag & drop editor", "300+ templates", "Brand customization", "Real-time preview"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      accentColor: "blue"
    },
    {
      number: "02", 
      icon: Zap,
      title: "Deploy & Scale",
      subtitle: "Bulk Generation Made Easy",
      description: "Generate single campaigns or create thousands of unique QR codes from CSV data. Deploy across multiple channels with automated workflows, API integration, and smart targeting capabilities.",
      features: ["Bulk generation", "CSV import", "API integration", "Multi-channel deployment"],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      accentColor: "purple"
    },
    {
      number: "03",
      icon: BarChart3,
      title: "Track & Optimize",
      subtitle: "Data-Driven Insights",
      description: "Monitor performance with real-time analytics, geographic tracking, device insights, and conversion metrics. Use AI-powered recommendations to optimize campaigns and maximize ROI.",
      features: ["Real-time analytics", "Geographic tracking", "AI optimization", "ROI measurement"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      accentColor: "green"
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-32">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200/50 rounded-full text-blue-700 text-lg font-black mb-10 shadow-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <Rocket className="h-6 w-6 mr-3 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Simple Process</span>
            <Sparkles className="h-6 w-6 ml-3 text-purple-600 animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-10 leading-[0.9]">
            How It{' '}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-5xl mx-auto font-light leading-relaxed">
            Transform your marketing materials into <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">trackable, data-driven campaigns</span> 
            {' '}in three simple steps that deliver <span className="font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">measurable results</span>.
          </p>
        </div>

        {/* Enhanced Steps */}
        <div className="space-y-40">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Enhanced Content */}
              <div className="flex-1 space-y-10">
                <div className="flex items-center space-x-8">
                  <div className={`text-8xl md:text-9xl font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-20`}>
                    {step.number}
                  </div>
                  <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group`}>
                    <step.icon className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-3">{step.title}</h3>
                    <p className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>{step.subtitle}</p>
                  </div>
                  <p className="text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">{step.description}</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-black text-gray-900 mb-6">Key Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-4 group">
                        <div className={`w-4 h-4 bg-gradient-to-r ${step.color} rounded-full group-hover:scale-125 transition-transform shadow-lg`}></div>
                        <span className="text-xl text-gray-700 font-bold group-hover:text-gray-900 transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button className={`inline-flex items-center px-10 py-5 bg-gradient-to-r ${step.color} text-white font-black text-xl rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 group`}>
                    <span>Explore Step {step.number}</span>
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Enhanced Visual with Uniqode-style design */}
              <div className="flex-1">
                <div className={`bg-gradient-to-br ${step.bgColor} rounded-3xl p-16 h-[500px] flex items-center justify-center shadow-2xl border border-white/50 backdrop-blur-sm hover:scale-105 transition-all duration-500 group relative overflow-hidden`}>
                  {/* Enhanced background pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                  
                  <div className="text-center relative z-10">
                    <div className={`w-40 h-40 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                      <step.icon className="h-20 w-20 text-white" />
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-6">{step.title}</div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                      {step.subtitle}
                    </div>
                    <div className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-${step.accentColor}-200`}>
                      <div className={`w-3 h-3 bg-${step.accentColor}-500 rounded-full animate-pulse`}></div>
                      <span className="font-bold text-gray-700">Step {step.number}</span>
                    </div>
                  </div>

                  {/* Enhanced floating elements */}
                  <div className={`absolute top-8 right-8 w-6 h-6 bg-gradient-to-r ${step.color} rounded-full opacity-60 group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`absolute bottom-10 left-10 w-8 h-8 bg-gradient-to-r ${step.color} rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500 delay-200`}></div>
                  <div className={`absolute top-1/3 left-8 w-4 h-4 bg-gradient-to-r ${step.color} rotate-45 opacity-50 group-hover:rotate-90 transition-transform duration-600`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom CTA with Uniqode styling */}
        <div className="text-center mt-40">
          <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-3xl p-16 shadow-2xl border border-white/50 backdrop-blur-sm relative overflow-hidden max-w-6xl mx-auto">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(-45deg,rgba(147,51,234,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-full text-green-700 text-xl font-black mb-10">
                <Target className="h-6 w-6 mr-3" />
                <span>Ready to Get Started?</span>
                <Users className="h-6 w-6 ml-3" />
              </div>
              
              <h3 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                Join 50,000+ Businesses
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Already Growing with Us
                </span>
              </h3>
              <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
                Transform your marketing strategy with our comprehensive QR code platform. 
                Start your free trial today and experience the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-12 py-6 rounded-3xl font-black text-xl transition-all duration-300 shadow-2xl hover:scale-105 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="mr-4 relative z-10">Start Free Trial</span>
                  <ArrowRight className="h-6 w-6 inline group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
                <button className="border-3 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-12 py-6 rounded-3xl font-black text-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                  <Globe className="h-6 w-6 inline mr-4 group-hover:rotate-12 transition-transform" />
                  <span>Explore Platform</span>
                </button>
              </div>

              {/* Additional trust indicators */}
              <div className="flex flex-wrap justify-center gap-8 mt-12 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-bold">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-bold">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
