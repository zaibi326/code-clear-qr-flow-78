
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, HelpCircle, Book, MessageCircle, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems = [
    {
      question: 'How do I create my first QR code?',
      answer: 'Navigate to the QR Code Generator, select your desired type (URL, Text, etc.), enter your content, customize the design, and click Generate. Your QR code will be ready for download.',
      category: 'Getting Started'
    },
    {
      question: 'Can I track QR code scans?',
      answer: 'Yes! All QR codes created with ClearQR.io include built-in analytics. You can view scan counts, locations, devices, and timing data in your Analytics dashboard.',
      category: 'Analytics'
    },
    {
      question: 'What file formats can I download?',
      answer: 'You can download QR codes in PNG, JPG, SVG, and PDF formats. SVG is recommended for print materials as it\'s vector-based and scalable.',
      category: 'Downloads'
    },
    {
      question: 'How do I customize QR code appearance?',
      answer: 'Use our design editor to change colors, add logos, modify corner styles, and adjust error correction levels. Premium users get access to advanced customization options.',
      category: 'Customization'
    },
    {
      question: 'Can I edit QR codes after creation?',
      answer: 'Dynamic QR codes can be edited anytime - change the destination URL without reprinting. Static QR codes cannot be modified once generated.',
      category: 'Editing'
    },
    {
      question: 'What\'s the difference between static and dynamic QR codes?',
      answer: 'Static QR codes contain fixed data and cannot be changed. Dynamic QR codes redirect through our service, allowing you to update content and track analytics.',
      category: 'QR Types'
    }
  ];

  const guides = [
    {
      title: 'Getting Started Guide',
      description: 'Complete walkthrough for new users',
      icon: Book,
      duration: '10 min read'
    },
    {
      title: 'QR Code Best Practices',
      description: 'Tips for effective QR code campaigns',
      icon: HelpCircle,
      duration: '8 min read'
    },
    {
      title: 'Analytics Deep Dive',
      description: 'Understanding your QR code performance',
      icon: Book,
      duration: '12 min read'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video instructions',
      icon: Video,
      duration: '25 videos'
    }
  ];

  const filteredFAQs = faqItems.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">Find answers, guides, and get support for ClearQR.io</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                    <div className="text-sm text-blue-600">{item.category}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guides" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <guide.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                        <p className="text-gray-600 mb-3">{guide.description}</p>
                        <div className="text-sm text-gray-500">{guide.duration}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Live Chat
                  </CardTitle>
                  <CardDescription>
                    Get instant help from our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Chat</Button>
                  <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Submit Ticket
                  </CardTitle>
                  <CardDescription>
                    For detailed technical support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/support">Create Ticket</Link>
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">Response within 2 hours</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    We're here to help with any questions or concerns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Email Support</h4>
                    <p className="text-gray-600">support@clearqr.io</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sales Inquiries</h4>
                    <p className="text-gray-600">sales@clearqr.io</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9 AM - 6 PM EST</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Contact Form</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                      rows={4}
                      placeholder="Describe your question or issue..."
                    ></textarea>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;
