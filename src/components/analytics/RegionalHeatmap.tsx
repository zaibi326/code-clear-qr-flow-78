
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Globe, TrendingUp, Users, Eye, Filter } from 'lucide-react';

const regionData = [
  { 
    id: 1, 
    region: 'United States', 
    scans: 4521, 
    percentage: 36.2,
    growth: '+12.5%',
    cities: [
      { name: 'New York', scans: 1245 },
      { name: 'Los Angeles', scans: 987 },
      { name: 'Chicago', scans: 765 }
    ]
  },
  { 
    id: 2, 
    region: 'Germany', 
    scans: 2134, 
    percentage: 17.1,
    growth: '+8.3%',
    cities: [
      { name: 'Berlin', scans: 845 },
      { name: 'Munich', scans: 632 },
      { name: 'Hamburg', scans: 421 }
    ] 
  },
  { 
    id: 3, 
    region: 'United Kingdom', 
    scans: 1876, 
    percentage: 15.0,
    growth: '+15.7%',
    cities: [
      { name: 'London', scans: 1021 },
      { name: 'Manchester', scans: 432 },
      { name: 'Birmingham', scans: 298 }
    ] 
  },
  { 
    id: 4, 
    region: 'France', 
    scans: 1234, 
    percentage: 9.9,
    growth: '+5.2%',
    cities: [
      { name: 'Paris', scans: 743 },
      { name: 'Lyon', scans: 287 },
      { name: 'Marseille', scans: 143 }
    ] 
  },
  { 
    id: 5, 
    region: 'Japan', 
    scans: 987, 
    percentage: 7.9,
    growth: '+22.1%',
    cities: [
      { name: 'Tokyo', scans: 576 },
      { name: 'Osaka', scans: 245 },
      { name: 'Kyoto', scans: 121 }
    ]
  },
  { 
    id: 6, 
    region: 'Australia', 
    scans: 876, 
    percentage: 7.0,
    growth: '+9.8%',
    cities: [
      { name: 'Sydney', scans: 432 },
      { name: 'Melbourne', scans: 298 },
      { name: 'Brisbane', scans: 134 }
    ]
  }
];

export function RegionalHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  const totalScans = regionData.reduce((sum, region) => sum + region.scans, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Global Performance Map
          </h3>
          <p className="text-gray-600">Geographic distribution and regional insights</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{regionData.length} regions</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {regionData.reduce((sum, region) => sum + region.cities.length, 0)} cities
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Scans</p>
                <p className="text-3xl font-bold text-blue-900">{totalScans.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl text-white">
                <Eye className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Top Region</p>
                <p className="text-2xl font-bold text-green-900">United States</p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Avg Growth</p>
                <p className="text-3xl font-bold text-purple-900">+11.9%</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Map Placeholder */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-8">
          <div className="w-full h-80 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
            <div className="text-center z-10">
              <div className="p-6 bg-white rounded-2xl shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Interactive World Map</h4>
              <p className="text-gray-600 mb-4">Click on regions to explore detailed analytics</p>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                Real-time data visualization
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Regional Data Table */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white">
              <Globe className="h-5 w-5" />
            </div>
            Regional Performance Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Region</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Scans</TableHead>
                  <TableHead className="font-semibold text-gray-700">Market Share</TableHead>
                  <TableHead className="font-semibold text-gray-700">Growth</TableHead>
                  <TableHead className="font-semibold text-gray-700">Top Cities</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionData.map((region) => (
                  <TableRow 
                    key={region.id} 
                    className={`hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                      selectedRegion === region.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                  >
                    <TableCell className="font-semibold text-gray-900">{region.region}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {region.scans.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(region.percentage * 2, 100)}%` }}
                          />
                        </div>
                        <span className="font-medium text-gray-700">{region.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 font-medium">
                        {region.growth}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {region.cities.slice(0, 2).map((city, index) => (
                          <div key={city.name} className="text-sm text-gray-600">
                            <span className="font-medium">{city.name}</span>
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
    </div>
  );
}
