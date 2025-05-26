
import QRCode from 'qrcode';

export interface QRCodeOptions {
  content: string;
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export const generateQRCode = async (options: QRCodeOptions): Promise<string> => {
  const {
    content,
    size = 200,
    margin = 4,
    color = { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel = 'M'
  } = options;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(content, {
      width: size,
      margin,
      color,
      errorCorrectionLevel
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateBulkQRCodes = async (
  dataList: Array<{ id: string; content: string; customData?: Record<string, string> }>,
  options: Omit<QRCodeOptions, 'content'> = {}
): Promise<Array<{ id: string; qrCode: string; data: any }>> => {
  const results = [];
  
  for (const item of dataList) {
    try {
      const qrCode = await generateQRCode({
        ...options,
        content: item.content
      });
      
      results.push({
        id: item.id,
        qrCode,
        data: item
      });
    } catch (error) {
      console.error(`Error generating QR code for item ${item.id}:`, error);
      results.push({
        id: item.id,
        qrCode: '',
        data: item
      });
    }
  }
  
  return results;
};
