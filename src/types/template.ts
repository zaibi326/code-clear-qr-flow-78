
export interface QRPosition {
  x: number;
  y: number;
  width: number;
  height: number;
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
  createdAt: Date;
  updatedAt: Date;
  isPublic?: boolean;
  tags?: string[];
}
