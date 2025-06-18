
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { qrCodeService, QRCodeFilter } from '@/services/qrCodeService';
import { toast } from '@/hooks/use-toast';

export const useEnhancedQRCodeManager = () => {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  const loadQRCodes = async (filters: QRCodeFilter = {}) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await qrCodeService.getQRCodes(user.id, filters);
      setQrCodes(result.data);
      
      // Load analytics
      const analyticsData = await qrCodeService.getQRAnalytics(user.id);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast({
        title: "Error",
        description: "Failed to load QR codes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createQRCode = async (qrData: {
    name?: string;
    content: string;
    content_type: string;
    campaign_id?: string;
    project_id?: string;
    qr_image_url?: string;
    generation_source?: string;
    generation_metadata?: any;
    qr_settings?: any;
    custom_data?: any;
    tags?: string[];
  }) => {
    if (!user?.id) return null;

    try {
      const qrCode = await qrCodeService.createQRCode({
        ...qrData,
        user_id: user.id
      });
      
      toast({
        title: "Success",
        description: "QR code created and stored successfully"
      });
      
      await loadQRCodes(); // Refresh the list
      return qrCode;
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to create QR code",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateQRCode = async (id: string, updates: any) => {
    try {
      const updatedQRCode = await qrCodeService.updateQRCode(id, updates);
      toast({
        title: "Success",
        description: "QR code updated successfully"
      });
      await loadQRCodes();
      return updatedQRCode;
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to update QR code",
        variant: "destructive"
      });
      return null;
    }
  };

  const archiveQRCode = async (id: string) => {
    try {
      await qrCodeService.archiveQRCode(id);
      toast({
        title: "Success",
        description: "QR code archived successfully"
      });
      await loadQRCodes();
      return true;
    } catch (error) {
      console.error('Error archiving QR code:', error);
      toast({
        title: "Error",
        description: "Failed to archive QR code",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      await qrCodeService.deleteQRCode(id);
      toast({
        title: "Success",
        description: "QR code deleted permanently"
      });
      await loadQRCodes();
      return true;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast({
        title: "Error",
        description: "Failed to delete QR code",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadQRCodes();
    }
  }, [user]);

  return {
    qrCodes,
    analytics,
    loading,
    createQRCode,
    updateQRCode,
    archiveQRCode,
    deleteQRCode,
    refreshQRCodes: loadQRCodes
  };
};
