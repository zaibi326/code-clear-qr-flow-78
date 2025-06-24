import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeFilters } from '@/components/dashboard/QRCodeFilters';
import { QRCodeGrid } from '@/components/dashboard/QRCodeGrid';
import { QRCodeListItem } from '@/components/dashboard/QRCodeListItem';
import { TagFilter } from '@/components/tags/TagFilter';
import { Search, Filter, Download, Plus, Grid3X3, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface QRCode {
  id: string;
  name: string;
  url: string;
  scans: number;
  createdAt: string;
  type: string;
  status: 'active' | 'inactive';
  tags: string[];
}

const QRCodeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all-qr-codes');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockQRCodes: QRCode[] = [
      {
        id: '1',
        name: 'Website Homepage',
        url: 'https://example.com',
        scans: 1234,
        createdAt: '2024-01-15',
        type: 'URL',
        status: 'active',
        tags: ['website', 'marketing']
      },
      {
        id: '2',
        name: 'Contact Card',
        url: 'BEGIN:VCARD...',
        scans: 567,
        createdAt: '2024-01-14',
        type: 'vCard',
        status: 'active',
        tags: ['contact', 'business']
      },
      {
        id: '3',
        name: 'Product Catalog',
        url: 'https://shop.example.com',
        scans: 890,
        createdAt: '2024-01-13',
        type: 'URL',
        status: 'inactive',
        tags: ['ecommerce', 'products']
      }
    ];
    setQrCodes(mockQRCodes);
  }, []);

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qr.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => qr.tags.includes(tag));
    const matchesTab = activeTab === 'all-qr-codes' || 
                      (activeTab === 'active-qr' && qr.status === 'active') ||
                      (activeTab === 'inactive-qr' && qr.status === 'inactive') ||
                      (activeTab === 'dynamic-qr' && qr.type === 'URL') ||
                      (activeTab === 'static-qr' && qr.type !== 'URL');
    
    return matchesSearch && matchesTags && matchesTab;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  };

  // Action handlers for QRCodeListItem
  const handleEdit = (qr: any) => {
    console.log('Edit QR Code:', qr.id, qr.name);
    toast({
      title: "Edit QR Code",
      description: `Opening editor for ${qr.name}`,
    });
  };

  const handleDownload = (qr: any) => {
    console.log('Download QR Code:', qr.id, qr.name);
    toast({
      title: "Download Started",
      description: `${qr.name} QR code downloaded successfully`,
    });
  };

  const handleDuplicate = (qr: any) => {
    console.log('Duplicate QR Code:', qr.id, qr.name);
    const duplicatedQR = {
      ...qr,
      id: Date.now().toString(),
      name: `${qr.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQrCodes([duplicatedQR, ...qrCodes]);
    toast({
      title: "QR Code Duplicated",
      description: `${qr.name} has been duplicated successfully`,
    });
  };

  const handleDelete = (qr: any) => {
    console.log('Delete QR Code:', qr.id, qr.name);
    
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Code Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your QR codes</p>
        </div>
        <Button onClick={() => navigate('/create')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create QR Code
        </Button>
      </div>

      <QRCodeFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onSearch={handleSearch}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <TagFilter
                  selectedTags={selectedTags}
                  onTagsChange={handleTagsChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  QR Codes ({filteredQRCodes.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'grid' ? (
                <QRCodeGrid 
                  activeTab={activeTab}
                  viewMode={viewMode}
                  searchQuery={searchQuery}
                />
              ) : (
                <div className="space-y-2">
                  {filteredQRCodes.map((qr) => (
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
              )}
              
              {filteredQRCodes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-4">
                    <Search className="w-12 h-12 mx-auto text-gray-300" />
                  </div>
                  <p className="text-lg font-medium">No QR codes found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDashboard;
