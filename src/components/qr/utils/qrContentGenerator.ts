
export const generateQRContent = (qrTypeId: string, setupData: any): string => {
  switch (qrTypeId) {
    case 'url':
    case 'multi-link':
    case 'pdf':
      return setupData.url || 'https://example.com';
    case 'email-static':
      return `mailto:${setupData.email}${setupData.subject ? `?subject=${setupData.subject}` : ''}`;
    case 'call-static':
      return `tel:${setupData.phone}`;
    case 'sms-static':
      return `sms:${setupData.phone}${setupData.message ? `?body=${setupData.message}` : ''}`;
    default:
      return setupData.content || 'Default content';
  }
};
