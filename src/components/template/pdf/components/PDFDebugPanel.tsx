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
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);

  const validatePDFUrl = async (url: string | null | undefined): Promise<{ 
    isValid: boolean; 
    error?: string; 
    correctedUrl?: string;
  }> => {
    const { validatePDFUrl: validateUrlFunction } = await import('@/hooks/canvas/utils/templateUrlResolver');
    return validateUrlFunction(url);
  };

  useEffect(() => {
    const validateUrl = async () => {
      const urlToValidate = testUrl || fileUrl;
      if (urlToValidate) {
        setIsValidatingUrl(true);
        try {
          const validation = await validatePDFUrl(urlToValidate);
          setUrlValidation(validation);
        } catch (error: any) {
          setUrlValidation({
            isValid: false,
            error: `Validation error: ${error.message}`
          });
        } finally {
          setIsValidatingUrl(false);
        }
      } else {
        setUrlValidation(null);
      }
    };

    validateUrl();
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
    
    setIsDebugging(true);
    setDebugResults([]);

    // Validate URL first
    let finalUrl = urlToTest;
    try {
      const validation = await validatePDFUrl(urlToTest);
      if (!validation.isValid) {
        toast({
          title: "Invalid URL Format",
          description: validation.error,
          variant: "destructive"
        });
        setIsDebugging(false);
        return;
      }
      finalUrl = validation.correctedUrl || urlToTest;
    } catch (error: any) {
      toast({
        title: "URL Validation Error",
        description: error.message,
        variant: "destructive"
      });
      setIsDebugging(false);
      return;
    }

    const tests = [
      {
        name: 'URL Format Validation',
        test: async () => {
          const validation = await validatePDFUrl(finalUrl);
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
            details: {
              success: true,
              url: result.url
            }
          };
        }
      },
      {
        name: 'Text Extraction Test',
        test: async () => {
          const result = await pdfOperationsService.extractTextEnhanced(finalUrl, { pages: "1" });
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
          
          {isValidatingUrl && (
            <div className="mt-2 p-2 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                <span>Validating URL...</span>
              </div>
            </div>
          )}
          
          {!isValidatingUrl && urlValidation && (
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
                  {urlValidation.error && (
                    <div className="mt-1 text-xs">{urlValidation.error}</div>
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
            disabled={isDebugging || (!fileUrl && !testUrl) || isValidatingUrl || (urlValidation && !urlValidation.isValid)}
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
            <strong>Automatic URL Conversion:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li><strong>Data URLs:</strong> Will be automatically uploaded to Supabase Storage and converted to public HTTP/HTTPS URLs</li>
              <li><strong>HTTP/HTTPS URLs:</strong> Will be used directly if they're publicly accessible</li>
              <li><strong>Blob URLs:</strong> Not supported - please upload the file to public storage first</li>
            </ul>
            <div className="mt-2">
              <strong>The system will automatically:</strong>
              <ol className="mt-1 space-y-1 list-decimal list-inside">
                <li>Detect data URLs and upload them to Supabase Storage</li>
                <li>Generate public HTTP/HTTPS URLs for PDF.co API compatibility</li>
                <li>Validate URL accessibility before sending to PDF.co</li>
                <li>Handle URL encoding for special characters</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
