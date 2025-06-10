
export interface QRPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasElement {
  id: string;
  type: 'qr' | 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
  locked?: boolean;
  zIndex?: number;
  properties: Record<string, any>;
}

export interface TemplateCustomization {
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  elements: CanvasElement[];
  version: string;
}

export interface Template {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  file?: File | null;
  preview?: string;
  qrPosition?: QRPosition;
  customization?: TemplateCustomization;
  createdAt: Date;
  updatedAt: Date;
  isPublic?: boolean;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  usageCount?: number;
}
