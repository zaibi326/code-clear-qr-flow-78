
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe,
  MapPin
} from 'lucide-react';

export function GeographicPerformance() {
  const mockData = {
    topCountries: [
      { name: 'United States', scans: 15234, percentage: 33.4, flag: '🇺🇸' },
      { name: 'United Kingdom', scans: 8765, percentage: 19.2, flag: '🇬🇧' },
      { name: 'Germany', scans: 6543, percentage: 14.3, flag: '🇩🇪' },
      { name: 'France', scans: 4321, percentage: 9.5, flag: '🇫🇷' },
      { name: 'Canada', scans: 3210, percentage: 7.0, flag: '🇨🇦' }
    ]
  };

  return (
    <Card className="xl:col-span-2 group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Geographic Performance
            </span>
            <p className="text-sm text-gray-600 font-normal">Top performing regions worldwide</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockData.topCountries.map((country, index) => (
            <div key={index} className="group/item relative overflow-hidden hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="text-2xl">{country.flag}</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 text-lg">{country.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">Active region</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                    {country.scans.toLocaleString()}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">total scans</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress 
                    value={country.percentage} 
                    className="h-3 bg-gray-200"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-12 text-right">
                  {country.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
