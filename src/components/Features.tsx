
import React from 'react';
import { BarChart3, Palette, Zap, Shield, Globe, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track scans, locations, devices, and user behavior with detailed insights and real-time reporting.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Design QR codes with your brand colors, logos, and custom frames to maintain brand consistency.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Bulk Generation',
      description: 'Create thousands of QR codes instantly with CSV import and API integration for large-scale campaigns.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SSL encryption, password protection, and expiration dates ensure your QR codes are secure.',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: Globe,
      title: 'Dynamic Content',
      description: 'Update QR code destinations anytime without reprinting. Perfect for evolving campaigns.',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share QR codes across teams with role-based permissions and collaborative workspace features.',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help businesses create, manage, and optimize 
            their QR code campaigns for maximum impact and ROI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mb-6`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Marketing?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses using ClearQR.io to create engaging, 
              trackable QR code experiences that drive real results.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
