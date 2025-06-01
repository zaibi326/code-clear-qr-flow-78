
import React from 'react';
import { URLForm } from './URLForm';
import { MultiLinkForm } from './MultiLinkForm';
import { PDFForm } from './PDFForm';
import { EmailForm } from './EmailForm';
import { PhoneForm } from './PhoneForm';
import { SMSForm } from './SMSForm';
import { RestaurantMenuForm } from './RestaurantMenuForm';
import { SocialMediaForm } from './SocialMediaForm';
import { LandingPageForm } from './LandingPageForm';
import { FacebookPageForm } from './FacebookPageForm';
import { MobileAppForm } from './MobileAppForm';
import { DefaultForm } from './DefaultForm';
import { ImageForm } from './ImageForm';
import { BusinessCardForm } from './BusinessCardForm';
import { ComprehensiveQRForm } from './ComprehensiveQRForm';

interface QRFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export const QRFormRegistry: Record<string, React.ComponentType<QRFormProps>> = {
  // Dynamic QR Codes - Use ComprehensiveQRForm for main types
  'url': ComprehensiveQRForm,
  'website': ComprehensiveQRForm,
  'multi-link': MultiLinkForm,
  'pdf': PDFForm,
  'restaurant-menu': RestaurantMenuForm,
  'social-media': SocialMediaForm,
  'landing-page': LandingPageForm,
  'mobile-app': MobileAppForm,
  'facebook-page': FacebookPageForm,
  'image': ImageForm,
  
  // Static QR Codes
  'website-static': ComprehensiveQRForm,
  'business-card-static': BusinessCardForm,
  'email-static': EmailForm,
  'call-static': PhoneForm,
  'sms-static': SMSForm,
  'plain-text-static': DefaultForm,
};

export function getQRForm(qrTypeId: string): React.ComponentType<QRFormProps> {
  const form = QRFormRegistry[qrTypeId];
  if (!form) {
    console.warn(`No form found for QR type: ${qrTypeId}, using ComprehensiveQRForm`);
    return ComprehensiveQRForm;
  }
  return form;
}
