
import React from 'react';
import { Upload, QrCode, BarChart3, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Your Template",
      description: "Upload your marketing materials (PDF, PNG, JPG) and our drag-and-drop editor lets you position QR codes exactly where you want them.",
      icon: Upload,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02", 
      title: "Generate QR Campaigns",
      description: "Create single campaigns or bulk generate thousands of unique QR codes from CSV data. Each code is trackable and customizable.",
      icon: QrCode,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "03",
      title: "Track & Optimize",
      description: "Monitor real-time analytics, track scan locations, device data, and campaign performance to optimize your marketing ROI.",
      icon: BarChart3,
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your marketing materials into trackable, data-driven campaigns in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform translate-x-6">
                  <ArrowRight className="absolute -right-2 -top-2 h-4 w-4 text-gray-400" />
                </div>
              )}
              
              <div className="text-center space-y-6 group-hover:scale-105 transition-transform duration-300">
                {/* Step Number */}
                <div className="relative inline-block">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    {step.number}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping group-hover:animate-none"></div>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-10`}>
                  <step.icon className={`h-8 w-8 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-6 py-3 rounded-full text-sm font-medium border border-blue-200 shadow-sm">
            <span>Ready to get started?</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
