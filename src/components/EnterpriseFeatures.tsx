
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, BarChart3, Palette, Shield, Users, Globe, Smartphone, Database, Settings, Cloud } from 'lucide-react';

const EnterpriseFeatures = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Dynamic QR Codes",
      description: "Create smart QR codes that update in real-time without reprinting. Perfect for evolving campaigns and instant content updates.",
      color: "blue",
      highlight: "Real-time updates",
      stats: "50% faster campaigns"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive tracking with geographic data, device insights, scan timing, and conversion metrics for data-driven decisions.",
      color: "green",
      highlight: "Deep insights",
      stats: "360° view analytics"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Custom Branding",
      description: "Design QR codes that perfectly match your brand with custom colors, logos, frames, and professional styling options.",
      color: "purple",
      highlight: "Brand consistency",
      stats: "Unlimited customization"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Bulk Management",
      description: "Generate thousands of unique QR codes simultaneously with CSV import, automated workflows, and team collaboration tools.",
      color: "orange",
      highlight: "Scale effortlessly",
      stats: "10,000+ codes/batch"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Military-grade encryption, SSO integration, access controls, and compliance with GDPR, CCPA, and enterprise standards.",
      color: "red",
      highlight: "Bank-level security",
      stats: "99.9% secure"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global CDN",
      description: "Lightning-fast QR code delivery worldwide with 99.99% uptime, edge computing, and optimized performance everywhere.",
      color: "teal",
      highlight: "Global reach",
      stats: "200+ edge locations"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Optimization",
      description: "Perfect mobile experience with responsive design, native app support, and optimized scanning across all devices.",
      color: "indigo",
      highlight: "Mobile-first",
      stats: "95% mobile compatibility"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "API Integration",
      description: "Powerful REST API with webhooks, real-time data sync, and seamless integration with your existing tech stack.",
      color: "pink",
      highlight: "Developer-friendly",
      stats: "Full API access"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Smart Automation",
      description: "Intelligent workflows with triggered actions, automated responses, and AI-powered optimization for maximum efficiency.",
      color: "yellow",
      highlight: "AI-powered",
      stats: "80% time savings"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full text-blue-700 font-bold mb-8 shadow-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Powerful Features</span>
            <Cloud className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Everything You Need for{' '}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Professional QR Solutions
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Enterprise-grade features designed for marketing teams, event organizers, and businesses that demand 
            <span className="font-bold text-blue-600"> performance</span> and <span className="font-bold text-purple-600">reliability</span>.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-white/95 backdrop-blur-sm hover:bg-white border border-gray-200/50 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden relative"
            >
              <CardContent className="p-0">
                {/* Header with enhanced gradient background */}
                <div className={`bg-gradient-to-br from-${feature.color}-50 via-white to-${feature.color}-100 p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-18 h-18 rounded-3xl bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-6 text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-700 transition-colors">
                        {feature.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full bg-${feature.color}-100 text-${feature.color}-700 border border-${feature.color}-200`}>
                        {feature.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {feature.description}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-${feature.color}-50 to-${feature.color}-100 border border-${feature.color}-200 px-4 py-2 rounded-full`}>
                    <div className={`w-2 h-2 bg-${feature.color}-500 rounded-full animate-pulse`}></div>
                    <span className={`text-${feature.color}-700 font-bold text-sm`}>{feature.stats}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-12 rounded-3xl shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white/20 to-transparent"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                Ready to Transform Your Business?
              </h3>
              <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of successful businesses using our platform to create engaging, trackable QR experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <span className="mr-3">Start Free Trial</span>
                  <Zap className="h-5 w-5 inline group-hover:rotate-12 transition-transform" />
                </button>
                <button className="border-2 border-white text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 group">
                  <Settings className="h-5 w-5 inline mr-3 group-hover:rotate-90 transition-transform" />
                  <span>Explore Features</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseFeatures;
