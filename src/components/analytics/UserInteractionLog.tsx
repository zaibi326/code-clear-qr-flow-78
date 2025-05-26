
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Filter, Eye, MapPin, Clock } from 'lucide-react';

interface InteractionLog {
  id: string;
  userId: string;
  qrCodeId: string;
  campaignName: string;
  action: 'scan' | 'click' | 'conversion' | 'bounce';
  timestamp: Date;
  userAgent: string;
  ipAddress: string;
  location: {
    country: string;
    city: string;
  };
  duration: number; // seconds on page
  referrer?: string;
}

const mockInteractionLogs: InteractionLog[] = [
  {
    id: 'int-1',
    userId: 'user-123',
    qrCodeId: 'qr-001',
    campaignName: 'Summer Promo 2024',
    action: 'scan',
    timestamp: new Date('2024-05-26T10:30:00Z'),
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    ipAddress: '192.168.1.100',
    location: { country: 'USA', city: 'New York' },
    duration: 45,
    referrer: 'direct'
  },
  {
    id: 'int-2',
    userId: 'user-456',
    qrCodeId: 'qr-002',
    campaignName: 'Product Launch',
    action: 'conversion',
    timestamp: new Date('2024-05-26T11:15:00Z'),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.101',
    location: { country: 'Canada', city: 'Toronto' },
    duration: 120,
    referrer: 'social'
  },
  {
    id: 'int-3',
    userId: 'user-789',
    qrCodeId: 'qr-003',
    campaignName: 'Holiday Sale',
    action: 'bounce',
    timestamp: new Date('2024-05-26T12:00:00Z'),
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    ipAddress: '192.168.1.102',
    location: { country: 'UK', city: 'London' },
    duration: 5,
    referrer: 'email'
  }
];

export function UserInteractionLog() {
  const [logs, setLogs] = useState<InteractionLog[]>(mockInteractionLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.qrCodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    const variants = {
      scan: 'bg-blue-100 text-blue-700',
      click: 'bg-green-100 text-green-700',
      conversion: 'bg-purple-100 text-purple-700',
      bounce: 'bg-red-100 text-red-700'
    };
    return variants[action as keyof typeof variants] || 'bg-gray-100 text-gray-700';
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Interaction Log</span>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search campaigns, QR codes, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="scan">Scans Only</SelectItem>
              <SelectItem value="click">Clicks Only</SelectItem>
              <SelectItem value="conversion">Conversions Only</SelectItem>
              <SelectItem value="bounce">Bounces Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {log.timestamp.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.campaignName}</TableCell>
                  <TableCell className="font-mono text-sm">{log.qrCodeId}</TableCell>
                  <TableCell>
                    <Badge className={getActionBadge(log.action)}>
                      {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {log.location.city}, {log.location.country}
                    </div>
                  </TableCell>
                  <TableCell>{formatDuration(log.duration)}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-gray-600">
                    {log.userAgent}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Showing {filteredLogs.length} of {logs.length} interactions</span>
          <div className="flex items-center gap-2">
            <span>Real-time updates:</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
