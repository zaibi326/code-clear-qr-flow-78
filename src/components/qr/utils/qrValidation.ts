
export const validateQRForm = (qrTypeId: string, formData: any): boolean => {
  console.log(`Validating form for QR type: ${qrTypeId}`, formData);
  
  switch (qrTypeId) {
    // Dynamic QR Codes that need URLs
    case 'url':
    case 'coupon-code':
    case 'geolocation-redirect':
    case 'business-page':
    case 'image':
    case 'mp3':
      return (formData.url || '').trim().length > 0;
    
    case 'multi-link':
    case 'linkpage-static':
      return (formData.linkPageUrl || formData.url || '').trim().length > 0;
    
    case 'pdf':
      return (formData.pdfUrl || formData.url || '').trim().length > 0;
    
    // Form QR type
    case 'form':
      return (formData.formUrl || formData.url || '').trim().length > 0;
    
    // Smart Rules QR type
    case 'smart-rules':
      return (formData.primaryUrl || formData.url || '').trim().length > 0;
    
    // Landing Page QR type
    case 'landing-page':
      return (formData.pageUrl || formData.url || '').trim().length > 0;
    
    // Restaurant menu
    case 'restaurant-menu':
      return (formData.menuUrl || formData.url || '').trim().length > 0;
    
    // Social media
    case 'social-media':
      return (formData.socialUrl || formData.url || '').trim().length > 0;
    
    // Mobile app
    case 'mobile-app':
      return (formData.appUrl || formData.url || formData.iosUrl || formData.androidUrl || '').trim().length > 0;
    
    // Facebook page - now requires username
    case 'facebook-page':
      return (formData.facebookUsername || '').trim().length > 0;
    
    // Location
    case 'location':
      return (formData.locationName || '').trim().length > 0 && 
             (formData.latitude || formData.address || '').trim().length > 0 && 
             (formData.longitude || formData.address || '').trim().length > 0;
    
    // Static QR Codes
    case 'website-static':
      return (formData.url || '').trim().length > 0;
    
    case 'email-static':
    case 'business-card-static':
      return (formData.email || '').trim().length > 0 && 
             (formData.email || '').includes('@');
    
    case 'call-static':
    case 'sms-static':
      return (formData.phone || '').trim().length > 0;
    
    case 'plain-text-static':
      return (formData.text || formData.content || '').trim().length > 0;
    
    case 'wifi-static':
      return (formData.networkName || formData.ssid || '').trim().length > 0;
    
    default:
      console.warn(`Unknown QR type for validation: ${qrTypeId}`);
      return true; // Allow other types to proceed
  }
};

export const getValidationMessage = (qrTypeId: string): string => {
  switch (qrTypeId) {
    case 'url':
    case 'coupon-code':
    case 'geolocation-redirect':
    case 'business-page':
    case 'image':
    case 'mp3':
    case 'website-static':
      return 'Please provide a valid URL.';
    case 'multi-link':
    case 'linkpage-static':
      return 'Please provide a link page URL.';
    case 'pdf':
      return 'Please provide a PDF URL.';
    case 'form':
      return 'Please provide a form URL.';
    case 'smart-rules':
      return 'Please provide a primary URL for smart rules.';
    case 'landing-page':
      return 'Please provide a landing page URL.';
    case 'restaurant-menu':
      return 'Please provide a menu URL.';
    case 'social-media':
      return 'Please provide a social media URL.';
    case 'mobile-app':
      return 'Please provide an app URL, iOS URL, or Android URL.';
    case 'facebook-page':
      return 'Please provide a Facebook page URL.';
    case 'location':
      return 'Please provide location name and address or coordinates.';
    case 'email-static':
    case 'business-card-static':
      return 'Please provide a valid email address.';
    case 'call-static':
    case 'sms-static':
      return 'Please provide a valid phone number.';
    case 'plain-text-static':
      return 'Please provide text content.';
    case 'wifi-static':
      return 'Please provide WiFi network name.';
    default:
      return 'Please fill in all required fields.';
  }
};
