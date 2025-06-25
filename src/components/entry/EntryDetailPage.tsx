
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { leadListService, LeadRecord, QRScanHistory } from '@/utils/leadListService';
import { QrCode, Calendar, Eye, Download, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const EntryDetailPage = () => {
  const { entryPath } = useParams<{ entryPath: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<LeadRecord | null>(null);
  const [scanHistory, setScanHistory] = useState<QRScanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntryData = async () => {
      if (!entryPath) return;
      
      try {
        setIsLoading(true);
        const entryUrl = `/entry/${entryPath}`;
        
        // Record this QR scan
        const userAgent = navigator.userAgent;
        const ipData = await fetch('https://api.ipify.org?format=json').catch(() => null);
        const ip = ipData ? await ipData.json().then(data => data.ip) : null;
        
        const recordData = await leadListService.getLeadRecordByEntryUrl(entryUrl);
        
        if (recordData) {
          setRecord(recordData);
          
          // Record the scan
          await leadListService.recordQRScan(recordData.id, {
            ip_address: ip,
            user_agent: userAgent,
            location: {} // Could be enhanced with geolocation
          });
          
          // Load scan history
          const history = await leadListService.getQRScanHistory(recordData.id);
          setScanHistory(history);
        }
      } catch (error) {
        console.error('Error loading entry data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntryData();
  }, [entryPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Entry Not Found</h2>
            <p className="text-gray-600 mb-4">The requested entry could not be found.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dataFields = Object.entries(record.data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-white/60"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Entry Details
          </h1>
          <p className="text-gray-600">Scanned from QR Code • ID: {record.id.slice(0, 8)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Fields */}
            <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Data Fields
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataFields.length > 0 ? (
                  dataFields.map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-900 max-w-xs text-right">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No data fields available</p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {record.tags && record.tags.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {record.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tags assigned</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            {record.qr_code_url && (
              <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">QR Code</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <img 
                    src={record.qr_code_url} 
                    alt="QR Code" 
                    className="w-32 h-32 mx-auto mb-4 border rounded-lg"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <a href={record.qr_code_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Scan History */}
            <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scan History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scanHistory.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {scanHistory.map((scan) => (
                      <div key={scan.id} className="border-l-2 border-indigo-200 pl-3">
                        <p className="text-sm font-medium">
                          {format(new Date(scan.scanned_at), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(scan.scanned_at), 'HH:mm:ss')}
                        </p>
                        {scan.ip_address && (
                          <p className="text-xs text-gray-400">IP: {scan.ip_address}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No scan history available</p>
                )}
              </CardContent>
            </Card>

            {/* Upload History */}
            <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Created:</span>
                    <br />
                    {format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Last Updated:</span>
                    <br />
                    {format(new Date(record.updated_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
