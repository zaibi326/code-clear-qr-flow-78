
export const validateQRForm = (qrTypeId: string, formData: any): boolean => {
  switch (qrTypeId) {
    // Dynamic QR Codes that need URLs
    case 'url':
    case 'multi-link':
    case 'pdf':
    case 'form':
    case 'smart-rules':
    case 'landing-page':
    case 'mobile-app':
    case 'coupon-code':
    case 'geolocation-redirect':
    case 'facebook-page':
    case 'business-page':
    case 'image':
    case 'mp3':
      return (formData.url || formData.menuUrl || formData.socialUrl || formData.appUrl || '').trim().length > 0;
    
    // Restaurant menu
    case 'restaurant-menu':
      return (formData.menuUrl || formData.url || '').trim().length > 0;
    
    // Social media
    case 'social-media':
      return (formData.socialUrl || formData.url || '').trim().length > 0;
    
    // Location
    case 'location':
      return (formData.locationName || '').trim().length > 0 && 
             (formData.latitude || '').trim().length > 0 && 
             (formData.longitude || '').trim().length > 0;
    
    // Static QR Codes
    case 'email-static':
      return (formData.email || '').trim().length > 0;
    
    case 'call-static':
    case 'sms-static':
      return (formData.phone || '').trim().length > 0;
    
    default:
      return true; // Allow other types to proceed
  }
};

export const getValidationMessage = (qrTypeId: string): string => {
  switch (qrTypeId) {
    case 'location':
      return 'Please provide location name, latitude, and longitude.';
    case 'email-static':
      return 'Please provide a valid email address.';
    case 'call-static':
    case 'sms-static':
      return 'Please provide a valid phone number.';
    default:
      return 'Please fill in all required fields.';
  }
};
