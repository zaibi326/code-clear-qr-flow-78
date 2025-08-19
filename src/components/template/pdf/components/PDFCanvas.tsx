
import React, { useRef, useEffect, useState } from 'react';
import { PDFPageRender } from '@/hooks/usePDFRenderer';

interface PDFCanvasProps {
  pageRender: PDFPageRender;
  zoom: number;
  onTextClick?: (x: number, y: number) => void;
  className?: string;
}

export const PDFCanvas: React.FC<PDFCanvasProps> = ({
  pageRender,
  zoom,
  onTextClick,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pageRender) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = pageRender.width * zoom;
    canvas.height = pageRender.height * zoom;

    // Reset transform, clear and scale context
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(zoom, zoom);

    // Draw the PDF page
    ctx.drawImage(pageRender.canvas, 0, 0);
    setIsLoaded(true);
  }, [pageRender, zoom]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onTextClick || !isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;

    onTextClick(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`cursor-pointer ${className}`}
      onClick={handleCanvasClick}
      style={{
        width: pageRender.width * zoom,
        height: pageRender.height * zoom,
        maxWidth: '100%'
      }}
    />
  );
};
