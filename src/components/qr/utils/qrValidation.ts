
export const validateQRForm = (qrTypeId: string, formData: any): boolean => {
  switch (qrTypeId) {
    case 'url':
    case 'multi-link':
    case 'pdf':
      return formData.url && formData.url.trim();
    case 'email-static':
      return formData.email && formData.email.trim();
    case 'call-static':
    case 'sms-static':
      return formData.phone && formData.phone.trim();
    default:
      return true;
  }
};
