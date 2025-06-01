
import React from 'react';
import { BarChart3, Palette, Upload, Shield, RefreshCw, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights with real-time tracking, location data, device information, and comprehensive reporting dashboards.",
      link: "Learn more"
    },
    {
      icon: Palette,
      title: "Custom Branding",
      description: "Design stunning QR codes with your brand colors, logos, custom frames, and perfect visual integration.",
      link: "Learn more"
    },
    {
      icon: Upload,
      title: "Bulk Generation",
      description: "Create thousands of unique QR codes instantly with CSV import, API integration, and automated workflows.",
      link: "Learn more"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SSL encryption, password protection, access controls, and compliance features.",
      link: "Learn more"
    },
    {
      icon: RefreshCw,
      title: "Dynamic Content",
      description: "Update destinations anytime without reprinting. Perfect for evolving campaigns and A/B testing.",
      link: "Learn more"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless teamwork with role-based permissions, shared workspaces, and collaborative campaign management.",
      link: "Learn more"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
            ✨ Powerful Features
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help businesses create, manage, and optimize their QR code campaigns for maximum impact and measurable ROI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
              
              <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                {feature.link} →
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Marketing?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of businesses using ClearQR.io to create engaging, trackable QR code experiences that drive real results and measurable growth.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
