
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X, Plus } from 'lucide-react';
import { Template } from '@/types/template';
import { QRData } from '@/types/campaign';

interface QRAssignmentProps {
  template: Template;
  onQRAssignment: (qrCodes: QRData[], campaignName: string) => void;
  initialQRCodes: QRData[];
  initialCampaignName: string;
}

const QRAssignment = ({ template, onQRAssignment, initialQRCodes, initialCampaignName }: QRAssignmentProps) => {
  const [campaignName, setCampaignName] = useState(initialCampaignName);
  const [qrCodes, setQrCodes] = useState<QRData[]>(initialQRCodes.length > 0 ? initialQRCodes : [
    { 
      id: 'qr-1', 
      content: 'https://example.com',
      url: 'https://example.com',
      scans: 0,
      createdAt: new Date().toISOString(),
      campaignId: ''
    }
  ]);
  const [csvData, setCsvData] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const data = rows.slice(1).filter(row => row.length === headers.length);
        
        setCsvData(data);
        
        // Generate QR codes from CSV
        const newQRCodes: QRData[] = data.map((row, index) => ({
          id: `csv-qr-${index}`,
          content: row[0] || `https://example.com/${index}`,
          url: row[0] || `https://example.com/${index}`,
          scans: 0,
          createdAt: new Date().toISOString(),
          campaignId: '',
          customData: headers.reduce((acc, header, idx) => {
            acc[header] = row[idx];
            return acc;
          }, {} as Record<string, string>)
        }));
        
        setQrCodes(newQRCodes);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const addQRCode = () => {
    const newQR: QRData = {
      id: `qr-${qrCodes.length + 1}`,
      content: 'https://example.com',
      url: 'https://example.com',
      scans: 0,
      createdAt: new Date().toISOString(),
      campaignId: ''
    };
    setQrCodes([...qrCodes, newQR]);
  };

  const updateQRCode = (id: string, content: string) => {
    setQrCodes(qrCodes.map(qr => 
      qr.id === id ? { ...qr, content, url: content } : qr
    ));
  };

  const removeQRCode = (id: string) => {
    setQrCodes(qrCodes.filter(qr => qr.id !== id));
  };

  React.useEffect(() => {
    onQRAssignment(qrCodes, campaignName);
  }, [qrCodes, campaignName, onQRAssignment]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assign QR Codes</h2>
        <p className="text-gray-600">Configure QR codes for your campaign</p>
      </div>

      {/* Campaign Name */}
      <div className="mb-6">
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input
          id="campaignName"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Enter campaign name"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CSV Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Bulk Upload from CSV</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop CSV file here' : 'Upload CSV file'}
            </h4>
            <p className="text-gray-600 mb-2">or click to browse</p>
            <p className="text-sm text-gray-500">CSV format: url, name, description...</p>
          </div>

          {csvData.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  {csvData.length} QR codes loaded from CSV
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Manual QR Entry */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Manual QR Codes</h3>
            <Button onClick={addQRCode} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add QR
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {qrCodes.map((qr, index) => (
              <Card key={qr.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">QR Code {index + 1}</CardTitle>
                    {qrCodes.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQRCode(qr.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    value={qr.content || ''}
                    onChange={(e) => updateQRCode(qr.id, e.target.value)}
                    placeholder="Enter URL or content"
                  />
                  {qr.customData && (
                    <div className="mt-2 text-xs text-gray-500">
                      Custom data: {Object.keys(qr.customData).join(', ')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Campaign Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Template:</span>
            <span className="ml-2 font-medium">{template.name}</span>
          </div>
          <div>
            <span className="text-gray-500">QR Codes:</span>
            <span className="ml-2 font-medium">{qrCodes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAssignment;
