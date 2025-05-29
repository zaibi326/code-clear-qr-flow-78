
import React from 'react';
import { FrequentlyUsedSection } from './qr-types/FrequentlyUsedSection';
import { MoreQRTypesSection } from './qr-types/MoreQRTypesSection';
import { QRTypeStatsSection } from './qr-types/QRTypeStatsSection';

export function QRCodeTypeSelector() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900">
          Let's build your first dynamic QR Code
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from our wide range of QR code types to create engaging experiences for your audience
        </p>
      </div>

      {/* Frequently Used Section */}
      <FrequentlyUsedSection />

      {/* More QR Code Types Section */}
      <MoreQRTypesSection />

      {/* Quick Stats */}
      <QRTypeStatsSection />
    </div>
  );
}
