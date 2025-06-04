
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Target, TrendingUp } from 'lucide-react';

interface RegionalHeatmapSummaryProps {
  totalScans: number;
  topRegion: string;
  avgGrowth: string;
}

export function RegionalHeatmapSummary({ totalScans, topRegion, avgGrowth }: RegionalHeatmapSummaryProps) {
  return (
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
            <p className="text-2xl font-bold text-emerald-900">{topRegion}</p>
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
            <Badge className="bg-purple-100 text-purple-800 font-bold">{avgGrowth}</Badge>
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-700 mb-1">Avg Growth</p>
            <p className="text-3xl font-bold text-purple-900">{avgGrowth}</p>
            <p className="text-xs text-gray-500 mt-1">month over month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
