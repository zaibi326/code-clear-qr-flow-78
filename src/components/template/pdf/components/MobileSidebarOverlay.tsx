
import React from 'react';

interface MobileSidebarOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

export const MobileSidebarOverlay: React.FC<MobileSidebarOverlayProps> = ({
  isVisible,
  onClick
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
      onClick={onClick}
    />
  );
};
