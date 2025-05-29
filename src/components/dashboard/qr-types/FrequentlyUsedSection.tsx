
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { QRTypeCard } from './QRTypeCard';
import { frequentlyUsedQRTypes } from './qrTypeData';

export function FrequentlyUsedSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          FREQUENTLY USED ✨
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {frequentlyUsedQRTypes.map((qrType) => (
            <QRTypeCard key={qrType.id} qrType={qrType} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
