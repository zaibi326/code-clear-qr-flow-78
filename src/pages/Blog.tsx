
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to QR Code Marketing in 2024',
      excerpt: 'Discover the latest trends and best practices for using QR codes in your marketing campaigns.',
      author: 'Sarah Johnson',
      date: '2024-05-15',
      category: 'Marketing',
      readTime: '8 min read',
      featured: true
    },
    {
      id: 2,
      title: 'How to Track QR Code Performance: Analytics That Matter',
      excerpt: 'Learn which metrics to monitor and how to optimize your QR code campaigns for better results.',
      author: 'Mike Chen',
      date: '2024-05-10',
      category: 'Analytics',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 3,
      title: 'QR Codes in Restaurants: Boosting Customer Experience',
      excerpt: 'Case studies and strategies for implementing QR codes in the food service industry.',
      author: 'Emma Rodriguez',
      date: '2024-05-05',
      category: 'Industry',
      readTime: '10 min read',
      featured: false
    },
    {
      id: 4,
      title: 'Security Best Practices for QR Code Campaigns',
      excerpt: 'Protect your brand and customers with these essential QR code security guidelines.',
      author: 'David Park',
      date: '2024-04-28',
      category: 'Security',
      readTime: '7 min read',
      featured: false
    }
  ];

  const categories = ['All', 'Marketing', 'Analytics', 'Industry', 'Security', 'Tutorials'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">QR Code Insights Blog</h1>
          <p className="text-xl text-gray-600">Expert tips, case studies, and industry insights to maximize your QR code success</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <Card key={post.id} className="mb-8 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>Featured</Badge>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <Button>
                    Read More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Regular Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-600"></div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <span>{post.readTime}</span>
                </div>
                <Button className="w-full" variant="outline">
                  Read Article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-6">Get the latest QR code insights and best practices delivered to your inbox</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
