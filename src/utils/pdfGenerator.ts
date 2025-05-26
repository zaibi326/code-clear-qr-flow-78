
export interface PDFGenerationOptions {
  template: {
    width: number;
    height: number;
    backgroundImage?: string;
  };
  qrCode: {
    dataURL: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

export interface PDFResult {
  blob: Blob;
  dataURL: string;
  size: number;
}

export const generatePDF = async (options: PDFGenerationOptions): Promise<PDFResult> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context for PDF generation');
  }

  // Set canvas dimensions
  canvas.width = options.template.width;
  canvas.height = options.template.height;

  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw background image if provided
  if (options.template.backgroundImage) {
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = options.template.backgroundImage!;
      });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.warn('Failed to load background image:', error);
    }
  }

  // Draw QR code
  if (options.qrCode.dataURL) {
    try {
      const qrImg = new Image();
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = reject;
        qrImg.src = options.qrCode.dataURL;
      });
      ctx.drawImage(
        qrImg,
        options.qrCode.x,
        options.qrCode.y,
        options.qrCode.width,
        options.qrCode.height
      );
    } catch (error) {
      console.warn('Failed to draw QR code:', error);
    }
  }

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });

  const dataURL = canvas.toDataURL('image/png');

  return {
    blob,
    dataURL,
    size: blob.size
  };
};

export const generateBulkPDFs = async (
  campaigns: Array<{
    id: string;
    name: string;
    template: PDFGenerationOptions['template'];
    qrCode: PDFGenerationOptions['qrCode'];
  }>
): Promise<Array<{ id: string; name: string; pdf: PDFResult }>> => {
  const results = [];

  for (const campaign of campaigns) {
    try {
      const pdf = await generatePDF({
        template: campaign.template,
        qrCode: campaign.qrCode,
        metadata: {
          title: campaign.name,
          author: 'ClearQR.io',
          creator: 'ClearQR Campaign Generator'
        }
      });

      results.push({
        id: campaign.id,
        name: campaign.name,
        pdf
      });
    } catch (error) {
      console.error(`Failed to generate PDF for campaign ${campaign.id}:`, error);
    }
  }

  return results;
};

export const downloadPDF = (pdfResult: PDFResult, filename: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfResult.blob);
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const downloadBulkPDFs = async (
  pdfs: Array<{ id: string; name: string; pdf: PDFResult }>
) => {
  // Create ZIP file would require additional library
  // For now, download individually
  for (const item of pdfs) {
    downloadPDF(item.pdf, `${item.name}-${item.id}`);
    // Add small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
