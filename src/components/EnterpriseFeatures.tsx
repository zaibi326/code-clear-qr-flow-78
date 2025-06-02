
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, BarChart3, Palette, Shield, Users, Globe } from 'lucide-react';

const EnterpriseFeatures = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Dynamic QR Generation",
      description: "Create smart QR codes that can be updated without reprinting. Change destinations, content, and tracking parameters in real-time.",
      color: "blue",
      highlight: "Update anytime"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Get detailed insights on scan performance, user demographics, device types, and geographic data with GDPR compliance.",
      color: "green",
      highlight: "GDPR Compliant"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Brand Customization",
      description: "Design QR codes that match your brand with custom colors, logos, frames, and call-to-action overlays.",
      color: "purple",
      highlight: "White-label ready"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Bulk Management",
      description: "Generate thousands of QR codes simultaneously with CSV import, template systems, and automated campaign deployment.",
      color: "orange",
      highlight: "Enterprise scale"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Digital Business Cards",
      description: "Create contactless networking experiences with smart business cards that instantly share contact information.",
      color: "indigo",
      highlight: "Contactless networking"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global CDN & API",
      description: "Lightning-fast QR code generation and scanning worldwide with 99.9% uptime and comprehensive API access.",
      color: "teal",
      highlight: "99.9% uptime"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-semibold mb-6">
            <Zap className="h-4 w-4" />
            <span>Core Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional QR Solutions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade features designed for marketing teams, event organizers, and businesses that demand performance and reliability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <CardContent className="p-8">
                {/* Feature Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-${feature.color}-600`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Feature Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {feature.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full bg-${feature.color}-100 text-${feature.color}-700`}>
                      {feature.highlight}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <span className="font-bold text-lg">See All Features</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseFeatures;
