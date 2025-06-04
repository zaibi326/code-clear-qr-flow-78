
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Download, QrCode } from 'lucide-react';

const AdminQRCodesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock QR code data
  const qrCodes = [
    {
      id: '1',
      name: 'Restaurant Menu',
      type: 'URL',
      owner: 'John Doe',
      scans: 1234,
      status: 'active',
      created: '2024-05-15',
      lastScan: '2024-06-04',
      content: 'https://restaurant.com/menu'
    },
    {
      id: '2',
      name: 'Business Card',
      type: 'vCard',
      owner: 'Jane Smith',
      scans: 567,
      status: 'active',
      created: '2024-05-20',
      lastScan: '2024-06-03',
      content: 'Contact Info'
    },
    {
      id: '3',
      name: 'WiFi Access',
      type: 'WiFi',
      owner: 'Bob Johnson',
      scans: 89,
      status: 'inactive',
      created: '2024-04-10',
      lastScan: '2024-05-28',
      content: 'WiFi Network'
    },
    {
      id: '4',
      name: 'Event Registration',
      type: 'URL',
      owner: 'Alice Brown',
      scans: 2341,
      status: 'active',
      created: '2024-05-30',
      lastScan: '2024-06-04',
      content: 'https://event.com/register'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'URL': 'bg-blue-100 text-blue-800',
      'vCard': 'bg-purple-100 text-purple-800',
      'WiFi': 'bg-green-100 text-green-800',
      'SMS': 'bg-yellow-100 text-yellow-800',
      'Email': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle>QR Codes ({qrCodes.length})</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search QR codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QR Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Scan</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrCodes.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <QrCode className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{qr.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-32">
                          {qr.content}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(qr.type)}</TableCell>
                  <TableCell className="text-sm">{qr.owner}</TableCell>
                  <TableCell>{getStatusBadge(qr.status)}</TableCell>
                  <TableCell className="font-medium">{qr.scans.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-gray-500">{qr.created}</TableCell>
                  <TableCell className="text-sm text-gray-500">{qr.lastScan}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQRCodesTable;
