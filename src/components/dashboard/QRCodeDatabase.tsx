
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, Edit, Trash2, Tag, ExternalLink } from 'lucide-react';

interface QRCodeRecord {
  id: string;
  name: string;
  type: string;
  content: string;
  project: string;
  campaign: string;
  tags: string[];
  scans: number;
  uniqueScans: number;
  lastScan: string;
  createdAt: string;
  status: 'active' | 'paused' | 'expired';
}

const mockQRCodes: QRCodeRecord[] = [
  {
    id: 'qr-001',
    name: 'Summer Campaign Landing',
    type: 'URL',
    content: 'https://example.com/summer',
    project: 'Summer Marketing 2024',
    campaign: 'Social Media Push',
    tags: ['summer', 'social', 'promotion'],
    scans: 245,
    uniqueScans: 189,
    lastScan: '2 hours ago',
    createdAt: '2024-05-20',
    status: 'active'
  },
  {
    id: 'qr-002',
    name: 'Product Demo QR',
    type: 'URL',
    content: 'https://demo.product.com',
    project: 'Product Launch Q4',
    campaign: 'Demo Campaign',
    tags: ['product', 'demo', 'launch'],
    scans: 156,
    uniqueScans: 134,
    lastScan: '1 day ago',
    createdAt: '2024-05-18',
    status: 'active'
  },
  {
    id: 'qr-003',
    name: 'Holiday Promo',
    type: 'URL',
    content: 'https://shop.com/holiday',
    project: 'Holiday Promotions',
    campaign: 'Black Friday',
    tags: ['holiday', 'promo', 'sale'],
    scans: 567,
    uniqueScans: 423,
    lastScan: '3 days ago',
    createdAt: '2024-05-15',
    status: 'paused'
  }
];

export function QRCodeDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const filteredQRCodes = mockQRCodes.filter(qr => {
    const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || qr.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(mockQRCodes.flatMap(qr => qr.tags)));

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-700 border-green-200',
      paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      expired: 'bg-red-100 text-red-700 border-red-200'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>QR Code Database</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search QR codes, projects, campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedTag === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              All Tags
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className="flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QR Code</TableHead>
                <TableHead>Project/Campaign</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Scan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQRCodes.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{qr.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {qr.content.substring(0, 30)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{qr.project}</div>
                      <div className="text-xs text-gray-500">{qr.campaign}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {qr.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{qr.scans}</div>
                      <div className="text-xs text-gray-500">{qr.uniqueScans} unique</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadge(qr.status)} border`}>
                      {qr.status.charAt(0).toUpperCase() + qr.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {qr.lastScan}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Showing {filteredQRCodes.length} of {mockQRCodes.length} QR codes</span>
          <div className="text-xs">
            Total scans across all QR codes: {mockQRCodes.reduce((sum, qr) => sum + qr.scans, 0).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
