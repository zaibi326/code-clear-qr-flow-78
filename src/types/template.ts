
export interface QRPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Template {
  id: string;
  name: string;
  file: File | null;
  preview: string;
  qrPosition?: QRPosition;
  createdAt: Date;
  updatedAt: Date;
}
