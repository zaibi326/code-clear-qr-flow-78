
import React from 'react';
import { Users, Award, Globe, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Active Users",
      description: "Businesses trust our platform"
    },
    {
      icon: Award,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable service guarantee"
    },
    {
      icon: Globe,
      number: "50+",
      label: "Countries",
      description: "Global reach and impact"
    },
    {
      icon: Zap,
      number: "1M+",
      label: "QR Codes",
      description: "Generated monthly"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ClearQR.io
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                We're on a mission to bridge the physical and digital worlds through 
                innovative QR code solutions that drive meaningful connections and measurable results.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2023, ClearQR.io has quickly become the go-to platform for businesses 
                looking to enhance their marketing strategies with dynamic, trackable QR codes. 
                Our team of experts is dedicated to providing cutting-edge technology with 
                unparalleled ease of use.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-700">
                To empower businesses with intelligent QR code solutions that create 
                seamless customer experiences and drive growth through data-driven insights.
              </p>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
