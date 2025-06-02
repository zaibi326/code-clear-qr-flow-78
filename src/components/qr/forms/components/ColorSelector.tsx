
import React from 'react';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface ColorSelectorProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  id: string;
}

export function ColorSelector({ label, color, onChange, id }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-full h-10 rounded border border-gray-300 cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: color }}
          onClick={() => document.getElementById(id)?.click()}
        >
          <span className="text-xs font-medium" style={{ 
            color: color === '#000000' || color === '#FFFFFF' ? (color === '#000000' ? '#FFFFFF' : '#000000') : '#000000'
          }}>
            {color}
          </span>
        </div>
        <input
          id={id}
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
        />
      </div>
    </div>
  );
}
