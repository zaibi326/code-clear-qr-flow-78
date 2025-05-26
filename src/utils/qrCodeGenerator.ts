
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

  // Create canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas size
  canvas.width = size;
  canvas.height = size;

  // Fill background
  ctx.fillStyle = color.light || '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Simple QR code pattern simulation (in real app, use qrcode library)
  const moduleSize = Math.floor((size - 2 * margin) / 21); // 21x21 modules for QR
  const startX = margin;
  const startY = margin;

  ctx.fillStyle = color.dark || '#000000';
  
  // Generate simple pattern based on content hash
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

  // Add finder patterns (corners)
  drawFinderPattern(ctx, startX, startY, moduleSize);
  drawFinderPattern(ctx, startX + 14 * moduleSize, startY, moduleSize);
  drawFinderPattern(ctx, startX, startY + 14 * moduleSize, moduleSize);

  const dataURL = canvas.toDataURL('image/png');
  
  return {
    dataURL,
    size,
    content
  };
};

const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
};

const shouldFillModule = (x: number, y: number, hash: number): boolean => {
  // Simple pattern generation based on position and hash
  return ((x + y + hash) % 3) === 0;
};

const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
  // Draw 7x7 finder pattern
  for (let dy = 0; dy < 7; dy++) {
    for (let dx = 0; dx < 7; dx++) {
      if (
        (dx === 0 || dx === 6 || dy === 0 || dy === 6) || // Outer border
        (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) // Inner square
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
      // Add placeholder result
      results.push({
        dataURL: '',
        size: options.size || 200,
        content
      });
    }
  }
  
  return results;
};
