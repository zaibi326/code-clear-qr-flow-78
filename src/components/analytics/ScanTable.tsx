
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Download, Search, Smartphone, Laptop, MapPin } from 'lucide-react';

interface ScanData {
  id: string;
  qrId: string;
  campaignName: string;
  timestamp: string;
  location: string;
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  conversion: boolean;
}

const mockScanData: ScanData[] = [
  { id: 'scan-1', qrId: 'QR-12345', campaignName: 'Summer Promo', timestamp: '2024-05-26T08:23:14Z', location: 'New York, USA', device: 'mobile', browser: 'Chrome', os: 'iOS', conversion: true },
  { id: 'scan-2', qrId: 'QR-12346', campaignName: 'Summer Promo', timestamp: '2024-05-26T08:45:32Z', location: 'Los Angeles, USA', device: 'desktop', browser: 'Firefox', os: 'Windows', conversion: false },
  { id: 'scan-3', qrId: 'QR-12347', campaignName: 'Product Launch', timestamp: '2024-05-26T09:12:05Z', location: 'London, UK', device: 'mobile', browser: 'Safari', os: 'iOS', conversion: true },
  { id: 'scan-4', qrId: 'QR-12348', campaignName: 'Product Launch', timestamp: '2024-05-26T10:34:18Z', location: 'Sydney, Australia', device: 'mobile', browser: 'Chrome', os: 'Android', conversion: false },
  { id: 'scan-5', qrId: 'QR-12349', campaignName: 'Holiday Promo', timestamp: '2024-05-26T11:22:47Z', location: 'Berlin, Germany', device: 'desktop', browser: 'Chrome', os: 'macOS', conversion: true },
  { id: 'scan-6', qrId: 'QR-12350', campaignName: 'Summer Promo', timestamp: '2024-05-26T12:09:33Z', location: 'Tokyo, Japan', device: 'tablet', browser: 'Safari', os: 'iPadOS', conversion: false },
  { id: 'scan-7', qrId: 'QR-12351', campaignName: 'Holiday Promo', timestamp: '2024-05-26T12:45:21Z', location: 'Paris, France', device: 'mobile', browser: 'Chrome', os: 'Android', conversion: true },
  { id: 'scan-8', qrId: 'QR-12352', campaignName: 'Product Launch', timestamp: '2024-05-26T13:17:09Z', location: 'Toronto, Canada', device: 'mobile', browser: 'Safari', os: 'iOS', conversion: false },
  { id: 'scan-9', qrId: 'QR-12353', campaignName: 'Summer Promo', timestamp: '2024-05-26T14:03:56Z', location: 'Madrid, Spain', device: 'desktop', browser: 'Edge', os: 'Windows', conversion: true },
  { id: 'scan-10', qrId: 'QR-12354', campaignName: 'Holiday Promo', timestamp: '2024-05-26T15:28:42Z', location: 'Rome, Italy', device: 'mobile', browser: 'Chrome', os: 'Android', conversion: false },
];

export function ScanTable() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Ensure filter options have non-empty values
  const filterOptions = [
    { value: 'all', label: 'All Scans' },
    { value: 'converted', label: 'Converted' },
    { value: 'not-converted', label: 'Not Converted' }
  ].filter(option => option.value.trim() !== '');

  console.log('ScanTable rendering with filter:', filter);
  console.log('Filter options:', filterOptions);
  
  const filteredData = mockScanData.filter(scan => {
    const matchesSearch = search === '' || 
      scan.qrId.toLowerCase().includes(search.toLowerCase()) ||
      scan.campaignName.toLowerCase().includes(search.toLowerCase()) ||
      scan.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      (filter === 'converted' && scan.conversion) ||
      (filter === 'not-converted' && !scan.conversion);
    
    return matchesSearch && matchesFilter;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search QR, campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QR Code ID</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Converted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-medium">{scan.qrId}</TableCell>
                  <TableCell>{scan.campaignName}</TableCell>
                  <TableCell>{formatDate(scan.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                      {scan.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {scan.device === 'mobile' && <Smartphone className="h-3.5 w-3.5 mr-1 text-blue-500" />}
                      {scan.device === 'desktop' && <Laptop className="h-3.5 w-3.5 mr-1 text-green-500" />}
                      {scan.device === 'tablet' && <Smartphone className="h-3.5 w-3.5 mr-1 text-amber-500" />}
                      <span className="capitalize">{scan.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {scan.conversion ? (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        <Check className="h-3 w-3 mr-1" />
                        Yes
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        No
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div>Showing {filteredData.length} of {mockScanData.length} scans</div>
          <div>Page 1 of 1</div>
        </div>
      </CardContent>
    </Card>
  );
}
