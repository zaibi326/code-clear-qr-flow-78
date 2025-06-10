
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, FileText, Video, MessageCircle, ExternalLink, Phone, Calendar, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HelpCenterProps {
  onNewTicket?: () => void;
}

export function HelpCenter({ onNewTicket }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'main' | 'category' | 'videos' | 'chat' | 'docs'>('main');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      articles: 8,
      icon: FileText,
      content: [
        { title: 'Creating your first account', description: 'Step-by-step guide to get started' },
        { title: 'Dashboard overview', description: 'Understanding your main dashboard' },
        { title: 'Basic QR code creation', description: 'Your first QR code in 5 minutes' },
        { title: 'Account verification', description: 'How to verify your email and phone' },
        { title: 'Profile setup', description: 'Complete your profile information' },
        { title: 'Navigation basics', description: 'Finding your way around the platform' },
        { title: 'Quick start checklist', description: 'Everything you need to do first' },
        { title: 'Common beginner mistakes', description: 'Avoid these common pitfalls' }
      ]
    },
    {
      title: 'QR Code Management',
      description: 'Create, customize, and manage your QR codes',
      articles: 12,
      icon: FileText,
      content: [
        { title: 'Creating dynamic QR codes', description: 'Learn about dynamic vs static QR codes' },
        { title: 'Customizing QR code design', description: 'Colors, logos, and styling options' },
        { title: 'Bulk QR code generation', description: 'Create multiple QR codes at once' },
        { title: 'QR code templates', description: 'Using and creating templates' },
        { title: 'Managing QR code folders', description: 'Organize your QR codes effectively' },
        { title: 'QR code expiration settings', description: 'Setting up time-based restrictions' },
        { title: 'Download formats and sizes', description: 'PNG, SVG, PDF options explained' },
        { title: 'QR code error correction', description: 'Understanding error correction levels' },
        { title: 'Password protection', description: 'Securing your QR codes' },
        { title: 'Landing page creation', description: 'Creating custom landing pages' },
        { title: 'QR code sharing', description: 'Sharing QR codes with team members' },
        { title: 'Archiving and deleting', description: 'Managing old QR codes' }
      ]
    },
    {
      title: 'Campaign Creation',
      description: 'Build effective marketing campaigns',
      articles: 6,
      icon: FileText,
      content: [
        { title: 'Campaign planning guide', description: 'How to plan effective QR campaigns' },
        { title: 'Multi-channel campaigns', description: 'Integrating QR codes across channels' },
        { title: 'Campaign templates', description: 'Pre-built campaign structures' },
        { title: 'A/B testing campaigns', description: 'Testing different QR code variations' },
        { title: 'Campaign scheduling', description: 'Timing your campaign launches' },
        { title: 'Campaign performance optimization', description: 'Improving campaign results' }
      ]
    },
    {
      title: 'Analytics & Tracking',
      description: 'Understand your QR code performance',
      articles: 5,
      icon: FileText,
      content: [
        { title: 'Analytics dashboard overview', description: 'Understanding your analytics data' },
        { title: 'Scan tracking and attribution', description: 'How scan tracking works' },
        { title: 'Geographic analytics', description: 'Location-based scan data' },
        { title: 'Device and browser analytics', description: 'Understanding your audience' },
        { title: 'Exporting analytics data', description: 'Getting your data in CSV/Excel format' }
      ]
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

  const videoTutorials = [
    { title: 'Getting Started with ClearQR', duration: '5:30', views: '2.3k' },
    { title: 'Creating Your First Dynamic QR Code', duration: '8:45', views: '1.8k' },
    { title: 'Advanced Customization Options', duration: '12:20', views: '1.2k' },
    { title: 'Analytics Dashboard Walkthrough', duration: '15:10', views: '950' },
    { title: 'Bulk QR Code Generation', duration: '7:25', views: '800' },
    { title: 'Campaign Management Best Practices', duration: '18:30', views: '650' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Filter results based on search query
    }
  };

  const handleVideoTutorials = () => {
    setActiveView('videos');
    console.log('Opening video tutorials');
  };

  const handleLiveChat = () => {
    setActiveView('chat');
    console.log('Opening live chat');
  };

  const handleDocumentation = () => {
    setActiveView('docs');
    console.log('Opening documentation');
  };

  const handleCategoryClick = (category: typeof helpCategories[0]) => {
    setSelectedCategory(category.title);
    setActiveView('category');
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

  const handleBackToMain = () => {
    setActiveView('main');
    setSelectedCategory(null);
  };

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentCategory = () => {
    return helpCategories.find(cat => cat.title === selectedCategory);
  };

  // Render different views based on activeView state
  if (activeView === 'videos') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={handleBackToMain} className="p-0 h-auto text-blue-600 hover:text-blue-700">
            ← Back to Help Center
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Video Tutorials
            </CardTitle>
            <CardDescription>
              Watch step-by-step video guides to master ClearQR features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoTutorials.map((video, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{video.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{video.duration}</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeView === 'chat') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={handleBackToMain} className="p-0 h-auto text-blue-600 hover:text-blue-700">
            ← Back to Help Center
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Live Chat Support
            </CardTitle>
            <CardDescription>
              Connect with our support team for real-time assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chat with Support</h3>
              <p className="text-gray-600 mb-6">Our support team is available 24/7 to help you with any questions.</p>
              <Button className="bg-green-600 hover:bg-green-700">
                Start Live Chat
              </Button>
              <div className="mt-4 text-sm text-gray-500">
                Average response time: 2 minutes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeView === 'docs') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={handleBackToMain} className="p-0 h-auto text-blue-600 hover:text-blue-700">
            ← Back to Help Center
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Documentation
            </CardTitle>
            <CardDescription>
              Comprehensive guides and API documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">User Guides</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium">Complete User Manual</div>
                    <div className="text-sm text-gray-600">Everything you need to know</div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium">Quick Reference Guide</div>
                    <div className="text-sm text-gray-600">Essential features at a glance</div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium">Best Practices</div>
                    <div className="text-sm text-gray-600">Tips for optimal results</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">API Documentation</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium">REST API Reference</div>
                    <div className="text-sm text-gray-600">Complete API documentation</div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium">Code Examples</div>
                    <div className="text-sm text-gray-600">Sample implementations</div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium">SDKs and Libraries</div>
                    <div className="text-sm text-gray-600">Integration tools</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeView === 'category' && selectedCategory) {
    const category = getCurrentCategory();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={handleBackToMain} className="p-0 h-auto text-blue-600 hover:text-blue-700">
            ← Back to Help Center
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <category.icon className="h-5 w-5" />
              {category.title}
            </CardTitle>
            <CardDescription>
              {category.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {category.content.map((article, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600">{article.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main help center view
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
                    <ChevronRight className="h-4 w-4 text-gray-400" />
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
