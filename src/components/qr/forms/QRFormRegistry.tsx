
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
  'form': URLForm, // Forms use URL input
  'smart-rules': URLForm, // Smart rules use primary URL
  'social-media': SocialMediaForm,
  'landing-page': URLForm, // Landing pages use URL input
  'mobile-app': URLForm, // Mobile apps use URL input
  'location': LocationForm,
  'coupon-code': URLForm, // Coupons use URL input
  'geolocation-redirect': URLForm, // Geo redirect uses default URL
  'facebook-page': URLForm, // Facebook uses URL input
  'business-page': URLForm, // Business page uses URL input
  'image': URLForm, // Images use URL input
  'mp3': URLForm, // Audio files use URL input
  
  // Static QR Codes
  'email-static': EmailForm,
  'call-static': PhoneForm,
  'sms-static': SMSForm,
};

export function getQRForm(qrTypeId: string): React.ComponentType<QRFormProps> {
  const form = QRFormRegistry[qrTypeId];
  if (!form) {
    console.warn(`No form found for QR type: ${qrTypeId}, using DefaultForm`);
    return DefaultForm;
  }
  return form;
}
