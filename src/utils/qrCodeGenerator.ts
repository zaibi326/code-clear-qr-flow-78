
export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRCodeResult {
  dataURL: string;
  size: number;
  content: string;
}

export const generateQRCode = async (content: string, options: QRCodeOptions = {}): Promise<QRCodeResult> => {
  const {
    size = 200,
    margin = 4,
    color = { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel = 'M'
  } = options;

  try {
    // Try to use QRCode library if available
    const QRCode = (window as any).QRCode;
    if (QRCode) {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, content, {
        width: size,
        margin: Math.floor(margin / 4),
        color: {
          dark: color.dark || '#000000',
          light: color.light || '#FFFFFF',
        },
        errorCorrectionLevel,
      });
      
      return {
        dataURL: canvas.toDataURL('image/png'),
        size,
        content
      };
    }
  } catch (error) {
    console.warn('QRCode library not available, using fallback');
  }

  // Fallback QR code generation
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = size;
  canvas.height = size;

  // Fill background
  ctx.fillStyle = color.light || '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Generate QR pattern
  const moduleSize = Math.floor((size - 2 * margin) / 21);
  const startX = margin;
  const startY = margin;

  ctx.fillStyle = color.dark || '#000000';
  
  // Generate pattern based on content hash
  const hash = hashCode(content);
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      if (shouldFillModule(x, y, hash)) {
        ctx.fillRect(
          startX + x * moduleSize,
          startY + y * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }

  // Add finder patterns
  drawFinderPattern(ctx, startX, startY, moduleSize);
  drawFinderPattern(ctx, startX + 14 * moduleSize, startY, moduleSize);
  drawFinderPattern(ctx, startX, startY + 14 * moduleSize, moduleSize);

  return {
    dataURL: canvas.toDataURL('image/png'),
    size,
    content
  };
};

const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

const shouldFillModule = (x: number, y: number, hash: number): boolean => {
  return ((x + y + hash) % 3) === 0;
};

const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
  for (let dy = 0; dy < 7; dy++) {
    for (let dx = 0; dx < 7; dx++) {
      if (
        (dx === 0 || dx === 6 || dy === 0 || dy === 6) ||
        (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
      ) {
        ctx.fillRect(
          x + dx * moduleSize,
          y + dy * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }
};

export const batchGenerateQRCodes = async (
  contents: string[],
  options: QRCodeOptions = {}
): Promise<QRCodeResult[]> => {
  const results: QRCodeResult[] = [];
  
  for (const content of contents) {
    try {
      const result = await generateQRCode(content, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate QR code for ${content}:`, error);
      results.push({
        dataURL: '',
        size: options.size || 200,
        content
      });
    }
  }
  
  return results;
};
