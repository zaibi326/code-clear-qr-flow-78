
import React from 'react';
import { URLForm } from './URLForm';
import { MultiLinkForm } from './MultiLinkForm';
import { PDFForm } from './PDFForm';
import { EmailForm } from './EmailForm';
import { PhoneForm } from './PhoneForm';
import { SMSForm } from './SMSForm';
import { LocationForm } from './LocationForm';
import { RestaurantMenuForm } from './RestaurantMenuForm';
import { SocialMediaForm } from './SocialMediaForm';
import { FormQRForm } from './FormQRForm';
import { SmartRulesForm } from './SmartRulesForm';
import { LandingPageForm } from './LandingPageForm';
import { FacebookPageForm } from './FacebookPageForm';
import { DefaultForm } from './DefaultForm';

interface QRFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export const QRFormRegistry: Record<string, React.ComponentType<QRFormProps>> = {
  // Dynamic QR Codes
  'url': URLForm,
  'multi-link': MultiLinkForm,
  'pdf': PDFForm,
  'restaurant-menu': RestaurantMenuForm,
  'form': FormQRForm,
  'smart-rules': SmartRulesForm,
  'social-media': SocialMediaForm,
  'landing-page': LandingPageForm,
  'mobile-app': URLForm, // Mobile apps use URL input
  'location': LocationForm,
  'coupon-code': URLForm, // Coupons use URL input
  'geolocation-redirect': URLForm, // Geo redirect uses default URL
  'facebook-page': FacebookPageForm, // Facebook uses specialized form
  'business-page': URLForm, // Business page uses URL input
  'image': URLForm, // Images use URL input
  'mp3': URLForm, // Audio files use URL input
  
  // Static QR Codes
  'website-static': URLForm,
  'business-card-static': EmailForm, // Use email form for business cards
  'linkpage-static': MultiLinkForm,
  'email-static': EmailForm,
  'call-static': PhoneForm,
  'sms-static': SMSForm,
  'plain-text-static': DefaultForm,
  'wifi-static': DefaultForm,
};

export function getQRForm(qrTypeId: string): React.ComponentType<QRFormProps> {
  const form = QRFormRegistry[qrTypeId];
  if (!form) {
    console.warn(`No form found for QR type: ${qrTypeId}, using DefaultForm`);
    return DefaultForm;
  }
  return form;
}
