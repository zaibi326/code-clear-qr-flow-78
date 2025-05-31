
export const generateQRContent = (qrTypeId: string, setupData: any): string => {
  console.log(`Generating QR content for type: ${qrTypeId}`, setupData);
  
  switch (qrTypeId) {
    // Dynamic QR Codes
    case 'url':
      return setupData.url || 'https://example.com';
      
    case 'multi-link':
    case 'linkpage-static':
      return setupData.linkPageUrl || setupData.url || 'https://linktr.ee/example';
      
    case 'pdf':
      return setupData.pdfUrl || setupData.url || 'https://example.com/document.pdf';
      
    case 'restaurant-menu':
      return setupData.menuUrl || setupData.url || 'https://example.com/menu';
      
    case 'form':
      return setupData.formUrl || setupData.url || 'https://forms.google.com/example';
      
    case 'smart-rules':
      return setupData.primaryUrl || setupData.url || 'https://example.com/smart';
      
    case 'social-media':
      return setupData.socialUrl || setupData.url || 'https://linktr.ee/social';
      
    case 'landing-page':
      return setupData.pageUrl || setupData.url || 'https://example.com/landing';
      
    case 'mobile-app':
      // For mobile apps, prioritize based on platform availability
      if (setupData.androidUrl && setupData.iosUrl) {
        // If both Android and iOS URLs are provided, create a smart link
        return setupData.webUrl || setupData.androidUrl || setupData.iosUrl;
      }
      if (setupData.androidUrl) return setupData.androidUrl;
      if (setupData.iosUrl) return setupData.iosUrl;
      if (setupData.ipadUrl) return setupData.ipadUrl;
      if (setupData.webUrl) return setupData.webUrl;
      return 'https://apps.apple.com/app/example';
      
    case 'facebook-page':
      const fbUsername = setupData.facebookUsername || 'example';
      if (fbUsername.startsWith('http')) return fbUsername;
      return `https://facebook.com/${fbUsername}`;
      
    case 'image':
      return setupData.imageUrl || setupData.url || 'https://example.com/image.jpg';
      
    // Static QR Codes
    case 'website-static':
      return setupData.url || 'https://example.com';
      
    case 'email-static':
      const email = setupData.email || 'contact@example.com';
      const subject = setupData.subject ? `?subject=${encodeURIComponent(setupData.subject)}` : '';
      const body = setupData.body ? `${subject ? '&' : '?'}body=${encodeURIComponent(setupData.body)}` : '';
      return `mailto:${email}${subject}${body}`;
      
    case 'business-card-static':
      // Generate vCard format
      const firstName = setupData.firstName || 'John';
      const lastName = setupData.lastName || 'Doe';
      const company = setupData.company || '';
      const designation = setupData.designation || '';
      const phoneWork = setupData.phoneWork || '';
      const phoneHome = setupData.phoneHome || '';
      const phoneMobile = setupData.phoneMobile || '';
      const emailAddr = setupData.email || '';
      const website = setupData.website || '';
      const addressLine1 = setupData.addressLine1 || '';
      const addressLine2 = setupData.addressLine2 || '';
      const city = setupData.city || '';
      const state = setupData.state || '';
      const country = setupData.country || '';
      const zip = setupData.zip || '';
      
      let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
      vCard += `FN:${firstName} ${lastName}\n`;
      vCard += `N:${lastName};${firstName};;;\n`;
      
      if (company) vCard += `ORG:${company}\n`;
      if (designation) vCard += `TITLE:${designation}\n`;
      if (emailAddr) vCard += `EMAIL:${emailAddr}\n`;
      if (website) vCard += `URL:${website}\n`;
      if (phoneWork) vCard += `TEL;TYPE=WORK:${phoneWork}\n`;
      if (phoneHome) vCard += `TEL;TYPE=HOME:${phoneHome}\n`;
      if (phoneMobile) vCard += `TEL;TYPE=CELL:${phoneMobile}\n`;
      
      if (addressLine1 || city || state || country || zip) {
        const address = `${addressLine1}${addressLine2 ? ';' + addressLine2 : ''};${city};${state};${zip};${country}`;
        vCard += `ADR;TYPE=WORK:;;${address}\n`;
      }
      
      vCard += 'END:VCARD';
      return vCard;
      
    case 'call-static':
      const phone = setupData.phone || '+1234567890';
      return `tel:${phone.replace(/\s+/g, '')}`;
      
    case 'sms-static':
      const smsPhone = setupData.phone || '+1234567890';
      const message = setupData.message ? `?body=${encodeURIComponent(setupData.message)}` : '';
      return `sms:${smsPhone.replace(/\s+/g, '')}${message}`;
      
    case 'plain-text-static':
      return setupData.text || setupData.content || 'Hello World';
      
    case 'wifi-static':
      const ssid = setupData.networkName || setupData.ssid || 'WiFi_Network';
      const password = setupData.password || '';
      const security = setupData.security || 'WPA';
      return `WIFI:T:${security};S:${ssid};P:${password};;`;
      
    default:
      console.warn(`Unknown QR type: ${qrTypeId}, using default content`);
      return setupData.content || setupData.url || 'https://example.com';
  }
};

export const getQRTypeDescription = (qrTypeId: string): string => {
  const descriptions: Record<string, string> = {
    'url': 'Opens a website URL when scanned',
    'multi-link': 'Shows a page with multiple links (like Linktree)',
    'pdf': 'Opens a PDF document for viewing or download',
    'restaurant-menu': 'Displays a restaurant or bar menu',
    'form': 'Opens a form for data collection',
    'smart-rules': 'Redirects to different destinations based on conditions',
    'social-media': 'Shows your social media profiles',
    'landing-page': 'Opens a custom mobile-optimized landing page',
    'mobile-app': 'Redirects to app store or opens app if installed',
    'location': 'Opens location in Google Maps',
    'coupon-code': 'Shows a coupon or discount code',
    'geolocation-redirect': 'Shows different content based on user location',
    'facebook-page': 'Opens your Facebook page',
    'business-page': 'Shows your business information',
    'image': 'Displays an image',
    'mp3': 'Plays an audio file',
    'website-static': 'Opens a website URL when scanned',
    'business-card-static': 'Shows contact information',
    'linkpage-static': 'Shows a page with multiple links',
    'email-static': 'Opens email app to send an email',
    'call-static': 'Initiates a phone call',
    'sms-static': 'Opens SMS app to send a text message',
    'plain-text-static': 'Displays plain text message',
    'wifi-static': 'Connects to a WiFi network'
  };
  
  return descriptions[qrTypeId] || 'Performs the configured action when scanned';
};
