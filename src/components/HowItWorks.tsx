
import React from 'react';
import { Upload, QrCode, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload & Design",
      description: "Upload your marketing materials and use our intuitive drag-and-drop editor to position QR codes exactly where you want them with perfect precision.",
      icon: Upload,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      features: ["Drag & drop editor", "Template library", "Brand customization"]
    },
    {
      number: "02", 
      title: "Generate & Deploy",
      description: "Create single campaigns or bulk generate thousands of unique, trackable QR codes from CSV data with automated workflows and smart targeting.",
      icon: QrCode,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      features: ["Bulk generation", "CSV import", "API integration"]
    },
    {
      number: "03",
      title: "Track & Optimize",
      description: "Monitor real-time analytics, track scan locations, device data, and campaign performance to optimize your marketing ROI with actionable insights.",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      features: ["Real-time analytics", "Location tracking", "Performance optimization"]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-72 h-72 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200/50 shadow-sm mb-6">
            <span>🚀 Simple Process</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            How It Works
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform your marketing materials into trackable, data-driven campaigns 
            in three simple steps that deliver measurable results.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform translate-x-6 z-10">
                  <ArrowRight className="absolute -right-3 -top-3 h-6 w-6 text-gray-400 bg-white rounded-full p-1" />
                </div>
              )}
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 lg:p-10 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 group">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-0 group-hover:opacity-30 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className="relative text-center space-y-6">
                  {/* Step Number */}
                  <div className="relative inline-block">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.bgColor} border border-gray-200/50`}>
                    <step.icon className={`h-10 w-10 text-gray-700`} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      {step.description}
                    </p>
                    
                    {/* Features list */}
                    <div className="space-y-3">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl p-12 border border-blue-100/50 shadow-xl">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful businesses who have transformed their marketing 
              with our powerful QR code platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Start Free Trial
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
