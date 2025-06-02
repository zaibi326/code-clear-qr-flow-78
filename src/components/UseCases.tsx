
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Megaphone, ShoppingBag, Heart, GraduationCap, Building2 } from 'lucide-react';

const UseCases = () => {
  const useCases = [
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Events & Conferences",
      description: "Streamline check-ins, share schedules, and collect feedback with contactless QR solutions.",
      benefits: ["Instant check-in", "Digital tickets", "Real-time updates"],
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: <Megaphone className="h-10 w-10" />,
      title: "Marketing Campaigns",
      description: "Bridge offline and online marketing with trackable QR codes that drive engagement.",
      benefits: ["Campaign tracking", "A/B testing", "ROI measurement"],
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: <ShoppingBag className="h-10 w-10" />,
      title: "Retail & E-commerce",
      description: "Connect physical products to digital experiences, reviews, and exclusive offers.",
      benefits: ["Product info", "Customer reviews", "Loyalty programs"],
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Healthcare",
      description: "Enable contactless patient check-ins, form submissions, and health information sharing.",
      benefits: ["Patient check-in", "Health forms", "HIPAA compliant"],
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100"
    },
    {
      icon: <GraduationCap className="h-10 w-10" />,
      title: "Education",
      description: "Facilitate remote learning, assignment submissions, and campus navigation.",
      benefits: ["Course materials", "Attendance tracking", "Campus navigation"],
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100"
    },
    {
      icon: <Building2 className="h-10 w-10" />,
      title: "Hospitality",
      description: "Enhance guest experiences with digital menus, room service, and contactless payments.",
      benefits: ["Digital menus", "Room service", "Guest feedback"],
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-700 font-semibold mb-6 border border-slate-200">
            <Building2 className="h-4 w-4" />
            <span>Industry Solutions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted Across{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Every Industry
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From startups to Fortune 500 companies, see how businesses use our QR solutions to drive engagement and growth.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="group bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200/50 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Header with gradient background */}
                <div className={`bg-gradient-to-br ${useCase.bgGradient} p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {useCase.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {useCase.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {useCase.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Key Benefits:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {useCase.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50,000+", label: "Active Businesses" },
              { number: "200+", label: "Industries Served" },
              { number: "5M+", label: "Monthly Scans" },
              { number: "99.9%", label: "Uptime SLA" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
