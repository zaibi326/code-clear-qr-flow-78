
import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeCard } from './QRCodeCard';
import { QRCodeListItem } from './QRCodeListItem';

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
  },
  {
    id: 7,
    name: "Product Catalog (Copy)",
    type: "dynamic",
    category: "PDF", 
    url: "https://example.com/catalog.pdf",
    scans: 1876,
    created: "2025-05-31",
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
    console.log('Edit QR Code:', qr.id, qr.name);
    toast({
      title: "Edit QR Code",
      description: `Opening editor for ${qr.name}`,
    });
  };

  const handleDownload = (qr: any) => {
    console.log('Download QR Code:', qr.id, qr.name);
    
    // Create a simple QR code-like image download simulation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      // Create a simple QR pattern
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#fff';
      ctx.fillRect(10, 10, 180, 180);
      ctx.fillStyle = '#000';
      for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 18; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(20 + i * 10, 20 + j * 10, 8, 8);
          }
        }
      }
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${qr.name.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download Started",
          description: `${qr.name} QR code downloaded successfully`,
        });
      }
    });
  };

  const handleDuplicate = (qr: any) => {
    console.log('Duplicate QR Code:', qr.id, qr.name);
    const duplicatedQR = {
      ...qr,
      id: Date.now(),
      name: `${qr.name} (Copy)`,
      created: new Date().toISOString().split('T')[0]
    };
    setQrCodes([duplicatedQR, ...qrCodes]);
    toast({
      title: "QR Code Duplicated",
      description: `${qr.name} has been duplicated successfully`,
    });
  };

  const handleDelete = (qr: any) => {
    console.log('Delete QR Code:', qr.id, qr.name);
    
    // Create confirmation dialog
    const confirmDelete = window.confirm(`Are you sure you want to delete "${qr.name}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      setQrCodes(qrCodes.filter(item => item.id !== qr.id));
      toast({
        title: "QR Code Deleted",
        description: `${qr.name} has been deleted successfully`,
        variant: "destructive",
      });
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">QR Codes ({filteredData.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredData.map((qr) => (
            <QRCodeListItem
              key={qr.id}
              qr={qr}
              onEdit={handleEdit}
              onDownload={handleDownload}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
        
        {filteredData.length === 0 && (
          <div className="p-8 text-center">
            <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No QR codes found</p>
          </div>
        )}
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
          <QRCodeCard
            key={qr.id}
            qr={qr}
            onEdit={handleEdit}
            onDownload={handleDownload}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        ))}
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No QR codes found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
