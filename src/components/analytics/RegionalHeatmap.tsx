
import React, { useState } from 'react';
import { RegionalHeatmapHeader } from './RegionalHeatmapHeader';
import { RegionalHeatmapSummary } from './RegionalHeatmapSummary';
import { RegionalHeatmapMap } from './RegionalHeatmapMap';
import { RegionalHeatmapData } from './RegionalHeatmapData';

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
  const cityCount = regionData.reduce((sum, region) => sum + region.cities.length, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <RegionalHeatmapHeader
        regionCount={regionData.length}
        cityCount={cityCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <RegionalHeatmapSummary
        totalScans={totalScans}
        topRegion="United States"
        avgGrowth="+11.9%"
      />

      <RegionalHeatmapMap />

      <RegionalHeatmapData
        regionData={regionData}
        viewMode={viewMode}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
    </div>
  );
}
