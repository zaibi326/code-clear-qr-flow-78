
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Bug, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Changelog = () => {
  const updates = [
    {
      version: 'v2.1.0',
      date: '2024-05-15',
      type: 'feature',
      title: 'Bulk QR Code Generation',
      description: 'Generate thousands of QR codes from CSV files with advanced customization options.'
    },
    {
      version: 'v2.0.5',
      date: '2024-05-10',
      type: 'improvement',
      title: 'Enhanced Analytics Dashboard',
      description: 'Improved performance and added new visualization options for better insights.'
    },
    {
      version: 'v2.0.4',
      date: '2024-05-05',
      type: 'fix',
      title: 'QR Code Scanning Issues',
      description: 'Fixed compatibility issues with certain QR code scanners and improved reliability.'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'feature': return Plus;
      case 'fix': return Bug;
      case 'improvement': return Zap;
      default: return Plus;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'feature': return 'default';
      case 'fix': return 'destructive';
      case 'improvement': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Changelog</h1>
          <p className="text-xl text-gray-600">Latest updates and improvements to ClearQR.io</p>
        </div>

        <div className="space-y-6">
          {updates.map((update, index) => {
            const Icon = getIcon(update.type);
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{update.title}</CardTitle>
                        <CardDescription>{update.date}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getBadgeVariant(update.type)}>
                        {update.type}
                      </Badge>
                      <Badge variant="outline">{update.version}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{update.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Changelog;
