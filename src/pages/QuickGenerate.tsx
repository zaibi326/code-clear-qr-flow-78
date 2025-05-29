
import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { AdvancedQRGenerator } from '@/components/qr/AdvancedQRGenerator';
import { useSearchParams } from 'react-router-dom';

const QuickGenerate = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>('url');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setSelectedType(type);
    }
  }, [searchParams]);

  const getPageTitle = () => {
    const typeNames: Record<string, string> = {
      'url': 'URL/Link QR Generator',
      'multi-link': 'Multi-link QR Generator',
      'pdf': 'PDF QR Generator',
      'location': 'Location QR Generator',
      'restaurant-menu': 'Restaurant Menu QR Generator',
      'form': 'Form QR Generator',
      'smart-rules': 'Smart Rules QR Generator',
      'social-media': 'Social Media QR Generator',
      'landing-page': 'Landing Page QR Generator',
      'mobile-app': 'Mobile App QR Generator',
      'coupon-code': 'Coupon Code QR Generator',
      'geolocation-redirect': 'Geolocation Redirect QR Generator',
      'facebook-page': 'Facebook Page QR Generator',
      'business-page': 'Business Page QR Generator',
      'image': 'Image QR Generator',
      'mp3': 'MP3 QR Generator',
      'email': 'Email QR Generator',
      'call': 'Call QR Generator',
      'sms': 'SMS QR Generator'
    };
    return typeNames[selectedType] || 'Quick QR Generator';
  };

  const getPageDescription = () => {
    const descriptions: Record<string, string> = {
      'url': 'Create QR codes that link to websites, videos, forms, or any URL',
      'multi-link': 'Build a link page with multiple destinations accessible through one QR code',
      'pdf': 'Generate QR codes that link directly to PDF documents',
      'location': 'Create location-based QR codes that open Google Maps',
      'restaurant-menu': 'Design QR codes for digital restaurant menus',
      'form': 'Create QR codes that link to custom forms for data collection',
      'smart-rules': 'Build intelligent QR codes with conditional redirects',
      'social-media': 'Generate QR codes linking to your social media profiles',
      'landing-page': 'Create QR codes for mobile-optimized landing pages',
      'mobile-app': 'Generate app download or deep-link QR codes',
      'coupon-code': 'Create QR codes that display coupon information',
      'geolocation-redirect': 'Build location-aware QR codes with country-specific redirects',
      'facebook-page': 'Generate QR codes linking to Facebook page likes',
      'business-page': 'Create QR codes showcasing business information',
      'image': 'Generate QR codes that display images',
      'mp3': 'Create QR codes that play audio files',
      'email': 'Generate QR codes for email composition',
      'call': 'Create QR codes that initiate phone calls',
      'sms': 'Generate QR codes for SMS messaging'
    };
    return descriptions[selectedType] || 'Generate custom QR codes instantly with advanced styling options';
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
                <p className="text-gray-600">{getPageDescription()}</p>
              </div>
              
              <AdvancedQRGenerator initialType={selectedType} />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default QuickGenerate;
