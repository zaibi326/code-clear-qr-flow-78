
import React from 'react';
import { Star, Quote, TrendingUp, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsStats = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "VP of Marketing",
      company: "TechFlow Inc.",
      content: "ClearQR transformed our event marketing. We saw a 340% increase in engagement and tracked every interaction in real-time. The enterprise features are exactly what we needed.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c7ea?w=80&h=80&fit=crop&crop=face",
      stats: "340% engagement increase"
    },
    {
      name: "Marcus Rodriguez",
      role: "Operations Director",
      company: "Global Events Ltd",
      content: "Managing 50+ simultaneous events became effortless with ClearQR's bulk generation and analytics. The GDPR compliance gives us confidence with international clients.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      stats: "50+ events managed"
    },
    {
      name: "Emily Chen",
      role: "Digital Strategy Lead",
      company: "RetailMax Corp",
      content: "Our contactless customer experience improved dramatically. QR codes on packaging drove 2.3M additional product page visits and increased sales by 28%.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      stats: "2.3M additional visits"
    }
  ];

  const stats = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      number: "5,847,291",
      label: "QR Scans This Month",
      trend: "+23%",
      color: "blue"
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: "50,000+",
      label: "Active Enterprise Users",
      trend: "+45%",
      color: "green"
    },
    {
      icon: <Award className="h-8 w-8" />,
      number: "99.9%",
      label: "Platform Uptime",
      trend: "SLA Met",
      color: "purple"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-700 font-semibold mb-6">
            <Star className="h-4 w-4" />
            <span>Customer Success</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how enterprise teams achieve remarkable results with our QR code platform.
          </p>
        </div>

        {/* Live Stats Row */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-100 flex items-center justify-center mx-auto mb-4`}>
                  <div className={`text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium mb-3">
                  {stat.label}
                </div>
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-blue-600/20" />
                </div>

                {/* Rating */}
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                  "{testimonial.content}"
                </p>

                {/* Stats Badge */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                  <div className="text-center">
                    <div className="text-blue-700 font-bold text-sm">{testimonial.stats}</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
                    <p className="text-sm text-blue-600 font-semibold">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join 50,000+ businesses already growing with ClearQR
            </h3>
            <p className="text-blue-100 text-lg mb-6">
              Start your free trial today and see why enterprise teams choose our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsStats;
