
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QRNameSectionProps {
  qrName: string;
  onChange: (name: string) => void;
}

export function QRNameSection({ qrName, onChange }: QRNameSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="qrName" className="text-sm font-medium text-gray-700">
        QRCode Name *
      </Label>
      <Input
        id="qrName"
        value={qrName || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter QRCode Name"
        className="w-full"
        required
      />
    </div>
  );
}
