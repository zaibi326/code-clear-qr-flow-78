
import { useState, useRef } from 'react';
import { Canvas, FabricObject } from 'fabric';

export interface CanvasElement {
  id: string;
  type: 'qr' | 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

export const useCanvasState = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const isInitializedRef = useRef(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [zoom, setZoom] = useState(1);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);

  return {
    canvasRef,
    fabricCanvasRef,
    isInitializedRef,
    initTimeoutRef,
    selectedObject,
    setSelectedObject,
    canvasElements,
    setCanvasElements,
    zoom,
    setZoom,
    backgroundLoaded,
    setBackgroundLoaded,
    backgroundError,
    setBackgroundError
  };
};
