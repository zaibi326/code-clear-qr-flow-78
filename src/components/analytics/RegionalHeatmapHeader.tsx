
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Filter } from 'lucide-react';

interface RegionalHeatmapHeaderProps {
  regionCount: number;
  cityCount: number;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
}

export function RegionalHeatmapHeader({ 
  regionCount, 
  cityCount, 
  viewMode, 
  setViewMode 
}: RegionalHeatmapHeaderProps) {
  return (
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
              <span className="font-medium">{regionCount} regions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{cityCount} cities</span>
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
  );
}
