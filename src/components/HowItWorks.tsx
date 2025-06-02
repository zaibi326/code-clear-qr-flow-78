
import React from 'react';
import { Upload, Zap, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload & Design",
      description: "Upload your marketing materials and use our intuitive drag-and-drop editor to position QR codes exactly where you want them with perfect precision.",
      features: ["Drag & drop editor", "Template library", "Brand customization"]
    },
    {
      number: "02",
      icon: Zap,
      title: "Generate & Deploy",
      description: "Create single campaigns or bulk generate thousands of unique, trackable QR codes from CSV data with automated workflows and smart targeting.",
      features: ["Bulk generation", "CSV import", "API integration"]
    },
    {
      number: "03",
      icon: BarChart3,
      title: "Track & Optimize",
      description: "Monitor real-time analytics, track scan locations, device data, and campaign performance to optimize your marketing ROI with actionable insights.",
      features: ["Real-time analytics", "Location tracking", "Performance optimization"]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
            🚀 Simple Process
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your marketing materials into trackable, data-driven campaigns in three simple steps that deliver measurable results.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl font-bold text-blue-100">{step.number}</div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-xl text-gray-600 leading-relaxed">{step.description}</p>
                
                <ul className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                  <div className="text-center">
                    <step.icon className="h-20 w-20 text-blue-600 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-gray-900">{step.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful businesses who have transformed their marketing with our powerful QR code platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Free Trial
              </button>
              <button className="border-2 border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
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
