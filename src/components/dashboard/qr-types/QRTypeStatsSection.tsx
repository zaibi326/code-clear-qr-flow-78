
import React from 'react';

export function QRTypeStatsSection() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
          <div className="text-gray-600">QR Code Types</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
          <div className="text-gray-600">Unlimited Scans</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
          <div className="text-gray-600">Analytics Tracking</div>
        </div>
      </div>
    </div>
  );
}
