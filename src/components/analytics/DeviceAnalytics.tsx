
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

export function DeviceAnalytics() {
  const mockData = {
    deviceBreakdown: {
      mobile: 68.5,
      desktop: 23.8,
      tablet: 7.7
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white shadow-lg">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Device Analytics
            </span>
            <p className="text-sm text-gray-600 font-normal">User device preferences</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {[
            { type: 'Mobile', value: mockData.deviceBreakdown.mobile, icon: Smartphone, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
            { type: 'Desktop', value: mockData.deviceBreakdown.desktop, icon: Monitor, color: 'purple', gradient: 'from-purple-500 to-violet-500' },
            { type: 'Tablet', value: mockData.deviceBreakdown.tablet, icon: Tablet, color: 'orange', gradient: 'from-orange-500 to-amber-500' }
          ].map((device, index) => (
            <div key={device.type} className={`group/device hover:bg-${device.color}-50 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-${device.color}-200`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-gradient-to-r ${device.gradient} rounded-xl text-white shadow-lg group-hover/device:scale-110 transition-transform`}>
                    <device.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 text-lg">{device.type}</span>
                    <p className="text-xs text-gray-500">devices</p>
                  </div>
                </div>
                <Badge className={`bg-${device.color}-100 text-${device.color}-800 font-bold text-lg px-3 py-1`}>
                  {device.value}%
                </Badge>
              </div>
              <div className="relative">
                <Progress value={device.value} className="h-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
