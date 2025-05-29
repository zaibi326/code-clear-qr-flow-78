
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { QRTypeCard } from './QRTypeCard';
import { moreQRTypes } from './qrTypeData';

export function MoreQRTypesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Star className="h-5 w-5 text-purple-500" />
          MORE QR CODE TYPES 💫
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moreQRTypes.map((qrType) => (
            <QRTypeCard key={qrType.id} qrType={qrType} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
