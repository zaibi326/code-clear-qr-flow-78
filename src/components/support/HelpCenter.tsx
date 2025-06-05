
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Video, MessageCircle, ExternalLink, Phone, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HelpCenterProps {
  onNewTicket?: () => void;
}

export function HelpCenter({ onNewTicket }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

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
      category: 'Getting Started',
      url: '/help/first-qr-code'
    },
    {
      title: 'Understanding QR code analytics',
      views: 980,
      category: 'Analytics',
      url: '/help/analytics-guide'
    },
    {
      title: 'Bulk QR code generation from CSV',
      views: 756,
      category: 'QR Management',
      url: '/help/bulk-generation'
    },
    {
      title: 'Setting up tracking for campaigns',
      views: 643,
      category: 'Campaigns',
      url: '/help/campaign-tracking'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Searching Help Articles",
        description: `Searching for "${searchQuery}"...`,
      });
      console.log('Searching for:', searchQuery);
    }
  };

  const handleVideoTutorials = () => {
    toast({
      title: "Opening Video Tutorials",
      description: "Redirecting to our video tutorial library...",
    });
    console.log('Opening video tutorials');
  };

  const handleLiveChat = () => {
    toast({
      title: "Starting Live Chat",
      description: "Connecting you with our support team...",
    });
    console.log('Starting live chat');
  };

  const handleDocumentation = () => {
    toast({
      title: "Opening Documentation",
      description: "Redirecting to detailed documentation...",
    });
    console.log('Opening documentation');
  };

  const handleCategoryClick = (category: typeof helpCategories[0]) => {
    toast({
      title: `${category.title} Articles`,
      description: `Viewing ${category.articles} articles in this category`,
    });
    console.log('Category clicked:', category.title);
  };

  const handleArticleClick = (article: typeof popularArticles[0]) => {
    toast({
      title: "Opening Article",
      description: `Reading: ${article.title}`,
    });
    console.log('Article clicked:', article.title);
  };

  const handleContactSupport = () => {
    if (onNewTicket) {
      onNewTicket();
    } else {
      toast({
        title: "Contact Support",
        description: "Redirecting to support ticket form...",
      });
    }
    console.log('Contact support clicked');
  };

  const handleScheduleCall = () => {
    toast({
      title: "Schedule a Call",
      description: "Opening calendar to schedule a support call...",
    });
    console.log('Schedule call clicked');
  };

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search help articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleVideoTutorials}
        >
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Watch step-by-step guides</p>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleLiveChat}
        >
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team</p>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleDocumentation}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-600">Browse detailed docs</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Categories */}
      {filteredCategories.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
            <CardDescription>
              Find help articles organized by topic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <div 
                  key={category.title} 
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
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
      )}

      {/* Popular Articles */}
      {filteredArticles.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>
              Most viewed help articles this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredArticles.map((article, index) => (
                <div 
                  key={article.title} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
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
      )}

      {/* No Results Message */}
      {searchQuery && filteredArticles.length === 0 && filteredCategories.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any articles matching "{searchQuery}". Try a different search term.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contact Options */}
      <Card className="shadow-sm bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleContactSupport} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" onClick={handleScheduleCall} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule a Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
