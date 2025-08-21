
import React, { useRef, useEffect, useState } from 'react';
import type { PDFPageRender } from '@/hooks/usePDFRenderer';

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
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

  // Prepare fallback image from the provided page canvas
  useEffect(() => {
    try {
      if (pageRender?.canvas) {
        const url = pageRender.canvas.toDataURL('image/png');
        setFallbackSrc(url);
        setIsLoaded(true);
      } else {
        setFallbackSrc(null);
        setIsLoaded(false);
      }
    } catch (e) {
      // If toDataURL fails for any reason, just skip fallback
      setFallbackSrc(null);
      setIsLoaded(false);
      console.warn('PDFCanvas fallback image generation failed:', e);
    }
  }, [pageRender, zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pageRender) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsLoaded(false);
      return;
    }

    // Ensure we have sane dimensions
    const targetWidth = (pageRender.width || pageRender.canvas?.width || 800) * zoom;
    const targetHeight = (pageRender.height || pageRender.canvas?.height || 1000) * zoom;

    // Set canvas pixel dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Reset transform, clear and scale context
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(zoom, zoom);

    // Draw the original PDF page canvas
    try {
      if (pageRender.canvas) {
        ctx.drawImage(pageRender.canvas, 0, 0);
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
      }
    } catch (e) {
      console.error('PDFCanvas draw failed:', e);
      setIsLoaded(false);
    }
  }, [pageRender, zoom]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onTextClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;

    onTextClick(x, y);
  };

  const displayWidth = pageRender.width * zoom;
  const displayHeight = pageRender.height * zoom;

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: displayWidth,
        height: displayHeight,
        maxWidth: '100%',
      }}
    >
      {/* Always show PDF content via image to ensure visibility */}
      {fallbackSrc && (
        <img
          src={fallbackSrc}
          alt="PDF page"
          className="absolute inset-0 pointer-events-none z-0"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          draggable={false}
        />
      )}

      {/* Primary drawing surface (on top so clicks work consistently) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer z-10"
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
};
