
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ToolsHeader } from './toolbar/ToolsHeader';
import { AddElementsSection } from './toolbar/AddElementsSection';
import { CanvasControlsSection } from './toolbar/CanvasControlsSection';
import { QuickSettingsSection } from './toolbar/QuickSettingsSection';

interface CanvasToolbarProps {
  qrUrl: string;
  setQrUrl: (url: string) => void;
  textContent: string;
  setTextContent: (text: string) => void;
  onAddQRCode: () => void;
  onAddText: () => void;
  onAddShape: (type: 'rectangle' | 'circle') => void;
  onUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onZoomCanvas: (direction: 'in' | 'out') => void;
  onResetCanvas: () => void;
  onDeleteSelected: () => void;
  hasSelectedObject: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const CanvasToolbar = ({
  qrUrl,
  setQrUrl,
  textContent,
  setTextContent,
  onAddQRCode,
  onAddText,
  onAddShape,
  onUploadImage,
  onZoomCanvas,
  onResetCanvas,
  onDeleteSelected,
  hasSelectedObject,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: CanvasToolbarProps) => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <ToolsHeader title="Tools" />
          
          <AddElementsSection
            onAddQRCode={onAddQRCode}
            onAddText={onAddText}
            onAddShape={onAddShape}
            onUploadImage={onUploadImage}
          />

          <Separator className="my-6" />

          <CanvasControlsSection
            onZoomCanvas={onZoomCanvas}
            onResetCanvas={onResetCanvas}
            onDeleteSelected={onDeleteSelected}
            hasSelectedObject={hasSelectedObject}
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          <Separator className="my-6" />

          <QuickSettingsSection
            qrUrl={qrUrl}
            setQrUrl={setQrUrl}
            textContent={textContent}
            setTextContent={setTextContent}
          />
        </div>
      </div>
    </div>
  );
};
