
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabaseService } from '@/utils/supabaseService';
import { DatabaseQRCode } from '@/types/database';
import { toast } from 'sonner';

export const useQRCodeManager = () => {
  const { user } = useAuth();
  const [qrCodes, setQRCodes] = useState<DatabaseQRCode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadQRCodes();
    }
  }, [user]);

  const loadQRCodes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const codes = await supabaseService.getUserQRCodes(user.id);
      setQRCodes(codes);
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const createQRCode = async (qrCodeData: Omit<DatabaseQRCode, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const qrCode = await supabaseService.createQRCode({
        ...qrCodeData,
        user_id: user.id
      });
      
      toast.success('QR code created successfully');
      await loadQRCodes(); // Refresh the list
      return qrCode;
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Failed to create QR code');
      return null;
    }
  };

  const updateQRCode = async (id: string, updates: Partial<DatabaseQRCode>) => {
    try {
      const updatedQRCode = await supabaseService.updateQRCode(id, updates);
      toast.success('QR code updated successfully');
      await loadQRCodes();
      return updatedQRCode;
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code');
      return null;
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      await supabaseService.deleteQRCode(id);
      toast.success('QR code deleted successfully');
      setQRCodes(prev => prev.filter(qr => qr.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
      return false;
    }
  };

  return {
    qrCodes,
    loading,
    createQRCode,
    updateQRCode,
    deleteQRCode,
    refreshQRCodes: loadQRCodes
  };
};
