
import { qrCodeService } from '@/services/qrCodeService';

export const storeGeneratedQR = async (qrData: {
  userId: string;
  name?: string;
  content: string;
  contentType: string;
  campaignId?: string;
  projectId?: string;
  qrImageUrl?: string;
  generationSource?: string;
  generationMetadata?: any;
  qrSettings?: any;
  customData?: any;
  tags?: string[];
}) => {
  try {
    const storedQR = await qrCodeService.createQRCode({
      user_id: qrData.userId,
      name: qrData.name,
      content: qrData.content,
      content_type: qrData.contentType,
      campaign_id: qrData.campaignId,
      project_id: qrData.projectId,
      qr_image_url: qrData.qrImageUrl,
      generation_source: qrData.generationSource || 'manual',
      generation_metadata: {
        ...qrData.generationMetadata,
        generated_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`
      },
      qr_settings: qrData.qrSettings || {},
      custom_data: qrData.customData || {},
      tags: qrData.tags || []
    });

    console.log('QR code stored successfully:', storedQR);
    return storedQR;
  } catch (error) {
    console.error('Failed to store QR code:', error);
    throw error;
  }
};

export const updateQRMetrics = async (qrId: string, metrics: {
  scans?: number;
  uniqueScans?: number;
  performanceMetrics?: any;
}) => {
  try {
    return await qrCodeService.updateQRCode(qrId, {
      stats: {
        total_scans: metrics.scans || 0,
        unique_scans: metrics.uniqueScans || 0,
        last_scan_at: new Date().toISOString()
      },
      performance_metrics: metrics.performanceMetrics || {}
    });
  } catch (error) {
    console.error('Failed to update QR metrics:', error);
    throw error;
  }
};
