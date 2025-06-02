
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload & Design",
      description: "Upload your marketing materials and use our intuitive drag-and-drop editor to position QR codes exactly where you want them with perfect precision.",
      features: ["Drag & drop editor", "Template library", "Brand customization"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      accentColor: "blue"
    },
    {
      number: "02", 
      title: "Generate & Deploy",
      description: "Create single campaigns or bulk generate thousands of unique, trackable QR codes from CSV data with automated workflows and smart targeting.",
      features: ["Bulk generation", "CSV import", "API integration"],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      accentColor: "purple"
    },
    {
      number: "03",
      title: "Track & Optimize",
      description: "Monitor real-time analytics, track scan locations, device data, and campaign performance to optimize your marketing ROI with actionable insights.",
      features: ["Real-time analytics", "Location tracking", "Performance optimization"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      accentColor: "green"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform your marketing materials into{' '}
            <span className="font-semibold text-blue-600">trackable, data-driven campaigns</span>{' '}
            in three simple steps that deliver{' '}
            <span className="font-semibold text-purple-600">measurable results</span>.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-start gap-12">
              {/* Step Number and Content */}
              <div className="flex-1">
                <div className="flex items-start gap-6 mb-8">
                  <div className="text-6xl font-bold text-gray-200">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {step.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-3">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`}></div>
                          <span className="text-gray-700 font-medium">{feature}</span>
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
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-2xl shadow-xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Transform Your Marketing?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful businesses using our platform to create engaging, trackable QR experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
