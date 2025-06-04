
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "10 Creative Ways to Use QR Codes in Your Marketing Campaign",
      excerpt: "Discover innovative strategies to leverage QR codes for maximum engagement and conversion in your marketing efforts.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Marketing",
      image: "/lovable-uploads/02a40581-58f3-4a8f-9289-addc9f13cab0.png",
      featured: true
    },
    {
      id: 2,
      title: "The Complete Guide to QR Code Analytics",
      excerpt: "Learn how to track, measure, and optimize your QR code performance with comprehensive analytics tools.",
      author: "Mike Chen",
      date: "2024-01-12",
      readTime: "8 min read",
      category: "Analytics",
      image: "/lovable-uploads/5a18dce6-2917-4c31-af16-17e4c3ac2cf1.png",
      featured: false
    },
    {
      id: 3,
      title: "QR Codes in Restaurants: A Complete Implementation Guide",
      excerpt: "Everything you need to know about implementing contactless menus and ordering systems using QR codes.",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Industry",
      image: "/lovable-uploads/7044a335-27b6-407a-8043-23c1c5995404.png",
      featured: false
    },
    {
      id: 4,
      title: "Security Best Practices for QR Code Campaigns",
      excerpt: "Protect your business and customers with these essential security measures for QR code implementations.",
      author: "David Park",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Security",
      image: "/lovable-uploads/83cd2073-42ea-432d-a04a-43858780a99c.png",
      featured: false
    },
    {
      id: 5,
      title: "Designing QR Codes That Convert: A Visual Guide",
      excerpt: "Master the art of creating visually appealing QR codes that maintain scannability while boosting your brand.",
      author: "Lisa Thompson",
      date: "2024-01-05",
      readTime: "4 min read",
      category: "Design",
      image: "/lovable-uploads/8650ab3b-cc18-4ba8-af81-8b83f2ab88a1.png",
      featured: false
    },
    {
      id: 6,
      title: "QR Code Trends to Watch in 2024",
      excerpt: "Stay ahead of the curve with the latest QR code innovations and trends shaping the digital landscape.",
      author: "Alex Kumar",
      date: "2024-01-01",
      readTime: "6 min read",
      category: "Trends",
      image: "/lovable-uploads/886c0218-76ad-42c0-a3a3-848ee33127dc.png",
      featured: true
    }
  ];

  const categories = ['all', 'Marketing', 'Analytics', 'Industry', 'Security', 'Design', 'Trends'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ClearQR Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, tutorials, and industry trends to help you master QR code technology
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && searchTerm === '' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                      <Badge variant="secondary">
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <Button variant="ghost" size="sm" className="group-hover:text-blue-600">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' && searchTerm === '' ? 'Latest Articles' : 'Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === 'all' && searchTerm === '' ? regularPosts : filteredPosts).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 bg-white/90 text-gray-700"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">By {post.author}</span>
                    <Button variant="ghost" size="sm" className="text-xs group-hover:text-blue-600">
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Never Miss an Update</h3>
            <p className="text-blue-100 mb-6">
              Get the latest QR code insights and tutorials delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
