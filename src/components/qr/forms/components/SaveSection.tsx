
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveSectionProps {
  onSave: () => void;
  disabled?: boolean;
}

export function SaveSection({ onSave, disabled }: SaveSectionProps) {
  return (
    <div className="flex justify-end pt-4">
      <Button 
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 text-white px-8 flex items-center gap-2"
        disabled={disabled}
      >
        <Save className="w-4 h-4" />
        Save QR Code
      </Button>
    </div>
  );
}
