
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Shield, 
  FileText, 
  Calendar, 
  Users, 
  Pill,
  Stethoscope,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Healthcare = () => {
  const solutions = [
    {
      icon: FileText,
      title: 'Patient Records',
      description: 'Securely access patient information and medical history with encrypted QR codes.'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Streamline appointment scheduling with QR codes linking to booking systems.'
    },
    {
      icon: Pill,
      title: 'Medication Tracking',
      description: 'Track medication adherence and provide dosage instructions via QR codes.'
    },
    {
      icon: Shield,
      title: 'Contact Tracing',
      description: 'Implement efficient contact tracing systems for public health safety.'
    },
    {
      icon: Users,
      title: 'Visitor Management',
      description: 'Manage hospital visitors and staff with secure QR code check-ins.'
    },
    {
      icon: Stethoscope,
      title: 'Equipment Tracking',
      description: 'Track medical equipment location and maintenance schedules efficiently.'
    }
  ];

  const benefits = [
    {
      title: 'Enhanced Security',
      description: 'HIPAA-compliant QR codes with encryption ensure patient data privacy.',
      icon: Lock,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Improved Efficiency',
      description: 'Reduce administrative burden and streamline healthcare workflows.',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Better Patient Care',
      description: 'Faster access to information leads to improved patient outcomes.',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white">Healthcare Solutions</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Secure Healthcare QR Solutions
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              HIPAA-compliant QR code solutions for modern healthcare facilities and patient management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/case-studies">Healthcare Case Studies</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare QR Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, compliant, and efficient QR code solutions designed specifically for healthcare environments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <solution.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{solution.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Healthcare Providers Choose QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Proven benefits for healthcare organizations and patients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-16 h-16 ${benefit.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                HIPAA Compliant & Secure
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">End-to-End Encryption</h3>
                    <p className="text-gray-600">All patient data is encrypted at rest and in transit</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Access Controls</h3>
                    <p className="text-gray-600">Role-based access ensures only authorized personnel can view data</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Audit Trails</h3>
                    <p className="text-gray-600">Complete audit logs for compliance and security monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Heart className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">HIPAA Compliance</h3>
                    <p className="text-gray-600">Fully compliant with healthcare privacy regulations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Healthcare Impact</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">45%</div>
                  <div className="text-gray-600">Reduction in admin time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                  <div className="text-gray-600">Faster patient check-in</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Data accuracy improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">30%</div>
                  <div className="text-gray-600">Cost reduction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Implementation Process
            </h2>
            <p className="text-xl text-gray-600">
              We handle the technical complexity while ensuring full compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Assessment</h3>
              <p className="text-gray-600">Evaluate your current systems and compliance requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Integration</h3>
              <p className="text-gray-600">Seamlessly integrate with existing healthcare systems</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Training</h3>
              <p className="text-gray-600">Comprehensive staff training and support</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Launch</h3>
              <p className="text-gray-600">Go live with ongoing support and monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Modernize Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join forward-thinking healthcare providers using secure QR solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/register">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/support">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Healthcare;
