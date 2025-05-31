
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Eye, Zap, TrendingUp } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
