
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin } from 'lucide-react';

const regionData = [
  { 
    id: 1, 
    region: 'United States', 
    scans: 4521, 
    percentage: 36.2,
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
    cities: [
      { name: 'Sydney', scans: 432 },
      { name: 'Melbourne', scans: 298 },
      { name: 'Brisbane', scans: 134 }
    ]
  },
  { 
    id: 7, 
    region: 'Other', 
    scans: 859, 
    percentage: 6.9,
    cities: [
      { name: 'Various', scans: 859 }
    ] 
  }
];

export function RegionalHeatmap() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Geographic Distribution</h3>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500">Total regions: 7</div>
              <div className="text-xs text-gray-500">|</div>
              <div className="text-xs text-gray-500">Total cities: 19</div>
            </div>
          </div>

          {/* Placeholder for an actual map visualization */}
          <div className="w-full h-60 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>Interactive map would render here</p>
              <p className="text-xs mt-2">Displaying scan density across regions</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country/Region</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Top Cities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionData.map((region) => (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{region.region}</TableCell>
                  <TableCell>{region.scans.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                      <span>{region.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {region.cities.map((city, index) => (
                        <span key={city.name}>
                          {city.name} ({city.scans})
                          {index < region.cities.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
