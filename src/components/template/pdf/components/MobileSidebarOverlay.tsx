
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
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
      onClick={onClick}
    />
  );
};
