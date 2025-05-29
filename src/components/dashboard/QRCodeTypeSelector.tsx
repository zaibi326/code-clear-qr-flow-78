
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Link, 
  FileText, 
  MapPin, 
  Users, 
  FormInput, 
  Share2, 
  Smartphone, 
  Gift, 
  Globe, 
  Facebook, 
  Building, 
  Image, 
  Music, 
  Mail, 
  Phone, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  Star,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QRCodeTypeSelector() {
  const navigate = useNavigate();

  const frequentlyUsed = [
    {
      id: 'url',
      title: 'URL/Link',
      description: 'Paste link to a website, video, form, or any URL you have',
      icon: Link,
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: 'multi-link',
      title: 'Multi-link QR Codes',
      description: 'Create a Linkpage with a list of links and share it with a QR Code',
      icon: Share2,
      color: 'bg-purple-500',
      badge: 'NEW'
    },
    {
      id: 'pdf',
      title: 'PDF',
      description: 'Link a PDF document and distribute it efficiently',
      icon: FileText,
      color: 'bg-red-500',
      popular: true
    },
    {
      id: 'location',
      title: 'Location',
      description: 'Point to any location on Google Maps',
      icon: MapPin,
      color: 'bg-green-500'
    }
  ];

  const moreQRTypes = [
    {
      id: 'restaurant-menu',
      title: 'Restaurant Menu',
      description: 'Organize all your QR menus in one digital location',
      icon: Building,
      color: 'bg-orange-500'
    },
    {
      id: 'form',
      title: 'Form',
      description: 'Design a form and get responses through scans',
      icon: FormInput,
      color: 'bg-indigo-500',
      badge: 'NEW'
    },
    {
      id: 'smart-rules',
      title: 'Smart Rules',
      description: 'Create smarter QR Codes that redirect based on logical conditions',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      id: 'social-media',
      title: 'Social Media',
      description: 'Link to your social media channels for more engagement',
      icon: Users,
      color: 'bg-pink-500'
    },
    {
      id: 'landing-page',
      title: 'Landing Page',
      description: 'Build a mobile-optimized webpage to interact with your audience',
      icon: Globe,
      color: 'bg-cyan-500'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App',
      description: 'Redirect to app download or in-app pages for Android and iOS users',
      icon: Smartphone,
      color: 'bg-emerald-500'
    },
    {
      id: 'coupon-code',
      title: 'Coupon Code',
      description: 'Route to a page displaying coupon code details',
      icon: Gift,
      color: 'bg-rose-500'
    },
    {
      id: 'geolocation-redirect',
      title: 'Geolocation Redirect',
      description: "Show a specific website URL based on the scanner's country",
      icon: Globe,
      color: 'bg-teal-500'
    },
    {
      id: 'facebook-page',
      title: 'Facebook Page',
      description: 'Redirect to the "like" button of your Facebook page',
      icon: Facebook,
      color: 'bg-blue-600'
    },
    {
      id: 'business-page',
      title: 'Business Page',
      description: 'Link to a page containing your business details',
      icon: Building,
      color: 'bg-gray-600'
    },
    {
      id: 'image',
      title: 'Image',
      description: 'Show a photo',
      icon: Image,
      color: 'bg-violet-500'
    },
    {
      id: 'mp3',
      title: 'MP3',
      description: 'Play an audio file',
      icon: Music,
      color: 'bg-amber-500'
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Link to receive email messages',
      icon: Mail,
      color: 'bg-blue-400'
    },
    {
      id: 'call',
      title: 'Call',
      description: 'Link to your phone number for quick calls',
      icon: Phone,
      color: 'bg-green-600'
    },
    {
      id: 'sms',
      title: 'SMS',
      description: 'Redirect to your mobile number to receive SMS',
      icon: MessageSquare,
      color: 'bg-purple-600'
    }
  ];

  const handleStartFreeTrial = (typeId: string) => {
    // Navigate to quick generate with the selected type
    navigate(`/quick-generate?type=${typeId}`);
  };

  const QRTypeCard = ({ qrType, showBadge = true }: { qrType: any, showBadge?: boolean }) => (
    <div className="relative p-6 border rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${qrType.color} text-white group-hover:scale-110 transition-transform duration-300`}>
          <qrType.icon className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          {qrType.badge && showBadge && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
              {qrType.badge}
            </Badge>
          )}
          {qrType.popular && showBadge && (
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {qrType.title}
      </h3>
      
      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        {qrType.description}
      </p>

      <Button 
        onClick={() => handleStartFreeTrial(qrType.id)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 group"
      >
        <Crown className="mr-2 h-4 w-4" />
        Start Free Trial
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900">
          Let's build your first dynamic QR Code
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from our wide range of QR code types to create engaging experiences for your audience
        </p>
      </div>

      {/* Frequently Used Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            FREQUENTLY USED ✨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {frequentlyUsed.map((qrType) => (
              <QRTypeCard key={qrType.id} qrType={qrType} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* More QR Code Types Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="h-5 w-5 text-purple-500" />
            MORE QR CODE TYPES 💫
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreQRTypes.map((qrType) => (
              <QRTypeCard key={qrType.id} qrType={qrType} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
            <div className="text-gray-600">QR Code Types</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
            <div className="text-gray-600">Unlimited Scans</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Analytics Tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
