
// Extend Template type for new properties (snake_case to match DB)
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
  editedTexts?: any[]; // For PDF editor text edits
  totalEdits?: number; // For PDF editor statistics
}

export interface Template {
  id: string;
  name: string;
  type?: string;
  category?: string;
  description?: string;
  file?: File | null;
  preview?: string;
  qrPosition?: QRPosition;
  customization?: TemplateCustomization;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic?: boolean; // for legacy, always fallback to below fields
  is_builtin?: boolean;
  is_public?: boolean;
  thumbnail_url?: string;
  template_url?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  editable_json?: any;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  usage_count?: number;
  usageCount?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  isPdf?: boolean; // Add the missing isPdf property
}
