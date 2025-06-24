
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Share2, MoreHorizontal, QrCode } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { qrCodeService } from '@/services/qrCodeService';

interface QRCodeWithPreview {
  id: string;
  name?: string;
  content: string;
  content_type: string;
  qr_image_url?: string;
  logo_url?: string;
  stats: any;
  created_at: string;
  tags: string[];
  campaigns?: { name: string };
  projects?: { name: string; color: string; };
}

export function QRCodePreviewGrid() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCodeWithPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadQRCodes();
    }
  }, [user]);

  const loadQRCodes = async () => {
    if (!user) return;
    
    try {
      const result = await qrCodeService.getQRCodes(user.id, { visibilityStatus: 'active' }, 1, 12);
      setQrCodes(result.data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeBadge = (type: string) => {
    const colors = {
      'url': 'bg-blue-100 text-blue-800',
      'text': 'bg-gray-100 text-gray-800',
      'email': 'bg-red-100 text-red-800',
      'phone': 'bg-green-100 text-green-800',
      'sms': 'bg-yellow-100 text-yellow-800',
      'wifi': 'bg-purple-100 text-purple-800',
      'vcard': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">QR Code Gallery</h2>
        <Button size="sm" onClick={() => window.location.href = '/create'}>
          Create New QR
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {qrCodes.map((qr) => (
          <Card key={qr.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              {/* QR Code Preview */}
              <div className="relative mb-4 bg-white border-2 border-gray-100 rounded-lg p-4 flex items-center justify-center min-h-32">
                {qr.qr_image_url ? (
                  <div className="relative">
                    <img 
                      src={qr.qr_image_url} 
                      alt={qr.name || 'QR Code'} 
                      className="w-24 h-24 object-contain"
                    />
                    {qr.logo_url && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                          src={qr.logo_url} 
                          alt="Logo" 
                          className="w-6 h-6 object-contain bg-white rounded"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {qr.name || 'Unnamed QR Code'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{qr.content}</p>
                </div>

                <div className="flex items-center justify-between">
                  {getContentTypeBadge(qr.content_type)}
                  <div className="text-sm text-gray-500">
                    {qr.stats?.total_scans || 0} scans
                  </div>
                </div>

                {/* Project/Campaign Info */}
                {(qr.projects || qr.campaigns) && (
                  <div className="text-xs text-gray-500">
                    {qr.projects && (
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: qr.projects.color }}
                        />
                        <span>{qr.projects.name}</span>
                      </div>
                    )}
                    {qr.campaigns && (
                      <div className="mt-1">{qr.campaigns.name}</div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {qr.tags && qr.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {qr.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {qr.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{qr.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  Created {new Date(qr.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
          <p className="text-gray-500 mb-4">Create your first QR code to get started</p>
          <Button onClick={() => window.location.href = '/create'}>
            Create QR Code
          </Button>
        </div>
      )}
    </div>
  );
}
