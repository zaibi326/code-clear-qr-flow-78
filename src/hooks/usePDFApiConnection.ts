
import { useState, useEffect } from 'react';
import { pdfOperationsService } from '@/services/pdfOperationsService';

export const usePDFApiConnection = () => {
  const [isApiConnected, setIsApiConnected] = useState<boolean | undefined>(undefined);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const testApiConnection = async () => {
    setIsRetrying(true);
    setApiError(null);

    try {
      const result = await pdfOperationsService.testApiConnection();
      setIsApiConnected(result.success);
      
      if (!result.success) {
        setApiError(result.error || 'API connection failed');
      }
    } catch (error: any) {
      setIsApiConnected(false);
      setApiError(error.message || 'Failed to test API connection');
    } finally {
      setIsRetrying(false);
    }
  };

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
