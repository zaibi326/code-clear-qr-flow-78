
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Globe, TrendingUp, Users, Eye, Filter, BarChart3, Activity, Zap, Target } from 'lucide-react';

const regionData = [
  { 
    id: 1, 
    region: 'United States', 
    scans: 4521, 
    percentage: 36.2,
    growth: '+12.5%',
    flag: '🇺🇸',
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
    flag: '🇩🇪',
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
    flag: '🇬🇧',
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
    flag: '🇫🇷',
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
    flag: '🇯🇵',
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
    flag: '🇦🇺',
    cities: [
      { name: 'Sydney', scans: 432 },
      { name: 'Melbourne', scans: 298 },
      { name: 'Brisbane', scans: 134 }
    ]
  }
];

export function RegionalHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const totalScans = regionData.reduce((sum, region) => sum + region.scans, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header with Interactive Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-lg"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-4xl font-bold">Global Performance Map</h3>
                <p className="text-teal-100 text-lg">Geographic distribution and regional insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Globe className="h-4 w-4" />
                <span className="font-medium">{regionData.length} regions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">
                  {regionData.reduce((sum, region) => sum + region.cities.length, 0)} cities
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={`${viewMode === 'cards' 
                  ? 'bg-white text-teal-600 shadow-lg' 
                  : 'text-white hover:bg-white/20'
                }`}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={`${viewMode === 'table' 
                  ? 'bg-white text-teal-600 shadow-lg' 
                  : 'text-white hover:bg-white/20'
                }`}
              >
                Table
              </Button>
            </div>
            <Button className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Eye className="h-6 w-6" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 font-bold">Live</Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Total Scans</p>
              <p className="text-3xl font-bold text-blue-900">{totalScans.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">across all regions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Target className="h-6 w-6" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 font-bold">#1</Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-1">Top Region</p>
              <p className="text-2xl font-bold text-emerald-900">United States</p>
              <p className="text-xs text-gray-500 mt-1">highest performance</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <Badge className="bg-purple-100 text-purple-800 font-bold">+11.9%</Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 mb-1">Avg Growth</p>
              <p className="text-3xl font-bold text-purple-900">+11.9%</p>
              <p className="text-xs text-gray-500 mt-1">month over month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Interactive World Map */}
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

      {/* Regional Data Display */}
      {viewMode === 'cards' ? (
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
      ) : (
        // Table View
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
      )}
    </div>
  );
}
