
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

const qrCodeData = [
  {
    id: 'QR001',
    name: 'Homepage Link',
    campaign: 'Summer Promo',
    totalScans: 2543,
    lastScan: '2024-01-15 14:32',
    location: 'New York, US',
    status: 'active',
    trend: 'up',
    changePercent: 12.5
  },
  {
    id: 'QR002', 
    name: 'Product Catalog',
    campaign: 'Product Launch',
    totalScans: 1876,
    lastScan: '2024-01-15 11:45',
    location: 'London, UK',
    status: 'active',
    trend: 'up',
    changePercent: 8.3
  },
  {
    id: 'QR003',
    name: 'Contact Info',
    campaign: 'Brand Awareness',
    totalScans: 1234,
    lastScan: '2024-01-14 16:20',
    location: 'Toronto, CA',
    status: 'active',
    trend: 'down',
    changePercent: -3.2
  },
  {
    id: 'QR004',
    name: 'Store Locator',
    campaign: 'Store Events',
    totalScans: 987,
    lastScan: '2024-01-14 09:15',
    location: 'Sydney, AU',
    status: 'active',
    trend: 'up',
    changePercent: 15.7
  },
  {
    id: 'QR005',
    name: 'Special Offer',
    campaign: 'Holiday Sale',
    totalScans: 756,
    lastScan: '2024-01-13 18:44',
    location: 'Berlin, DE',
    status: 'paused',
    trend: 'down',
    changePercent: -5.1
  }
];

export function QRCodeTable() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = qrCodeData.filter(qr => 
    qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>QR Code Performance</CardTitle>
            <CardDescription>Detailed analytics for each QR code</CardDescription>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>QR Code Name</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead className="text-right">Total Scans</TableHead>
              <TableHead>Last Scan</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((qr) => (
              <TableRow key={qr.id}>
                <TableCell className="font-medium">{qr.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{qr.campaign}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {qr.totalScans.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {qr.lastScan}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {qr.location}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={qr.status === 'active' ? 'default' : 'secondary'}
                    className={qr.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {qr.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {qr.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      qr.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {qr.changePercent > 0 ? '+' : ''}{qr.changePercent}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
