
import React from 'react';
import { QrCode } from 'lucide-react';

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = React.memo(({ collapsed }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-center py-4 px-3 border-b">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
          <QrCode className="h-6 w-6 text-white" />
        </div>
        <span
          className={`font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          ClearQR
        </span>
      </div>
    </div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';
