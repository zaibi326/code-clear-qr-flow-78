
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Eye, Zap } from 'lucide-react';

const statsData = [
  {
    title: "Total QR Codes",
    value: "234",
    icon: QrCode,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Dynamic QR Codes",
    value: "186",
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Static QR Codes", 
    value: "48",
    icon: QrCode,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Total Scans",
    value: "12,345",
    icon: Eye,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export function QRCodeStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
