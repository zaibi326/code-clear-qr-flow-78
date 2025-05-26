
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Video, MessageCircle, ExternalLink } from 'lucide-react';

export function HelpCenter() {
  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      articles: 8,
      icon: FileText
    },
    {
      title: 'QR Code Management',
      description: 'Create, customize, and manage your QR codes',
      articles: 12,
      icon: FileText
    },
    {
      title: 'Campaign Creation',
      description: 'Build effective marketing campaigns',
      articles: 6,
      icon: FileText
    },
    {
      title: 'Analytics & Tracking',
      description: 'Understand your QR code performance',
      articles: 5,
      icon: FileText
    }
  ];

  const popularArticles = [
    {
      title: 'How to create your first QR code',
      views: 1250,
      category: 'Getting Started'
    },
    {
      title: 'Understanding QR code analytics',
      views: 980,
      category: 'Analytics'
    },
    {
      title: 'Bulk QR code generation from CSV',
      views: 756,
      category: 'QR Management'
    },
    {
      title: 'Setting up tracking for campaigns',
      views: 643,
      category: 'Campaigns'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search help articles..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Watch step-by-step guides</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-600">Browse detailed docs</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Categories */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Browse by Category</CardTitle>
          <CardDescription>
            Find help articles organized by topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpCategories.map((category) => (
              <div key={category.title} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <category.icon className="h-5 w-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{category.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {category.articles} articles
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Articles */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Popular Articles</CardTitle>
          <CardDescription>
            Most viewed help articles this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div key={article.title} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{article.views} views</span>
                    </div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <Card className="shadow-sm bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="default">
              Contact Support
            </Button>
            <Button variant="outline">
              Schedule a Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
