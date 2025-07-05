
import React, { useState, useEffect } from 'react';
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
  Copy,
  Play,
  RefreshCw
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
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [urlValidation, setUrlValidation] = useState<{
    isValid: boolean;
    error?: string;
    correctedUrl?: string;
  } | null>(null);

  const validatePDFUrl = (url: string | null | undefined): { 
    isValid: boolean; 
    error?: string; 
    correctedUrl?: string;
  } => {
    if (!url) {
      return { isValid: false, error: 'No URL provided' };
    }

    if (typeof url !== 'string') {
      return { isValid: false, error: 'URL must be a string' };
    }

    if (url.startsWith('data:')) {
      return { 
        isValid: false, 
        error: 'Data URLs are not supported by PDF.co API. Please upload to a public HTTP/HTTPS URL.' 
      };
    }

    if (url.startsWith('blob:')) {
      return { 
        isValid: false, 
        error: 'Blob URLs are not supported by PDF.co API. Please upload to a public HTTP/HTTPS URL.' 
      };
    }

    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return { 
          isValid: false, 
          error: 'URL must be a valid HTTP or HTTPS URL' 
        };
      }
    } catch {
      return { 
        isValid: false, 
        error: 'URL must be a valid HTTP or HTTPS URL' 
      };
    }

    if (url.includes(' ')) {
      const encodedUrl = encodeURI(url);
      return { 
        isValid: true, 
        correctedUrl: encodedUrl,
        error: 'URL contained spaces and was automatically encoded' 
      };
    }

    return { isValid: true, correctedUrl: url };
  };

  useEffect(() => {
    const urlToValidate = testUrl || fileUrl;
    if (urlToValidate) {
      const validation = validatePDFUrl(urlToValidate);
      setUrlValidation(validation);
    } else {
      setUrlValidation(null);
    }
  }, [testUrl, fileUrl]);

  const testApiConnection = async () => {
    setIsTestingApi(true);
    try {
      const result = await pdfOperationsService.testApiConnection();
      
      if (result.success) {
        toast({
          title: "API Connection Test Successful",
          description: "PDF.co API key is valid and working",
        });
      } else {
        toast({
          title: "API Connection Test Failed",
          description: result.error || "Failed to connect to PDF.co API",
          variant: "destructive"
        });
      }
      
      console.log('API Connection Test Result:', result);
    } catch (error: any) {
      toast({
        title: "API Connection Test Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsTestingApi(false);
    }
  };

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
    
    const validation = validatePDFUrl(urlToTest);
    if (!validation.isValid) {
      toast({
        title: "Invalid URL Format",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    const finalUrl = validation.correctedUrl || urlToTest;
    setIsDebugging(true);
    setDebugResults([]);

    const tests = [
      {
        name: 'URL Format Validation',
        test: async () => {
          const validation = validatePDFUrl(finalUrl);
          if (!validation.isValid) {
            throw new Error(validation.error || 'Invalid URL format');
          }
          return { 
            message: 'URL format is valid',
            details: {
              originalUrl: urlToTest,
              finalUrl: validation.correctedUrl || urlToTest,
              protocol: new URL(finalUrl).protocol,
              hostname: new URL(finalUrl).hostname
            }
          };
        }
      },
      {
        name: 'URL Accessibility Test',
        test: async () => {
          try {
            const response = await fetch(finalUrl, { 
              method: 'HEAD',
              mode: 'no-cors' // Try no-cors first for cross-origin requests
            });
            
            const getResponse = await fetch(finalUrl, {
              method: 'GET',
              headers: {
                'Range': 'bytes=0-1023' // Only fetch first 1KB to test accessibility
              }
            }).catch(() => null);

            return { 
              message: 'URL is accessible',
              details: {
                accessible: true,
                corsStatus: getResponse ? 'CORS-enabled' : 'CORS-restricted (but accessible)',
                contentType: getResponse?.headers.get('content-type') || 'Unknown',
                contentLength: getResponse?.headers.get('content-length') || 'Unknown'
              }
            };
          } catch (error: any) {
            throw new Error(`URL accessibility test failed: ${error.message}`);
          }
        }
      },
      {
        name: 'PDF.co API Connection',
        test: async () => {
          const result = await pdfOperationsService.testApiConnection();
          if (!result.success) throw new Error(result.error || 'API connection failed');
          return { 
            message: 'PDF.co API connection successful',
            details: result.debugInfo
          };
        }
      },
      {
        name: 'Text Extraction Test',
        test: async () => {
          const result = await pdfOperationsService.extractText(finalUrl, { pages: "1" });
          if (!result.success) throw new Error(result.error || 'Text extraction failed');
          return { 
            message: 'Text extraction successful',
            details: {
              textLength: result.text?.length || 0,
              pages: result.pages,
              preview: result.text?.substring(0, 100) + '...',
              statusCode: result.statusCode
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
          const result = await pdfOperationsService.addAnnotations(finalUrl, testAnnotation);
          if (!result.success) throw new Error(result.error || 'Annotation test failed');
          return { 
            message: 'Annotation test successful',
            details: { 
              processedUrl: result.url,
              statusCode: result.statusCode
            }
          };
        }
      },
      {
        name: 'QR Code Test',
        test: async () => {
          const result = await pdfOperationsService.addQRCode(finalUrl, 'https://test.com', 50, 50, 50, "1");
          if (!result.success) throw new Error(result.error || 'QR code test failed');
          return { 
            message: 'QR code test successful',
            details: { 
              processedUrl: result.url,
              statusCode: result.statusCode
            }
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
      results: debugResults,
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };
    
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    toast({
      title: "Debug info copied",
      description: "Debug information has been copied to clipboard"
    });
  };

  const clearResults = () => {
    setDebugResults([]);
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
            placeholder="Enter PDF URL to test (must be HTTP/HTTPS)..."
            className="h-8"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current file URL: {fileUrl ? '✓ Available' : '✗ Not available'}
          </p>
          
          {urlValidation && (
            <div className={`mt-2 p-2 rounded text-xs ${
              urlValidation.isValid 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {urlValidation.isValid ? (
                <div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span className="font-medium">URL Valid</span>
                  </div>
                  {urlValidation.correctedUrl && urlValidation.correctedUrl !== (testUrl || fileUrl) && (
                    <div className="mt-1">
                      <span className="font-medium">Corrected URL:</span>
                      <div className="break-all">{urlValidation.correctedUrl}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    <span className="font-medium">URL Invalid</span>
                  </div>
                  <div className="mt-1">{urlValidation.error}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={testApiConnection}
            disabled={isTestingApi}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Play className="w-3 h-3 mr-1" />
            {isTestingApi ? 'Testing...' : 'Test API Key'}
          </Button>
          
          <Button
            onClick={runDiagnostics}
            disabled={isDebugging || (!fileUrl && !testUrl) || (urlValidation && !urlValidation.isValid)}
            size="sm"
            className="flex-1"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            {isDebugging ? 'Running...' : 'Run Full Diagnostics'}
          </Button>
        </div>

        {debugResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Diagnostic Results</Label>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyDebugInfo}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearResults}
                  className="h-6 px-2"
                >
                  Clear
                </Button>
              </div>
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
                        <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap">
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
            <strong>URL Format Requirements:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li><strong>Must be HTTP/HTTPS:</strong> URLs must start with http:// or https://</li>
              <li><strong>No Data URLs:</strong> data:application/pdf... URLs are not supported</li>
              <li><strong>No Blob URLs:</strong> blob:... URLs are not supported</li>
              <li><strong>Must be publicly accessible:</strong> PDF.co API needs to fetch the file</li>
              <li><strong>Encode special characters:</strong> Spaces and special chars should be URL-encoded</li>
            </ul>
            <div className="mt-2">
              <strong>Solutions:</strong>
              <ol className="mt-1 space-y-1 list-decimal list-inside">
                <li>Upload PDF to Supabase Storage and make bucket public</li>
                <li>Use cloud storage like AWS S3 with public read access</li>
                <li>Ensure the URL is directly accessible (test in browser)</li>
                <li>Check CORS settings if using custom domain</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
