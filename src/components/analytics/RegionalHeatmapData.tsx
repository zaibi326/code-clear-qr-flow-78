
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';

interface RegionData {
  id: number;
  region: string;
  scans: number;
  percentage: number;
  growth: string;
  flag: string;
  cities: Array<{ name: string; scans: number }>;
}

interface RegionalHeatmapDataProps {
  regionData: RegionData[];
  viewMode: 'table' | 'cards';
  selectedRegion: number | null;
  setSelectedRegion: (id: number | null) => void;
}

export function RegionalHeatmapData({ 
  regionData, 
  viewMode, 
  selectedRegion, 
  setSelectedRegion 
}: RegionalHeatmapDataProps) {
  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regionData.map((region) => (
          <Card 
            key={region.id} 
            className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 ${
              selectedRegion === region.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
            }`}
            onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
            
            <CardContent className="relative p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{region.flag}</div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{region.region}</h4>
                    <p className="text-sm text-gray-500">Active region</p>
                  </div>
                </div>
                <Badge className={`font-bold ${
                  region.growth.includes('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {region.growth}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Scans</span>
                  <span className="text-xl font-bold text-gray-900">{region.scans.toLocaleString()}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Share</span>
                    <span className="text-sm font-bold text-gray-700">{region.percentage}%</span>
                  </div>
                  <Progress value={region.percentage * 2} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-gray-700">Top Cities</h5>
                {region.cities.slice(0, 2).map((city, index) => (
                  <div key={city.name} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{city.name}</span>
                    <span className="font-medium text-gray-800">{city.scans.toLocaleString()}</span>
                  </div>
                ))}
                {region.cities.length > 2 && (
                  <p className="text-xs text-blue-600 font-medium">
                    +{region.cities.length - 2} more cities
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Regional Performance Data
            </span>
            <p className="text-sm text-gray-600 font-normal">Detailed analytics by region</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50">
                <TableHead className="font-bold text-gray-700 p-4">Region</TableHead>
                <TableHead className="font-bold text-gray-700">Total Scans</TableHead>
                <TableHead className="font-bold text-gray-700">Market Share</TableHead>
                <TableHead className="font-bold text-gray-700">Growth</TableHead>
                <TableHead className="font-bold text-gray-700">Top Cities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionData.map((region) => (
                <TableRow 
                  key={region.id} 
                  className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 ${
                    selectedRegion === region.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                >
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{region.flag}</span>
                      <span className="font-bold text-gray-900">{region.region}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                      {region.scans.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(region.percentage * 2, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-700">{region.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-bold ${
                      region.growth.includes('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {region.growth}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {region.cities.slice(0, 2).map((city, index) => (
                        <div key={city.name} className="text-sm">
                          <span className="font-medium text-gray-700">{city.name}</span>
                          <span className="ml-2 text-gray-500">({city.scans.toLocaleString()})</span>
                        </div>
                      ))}
                      {region.cities.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{region.cities.length - 2} more cities
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
