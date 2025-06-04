
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  MapPin, 
  Ticket, 
  Network,
  Clock,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Events = () => {
  const features = [
    {
      icon: Ticket,
      title: 'Digital Tickets',
      description: 'Generate secure QR code tickets that prevent fraud and enable instant validation.'
    },
    {
      icon: CheckCircle,
      title: 'Easy Check-in',
      description: 'Speed up event entry with quick QR code scanning for seamless attendee check-in.'
    },
    {
      icon: MapPin,
      title: 'Venue Information',
      description: 'Provide instant access to maps, schedules, and venue details through QR codes.'
    },
    {
      icon: Network,
      title: 'Networking',
      description: 'Enable attendee networking with QR codes that share contact information instantly.'
    },
    {
      icon: Calendar,
      title: 'Schedule Access',
      description: 'Share event schedules and updates that attendees can access anytime.'
    },
    {
      icon: Share2,
      title: 'Social Sharing',
      description: 'Encourage social media engagement with QR codes linking to event hashtags.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white">Event Solutions</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Streamline Your Events with QR Codes
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              From ticketing to networking, QR codes make events more efficient and engaging for organizers and attendees
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Link to="/case-studies">View Case Studies</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Successful Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive QR code solutions for every aspect of your event
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to implement QR codes in your events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Event</h3>
              <p className="text-gray-600">Set up your event details and ticket types</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Generate QR Codes</h3>
              <p className="text-gray-600">Create unique QR codes for tickets and information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Distribute</h3>
              <p className="text-gray-600">Send tickets and share event information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Track & Analyze</h3>
              <p className="text-gray-600">Monitor attendance and engagement in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Event Organizers Love QR Codes
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Reduced Wait Times</h3>
                    <p className="text-gray-600">Speed up check-in process by up to 80%</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Analytics</h3>
                    <p className="text-gray-600">Track attendance and engagement instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Cost Savings</h3>
                    <p className="text-gray-600">Reduce printing and staffing costs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Enhanced Security</h3>
                    <p className="text-gray-600">Prevent ticket fraud with unique codes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Success Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check-in Speed</span>
                  <span className="font-bold text-green-600">+80% Faster</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attendee Satisfaction</span>
                  <span className="font-bold text-blue-600">95% Positive</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cost Reduction</span>
                  <span className="font-bold text-purple-600">40% Lower</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Staff Efficiency</span>
                  <span className="font-bold text-orange-600">+60% Better</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Events?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers using QR codes for seamless event management
          </p>
          <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Link to="/register">Start Your Free Trial</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Events;
