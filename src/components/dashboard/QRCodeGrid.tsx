
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode, Eye, MoreHorizontal, Download, Edit, Trash2, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface QRCodeGridProps {
  activeTab: string;
  viewMode: string;
  searchQuery?: string;
}

const qrCodeData = [
  {
    id: 1,
    name: "Summer Campaign 2024",
    type: "dynamic",
    category: "URL",
    url: "https://example.com/summer",
    scans: 2543,
    created: "2024-01-15",
    status: "active",
    qrImage: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Product Catalog",
    type: "dynamic", 
    category: "PDF",
    url: "https://example.com/catalog.pdf",
    scans: 1876,
    created: "2024-01-12",
    status: "active",
    qrImage: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Contact Information",
    type: "static",
    category: "vCard",
    url: "Contact details",
    scans: 892,
    created: "2024-01-10",
    status: "active",
    qrImage: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Wi-Fi Network",
    type: "static",
    category: "WiFi",
    url: "Network: GuestWiFi",
    scans: 456,
    created: "2024-01-08",
    status: "active",
    qrImage: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Event Registration",
    type: "dynamic",
    category: "Form",
    url: "https://example.com/event",
    scans: 1234,
    created: "2024-01-05",
    status: "inactive",
    qrImage: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Menu QR Code",
    type: "dynamic",
    category: "Menu",
    url: "https://restaurant.com/menu",
    scans: 3421,
    created: "2024-01-03",
    status: "active",
    qrImage: "/placeholder.svg"
  }
];

export function QRCodeGrid({ activeTab, viewMode, searchQuery = '' }: QRCodeGridProps) {
  const { toast } = useToast();
  const [qrCodes, setQrCodes] = useState(qrCodeData);

  const filteredData = qrCodes.filter(qr => {
    // Filter by search query
    const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qr.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qr.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by active tab
    let matchesTab = true;
    if (activeTab === 'dynamic') matchesTab = qr.type === 'dynamic';
    else if (activeTab === 'static') matchesTab = qr.type === 'static';
    else if (activeTab === 'active') matchesTab = qr.status === 'active';
    else if (activeTab === 'inactive') matchesTab = qr.status === 'inactive';
    
    return matchesSearch && matchesTab;
  });

  const handleEdit = (qr: any) => {
    console.log('Edit QR Code:', qr.id);
    toast({
      title: "Edit QR Code",
      description: `Editing ${qr.name}`,
    });
  };

  const handleDownload = (qr: any) => {
    console.log('Download QR Code:', qr.id);
    toast({
      title: "Download Started",
      description: `Downloading ${qr.name}`,
    });
  };

  const handleDuplicate = (qr: any) => {
    console.log('Duplicate QR Code:', qr.id);
    const duplicatedQR = {
      ...qr,
      id: Date.now(),
      name: `${qr.name} (Copy)`,
      created: new Date().toISOString().split('T')[0]
    };
    setQrCodes([duplicatedQR, ...qrCodes]);
    toast({
      title: "QR Code Duplicated",
      description: `${qr.name} has been duplicated`,
    });
  };

  const handleDelete = (qr: any) => {
    console.log('Delete QR Code:', qr.id);
    setQrCodes(qrCodes.filter(item => item.id !== qr.id));
    toast({
      title: "QR Code Deleted",
      description: `${qr.name} has been deleted`,
      variant: "destructive",
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">QR Codes ({filteredData.length})</h3>
        </div>
        <div className="divide-y">
          {filteredData.map((qr) => (
            <div key={qr.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{qr.name}</h4>
                  <p className="text-sm text-gray-500">{qr.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <Badge variant={qr.type === 'dynamic' ? 'default' : 'secondary'}>
                  {qr.type}
                </Badge>
                <Badge variant="outline">{qr.category}</Badge>
                <div className="text-right">
                  <p className="font-medium">{qr.scans.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">scans</p>
                </div>
                <Badge variant={qr.status === 'active' ? 'default' : 'secondary'}>
                  {qr.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(qr)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(qr)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(qr)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(qr)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">QR Codes ({filteredData.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((qr) => (
          <Card key={qr.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{qr.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{qr.url}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(qr)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(qr)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(qr)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(qr)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-2">
                  <Badge variant={qr.type === 'dynamic' ? 'default' : 'secondary'} className="text-xs">
                    {qr.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {qr.category}
                  </Badge>
                </div>
                <Badge variant={qr.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {qr.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>{qr.scans.toLocaleString()}</span>
                </div>
                <span className="text-gray-500">{qr.created}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
