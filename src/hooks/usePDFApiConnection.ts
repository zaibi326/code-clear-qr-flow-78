
import { useState, useEffect } from 'react';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

export const usePDFApiConnection = () => {
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const testApiConnection = async () => {
    try {
      console.log('🧪 Testing PDF.co API connection...');
      setIsRetrying(true);
      
      const result = await pdfOperationsService.testApiConnection();
      
      if (result.success) {
        setIsApiConnected(true);
        setApiError(null);
        console.log('✅ PDF.co API connection successful');
        
        toast({
          title: "API Connected",
          description: "PDF.co service is ready for PDF operations",
        });
      } else {
        setIsApiConnected(false);
        setApiError(result.error || 'API connection failed');
        console.error('❌ PDF.co API connection failed:', result.error);
        
        toast({
          title: "API Connection Failed",
          description: result.error || 'Unable to connect to PDF.co service',
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setIsApiConnected(false);
      setApiError(error.message || 'Failed to test API connection');
      console.error('💥 API connection test failed:', error);
      
      toast({
        title: "Connection Error",
        description: "Network error while connecting to PDF.co",
        variant: "destructive"
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Test PDF.co API connection on hook initialization
  useEffect(() => {
    testApiConnection();
  }, []);

  return {
    isApiConnected,
    apiError,
    isRetrying,
    testApiConnection
  };
};
