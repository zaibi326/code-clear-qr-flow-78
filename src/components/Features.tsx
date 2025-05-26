
import React from 'react';
import { BarChart3, Palette, Zap, Shield, Globe, Users, ArrowRight } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get deep insights with real-time tracking, location data, device information, and comprehensive reporting dashboards.',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'from-blue-500 to-blue-600'
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Design stunning QR codes with your brand colors, logos, custom frames, and perfect visual integration.',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Bulk Generation',
      description: 'Create thousands of unique QR codes instantly with CSV import, API integration, and automated workflows.',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSL encryption, password protection, access controls, and compliance features.',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      iconBg: 'from-red-500 to-red-600'
    },
    {
      icon: Globe,
      title: 'Dynamic Content',
      description: 'Update destinations anytime without reprinting. Perfect for evolving campaigns and A/B testing.',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      iconBg: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless teamwork with role-based permissions, shared workspaces, and collaborative campaign management.',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200/50 shadow-sm mb-6">
            <span>✨ Powerful Features</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Powerful features designed to help businesses create, manage, and optimize 
            their QR code campaigns for maximum impact and measurable ROI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 lg:p-10 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200/50 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-30 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className="relative">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.iconBg} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  {feature.description}
                </p>

                <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl p-12 border border-blue-100/50 shadow-xl">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Marketing?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses using ClearQR.io to create engaging, 
              trackable QR code experiences that drive real results and measurable growth.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group">
              Start Your Free Trial
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
