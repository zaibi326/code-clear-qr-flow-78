
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export function RegionalHeatmapMap() {
  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <CardContent className="p-8">
        <div className="w-full h-96 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 rounded-3xl flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          
          {/* Interactive Map Pins */}
          <div className="absolute top-1/4 left-1/3 animate-bounce">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg relative">
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 animate-bounce delay-200">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="absolute top-2/3 right-1/3 animate-bounce delay-500">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="text-center z-10">
            <div className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-12 w-12 mx-auto text-blue-600 mb-2" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">Interactive World Map</h4>
            <p className="text-gray-600 mb-4">Click on regions to explore detailed analytics</p>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-sm font-medium">
              Real-time data visualization
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
