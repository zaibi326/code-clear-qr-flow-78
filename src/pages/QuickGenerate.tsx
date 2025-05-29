
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
      console.log(`QR type from URL: ${type}`);
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
      'url': 'Create QR codes that link to websites, videos, forms, or any URL. Perfect for driving traffic and sharing links instantly.',
      'multi-link': 'Build a link page with multiple destinations accessible through one QR code. Ideal for social media and marketing campaigns.',
      'pdf': 'Generate QR codes that link directly to PDF documents. Great for sharing brochures, menus, and documentation.',
      'location': 'Create location-based QR codes that open Google Maps with your specified address or coordinates.',
      'restaurant-menu': 'Design QR codes for digital restaurant menus. Enable contactless dining experiences for your customers.',
      'form': 'Create QR codes that link to custom forms for data collection, surveys, and feedback gathering.',
      'smart-rules': 'Build intelligent QR codes with conditional redirects based on device, location, or time.',
      'social-media': 'Generate QR codes linking to your social media profiles for increased engagement and followers.',
      'landing-page': 'Create QR codes for mobile-optimized landing pages to showcase products or services.',
      'mobile-app': 'Generate app download or deep-link QR codes for iOS and Android applications.',
      'coupon-code': 'Create QR codes that display coupon information and promotional offers.',
      'geolocation-redirect': 'Build location-aware QR codes with country-specific redirects for global campaigns.',
      'facebook-page': 'Generate QR codes linking directly to your Facebook page for easy likes and follows.',
      'business-page': 'Create QR codes showcasing comprehensive business information and contact details.',
      'image': 'Generate QR codes that display images when scanned. Perfect for galleries and visual content.',
      'mp3': 'Create QR codes that play audio files when scanned. Great for music, podcasts, and audio content.',
      'email': 'Generate QR codes for email composition with pre-filled recipient and subject lines.',
      'call': 'Create QR codes that initiate phone calls when scanned. Perfect for contact cards and business cards.',
      'sms': 'Generate QR codes for SMS messaging with pre-filled phone numbers and messages.'
    };
    return descriptions[selectedType] || 'Generate custom QR codes instantly with advanced styling options and analytics tracking.';
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
                <p className="text-gray-600 text-lg leading-relaxed">{getPageDescription()}</p>
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
