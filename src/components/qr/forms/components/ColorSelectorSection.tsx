
import React from 'react';
import { ColorSelector } from './ColorSelector';

interface ColorSelectorSectionProps {
  foregroundColor: string;
  backgroundColor: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

export function ColorSelectorSection({ 
  foregroundColor, 
  backgroundColor, 
  onForegroundChange, 
  onBackgroundChange 
}: ColorSelectorSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ColorSelector
        label="Select Foreground Color"
        color={foregroundColor || '#000000'}
        onChange={onForegroundChange}
        id="foreground-color-input"
      />
      <ColorSelector
        label="Select Background Color"
        color={backgroundColor || '#FFFFFF'}
        onChange={onBackgroundChange}
        id="background-color-input"
      />
    </div>
  );
}
