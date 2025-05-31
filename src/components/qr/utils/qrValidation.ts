
export const validateQRForm = (qrTypeId: string, formData: any): boolean => {
  console.log(`Validating form for QR type: ${qrTypeId}`, formData);
  
  switch (qrTypeId) {
    // Dynamic QR Codes that need URLs
    case 'url':
    case 'form':
    case 'smart-rules':
    case 'landing-page':
    case 'coupon-code':
    case 'geolocation-redirect':
    case 'business-page':
    case 'image':
    case 'mp3':
      return (formData.url || '').trim().length > 0;
    
    case 'multi-link':
      return (formData.url || formData.linkPageUrl || '').trim().length > 0;
    
    case 'pdf':
      return (formData.url || formData.pdfUrl || '').trim().length > 0;
    
    // Restaurant menu
    case 'restaurant-menu':
      return (formData.menuUrl || formData.url || '').trim().length > 0;
    
    // Social media
    case 'social-media':
      return (formData.socialUrl || formData.url || '').trim().length > 0;
    
    // Mobile app
    case 'mobile-app':
      return (formData.appUrl || formData.url || formData.iosUrl || formData.androidUrl || '').trim().length > 0;
    
    // Facebook page
    case 'facebook-page':
      return (formData.facebookPage || formData.url || '').trim().length > 0;
    
    // Location
    case 'location':
      return (formData.locationName || '').trim().length > 0 && 
             (formData.latitude || formData.address || '').trim().length > 0 && 
             (formData.longitude || formData.address || '').trim().length > 0;
    
    // Static QR Codes
    case 'email-static':
      return (formData.email || '').trim().length > 0 && 
             (formData.email || '').includes('@');
    
    case 'call-static':
    case 'sms-static':
      return (formData.phone || '').trim().length > 0;
    
    default:
      console.warn(`Unknown QR type for validation: ${qrTypeId}`);
      return true; // Allow other types to proceed
  }
};

export const getValidationMessage = (qrTypeId: string): string => {
  switch (qrTypeId) {
    case 'url':
    case 'form':
    case 'smart-rules':
    case 'landing-page':
    case 'coupon-code':
    case 'geolocation-redirect':
    case 'business-page':
    case 'image':
    case 'mp3':
      return 'Please provide a valid URL.';
    case 'multi-link':
      return 'Please provide a link page URL.';
    case 'pdf':
      return 'Please provide a PDF URL.';
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
      return 'Please provide a valid email address.';
    case 'call-static':
    case 'sms-static':
      return 'Please provide a valid phone number.';
    default:
      return 'Please fill in all required fields.';
  }
};
