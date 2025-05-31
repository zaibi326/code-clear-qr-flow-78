
export const validateQRForm = (qrTypeId: string, formData: any): boolean => {
  console.log(`Validating form for QR type: ${qrTypeId}`, formData);
  
  switch (qrTypeId) {
    // Dynamic QR Codes that need URLs
    case 'url':
    case 'image':
      return (formData.url || '').trim().length > 0;
    
    case 'multi-link':
      return (formData.linkPageUrl || formData.url || '').trim().length > 0;
    
    case 'pdf':
      return (formData.pdfFile || formData.pdfUrl || formData.url || '').trim().length > 0;
    
    // Landing Page QR type
    case 'landing-page':
      return (formData.pageUrl || formData.url || '').trim().length > 0;
    
    // Restaurant menu
    case 'restaurant-menu':
      return (formData.menuUrl || formData.url || '').trim().length > 0;
    
    // Social media
    case 'social-media':
      return (formData.socialUrl || formData.url || '').trim().length > 0;
    
    // Mobile app - requires at least one URL
    case 'mobile-app':
      return (formData.androidUrl || formData.iosUrl || formData.ipadUrl || formData.webUrl || '').trim().length > 0;
    
    // Facebook page - requires username
    case 'facebook-page':
      return (formData.facebookUsername || '').trim().length > 0;
    
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
    
    default:
      console.warn(`Unknown QR type for validation: ${qrTypeId}`);
      return true; // Allow other types to proceed
  }
};

export const getValidationMessage = (qrTypeId: string): string => {
  switch (qrTypeId) {
    case 'url':
    case 'image':
    case 'website-static':
      return 'Please provide a valid URL.';
    case 'multi-link':
      return 'Please provide a link page URL.';
    case 'pdf':
      return 'Please provide a PDF file or URL.';
    case 'landing-page':
      return 'Please provide a landing page URL.';
    case 'restaurant-menu':
      return 'Please provide a menu URL.';
    case 'social-media':
      return 'Please provide a social media URL.';
    case 'mobile-app':
      return 'Please provide at least one app URL (Android, iOS, iPad, or Web).';
    case 'facebook-page':
      return 'Please provide a Facebook username.';
    case 'email-static':
    case 'business-card-static':
      return 'Please provide a valid email address.';
    case 'call-static':
    case 'sms-static':
      return 'Please provide a valid phone number.';
    case 'plain-text-static':
      return 'Please provide text content.';
    default:
      return 'Please fill in all required fields.';
  }
};
