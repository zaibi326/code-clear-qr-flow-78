
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Bug, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Changelog = () => {
  const releases = [
    {
      version: '2.4.0',
      date: '2024-01-15',
      type: 'major',
      changes: [
        { type: 'feature', icon: Plus, text: 'New bulk QR code generation with CSV import' },
        { type: 'feature', icon: Zap, text: 'Advanced analytics dashboard with real-time insights' },
        { type: 'improvement', icon: Star, text: 'Enhanced QR code customization options' },
        { type: 'fix', icon: Bug, text: 'Fixed issue with QR code scanning on iOS devices' }
      ]
    },
    {
      version: '2.3.2',
      date: '2024-01-08',
      type: 'patch',
      changes: [
        { type: 'fix', icon: Bug, text: 'Resolved campaign creation bug in Firefox' },
        { type: 'improvement', icon: Zap, text: 'Improved page load speeds by 40%' },
        { type: 'security', icon: Shield, text: 'Enhanced API security with rate limiting' }
      ]
    },
    {
      version: '2.3.1',
      date: '2024-01-01',
      type: 'patch',
      changes: [
        { type: 'fix', icon: Bug, text: 'Fixed dashboard rendering issue on mobile devices' },
        { type: 'improvement', icon: Star, text: 'Updated QR code generation algorithms for better reliability' }
      ]
    },
    {
      version: '2.3.0',
      date: '2023-12-20',
      type: 'minor',
      changes: [
        { type: 'feature', icon: Plus, text: 'Campaign scheduler for automated QR code campaigns' },
        { type: 'feature', icon: Plus, text: 'Template library with 50+ professional designs' },
        { type: 'improvement', icon: Zap, text: 'Redesigned user interface for better usability' },
        { type: 'fix', icon: Bug, text: 'Fixed export functionality for large datasets' }
      ]
    },
    {
      version: '2.2.0',
      date: '2023-12-10',
      type: 'minor',
      changes: [
        { type: 'feature', icon: Plus, text: 'Multi-language support (English, Spanish, French, German)' },
        { type: 'feature', icon: Plus, text: 'API webhooks for real-time scan notifications' },
        { type: 'improvement', icon: Star, text: 'Enhanced data visualization in analytics' }
      ]
    }
  ];

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-red-100 text-red-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      case 'patch': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'feature': return { icon: Plus, color: 'text-green-600' };
      case 'improvement': return { icon: Star, color: 'text-blue-600' };
      case 'fix': return { icon: Bug, color: 'text-orange-600' };
      case 'security': return { icon: Shield, color: 'text-purple-600' };
      default: return { icon: Zap, color: 'text-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Changelog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and bug fixes
            </p>
            <div className="mt-6">
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Changelog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {releases.map((release, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl font-bold">v{release.version}</span>
                    <Badge className={getVersionBadgeColor(release.type)}>
                      {release.type}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{release.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {release.changes.map((change, changeIndex) => {
                    const iconData = getChangeIcon(change.type);
                    return (
                      <div key={changeIndex} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <iconData.icon className={`h-4 w-4 ${iconData.color}`} />
                        </div>
                        <span className="text-gray-700">{change.text}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-gray-600 mb-6">
              Get notified about new releases and features directly in your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Changelog;
