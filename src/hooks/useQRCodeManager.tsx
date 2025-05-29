
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
      subscribeToQRCodeUpdates();
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
      const qrCodeId = await supabaseService.createQRCode({
        ...qrCodeData,
        user_id: user.id
      });
      
      if (qrCodeId) {
        toast.success('QR code created successfully');
        await loadQRCodes(); // Refresh the list
        return qrCodeId;
      } else {
        toast.error('Failed to create QR code');
        return null;
      }
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Failed to create QR code');
      return null;
    }
  };

  const updateQRCode = async (id: string, updates: Partial<DatabaseQRCode>) => {
    try {
      const success = await supabaseService.updateQRCode(id, updates);
      if (success) {
        toast.success('QR code updated successfully');
        await loadQRCodes();
        return true;
      } else {
        toast.error('Failed to update QR code');
        return false;
      }
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code');
      return false;
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      const success = await supabaseService.deleteQRCode(id);
      if (success) {
        toast.success('QR code deleted successfully');
        setQRCodes(prev => prev.filter(qr => qr.id !== id));
        return true;
      } else {
        toast.error('Failed to delete QR code');
        return false;
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
      return false;
    }
  };

  const subscribeToQRCodeUpdates = () => {
    if (!user) return;

    const subscription = supabaseService.subscribeToUserQRCodes(
      user.id,
      (payload) => {
        console.log('QR code update:', payload);
        loadQRCodes(); // Refresh when changes occur
      }
    );

    return () => {
      subscription.unsubscribe();
    };
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
