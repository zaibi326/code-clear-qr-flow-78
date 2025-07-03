
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface PDFQRCode {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
  backgroundColor: string;
  foregroundColor: string;
}

interface CanvaStyleQRCodeRendererProps {
  qrCode: PDFQRCode;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const CanvaStyleQRCodeRenderer: React.FC<CanvaStyleQRCodeRendererProps> = ({
  qrCode,
  scale,
  isSelected,
  onSelect
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(qrCode.content, {
          width: qrCode.width,
          color: {
            dark: qrCode.foregroundColor,
            light: qrCode.backgroundColor
          },
          margin: 1
        });
        setQrDataUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (qrCode.content) {
      generateQR();
    }
  }, [qrCode.content, qrCode.width, qrCode.foregroundColor, qrCode.backgroundColor]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${qrCode.x * scale}px`,
    top: `${qrCode.y * scale}px`,
    width: `${qrCode.width * scale}px`,
    height: `${qrCode.height * scale}px`,
    opacity: qrCode.opacity,
    transform: `rotate(${qrCode.rotation}deg)`,
    cursor: 'pointer',
    zIndex: isSelected ? 50 : 30,
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: isSelected ? '0 0 0 2px #3B82F6' : 'none'
  };

  return (
    <>
      {qrDataUrl && (
        <img
          src={qrDataUrl}
          alt="QR Code"
          style={baseStyle}
          onClick={handleClick}
          draggable={false}
        />
      )}
      
      {/* Selection handles */}
      {isSelected && (
        <div style={{ ...baseStyle, border: '2px dashed #3B82F6', backgroundColor: 'transparent' }}>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </>
  );
};
