
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Copy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { pdfOperationsService } from '@/services/pdfOperationsService';

interface PDFDebugPanelProps {
  fileUrl?: string;
}

export const PDFDebugPanel: React.FC<PDFDebugPanelProps> = ({ fileUrl }) => {
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResults, setDebugResults] = useState<any[]>([]);
  const [testUrl, setTestUrl] = useState('');

  const runDiagnostics = async () => {
    if (!fileUrl && !testUrl) {
      toast({
        title: "No PDF URL provided",
        description: "Please provide a PDF URL to test",
        variant: "destructive"
      });
      return;
    }

    const urlToTest = testUrl || fileUrl;
    setIsDebugging(true);
    setDebugResults([]);

    const tests = [
      {
        name: 'URL Validation',
        test: async () => {
          if (!urlToTest) throw new Error('No URL provided');
          if (!urlToTest.startsWith('http')) throw new Error('Invalid URL format');
          return { message: 'URL format is valid' };
        }
      },
      {
        name: 'URL Accessibility',
        test: async () => {
          const response = await fetch(urlToTest, { method: 'HEAD' });
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          return { 
            message: 'URL is accessible',
            details: {
              status: response.status,
              contentType: response.headers.get('content-type'),
              contentLength: response.headers.get('content-length')
            }
          };
        }
      },
      {
        name: 'Text Extraction Test',
        test: async () => {
          const result = await pdfOperationsService.extractText(urlToTest, { pages: "1" });
          if (!result.success) throw new Error(result.error || 'Text extraction failed');
          return { 
            message: 'Text extraction successful',
            details: {
              textLength: result.text?.length || 0,
              pages: result.pages,
              preview: result.text?.substring(0, 100) + '...'
            }
          };
        }
      },
      {
        name: 'Simple Annotation Test',
        test: async () => {
          const testAnnotation = [{
            type: 'rectangle',
            x: 100,
            y: 100,
            width: 50,
            height: 50,
            pages: "1"
          }];
          const result = await pdfOperationsService.addAnnotations(urlToTest, testAnnotation);
          if (!result.success) throw new Error(result.error || 'Annotation test failed');
          return { 
            message: 'Annotation test successful',
            details: { processedUrl: result.url }
          };
        }
      },
      {
        name: 'QR Code Test',
        test: async () => {
          const result = await pdfOperationsService.addQRCode(urlToTest, 'https://test.com', 50, 50, 50, "1");
          if (!result.success) throw new Error(result.error || 'QR code test failed');
          return { 
            message: 'QR code test successful',
            details: { processedUrl: result.url }
          };
        }
      }
    ];

    for (const test of tests) {
      try {
        setDebugResults(prev => [...prev, { 
          name: test.name, 
          status: 'running', 
          timestamp: new Date().toISOString() 
        }]);

        const result = await test.test();
        
        setDebugResults(prev => prev.map(r => 
          r.name === test.name 
            ? { ...r, status: 'success', result, timestamp: new Date().toISOString() }
            : r
        ));
      } catch (error: any) {
        setDebugResults(prev => prev.map(r => 
          r.name === test.name 
            ? { ...r, status: 'error', error: error.message, timestamp: new Date().toISOString() }
            : r
        ));
      }
    }

    setIsDebugging(false);
  };

  const copyDebugInfo = () => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      fileUrl: fileUrl || testUrl,
      results: debugResults
    };
    
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    toast({
      title: "Debug info copied",
      description: "Debug information has been copied to clipboard"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      running: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bug className="w-4 h-4" />
          PDF Operations Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">Test PDF URL (optional)</Label>
          <Input
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Enter PDF URL to test..."
            className="h-8"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use current file URL: {fileUrl ? '✓ Available' : '✗ Not available'}
          </p>
        </div>

        <Button
          onClick={runDiagnostics}
          disabled={isDebugging || (!fileUrl && !testUrl)}
          className="w-full"
          size="sm"
        >
          {isDebugging ? 'Running Diagnostics...' : 'Run PDF.co API Diagnostics'}
        </Button>

        {debugResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Diagnostic Results</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={copyDebugInfo}
                className="h-6 px-2"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {debugResults.map((result, index) => (
                <div key={index} className="border rounded p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                  
                  {result.status === 'success' && result.result && (
                    <div className="text-green-700 bg-green-50 p-1 rounded">
                      <div>{result.result.message}</div>
                      {result.result.details && (
                        <pre className="mt-1 text-xs overflow-x-auto">
                          {JSON.stringify(result.result.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                  
                  {result.status === 'error' && (
                    <div className="text-red-700 bg-red-50 p-1 rounded">
                      {result.error}
                    </div>
                  )}

                  <div className="text-gray-500 mt-1">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Common Issues:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>PDF.co API key not configured in Supabase secrets</li>
              <li>PDF URL not publicly accessible</li>
              <li>CORS issues with file hosting</li>
              <li>Invalid coordinates for annotations/QR codes</li>
              <li>File format not supported by PDF.co</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
