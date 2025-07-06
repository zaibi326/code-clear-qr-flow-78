
import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class FileUploadService {
  async uploadFile(
    file: File, 
    bucketName: string = 'documents',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      console.log('🔄 Starting file upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        bucket: bucketName
      });

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'File size exceeds 10MB limit. Please choose a smaller file.'
        };
      }

      // Validate PDF files
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return {
          success: false,
          error: 'Only PDF files are supported for editing.'
        };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedName}`;

      // Simulate progress for file reading
      if (onProgress) {
        onProgress({ loaded: 0, total: file.size, percentage: 0 });
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Upload error:', error);
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (onProgress) {
        onProgress({ loaded: file.size, total: file.size, percentage: 100 });
      }

      console.log('✅ Upload successful:', {
        fileName,
        publicUrl: urlData.publicUrl,
        fileSize: file.size
      });

      return {
        success: true,
        publicUrl: urlData.publicUrl,
        fileName: fileName,
        fileSize: file.size
      };

    } catch (error: any) {
      console.error('💥 Upload failed:', error);
      return {
        success: false,
        error: error.message || 'Upload failed unexpectedly'
      };
    }
  }

  async uploadDataUrlToStorage(dataUrl: string, fileName: string = 'document.pdf'): Promise<UploadResult> {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Create File object
      const file = new File([blob], fileName, { type: blob.type });
      
      // Use regular upload method
      return this.uploadFile(file);
    } catch (error: any) {
      console.error('❌ Data URL upload failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload data URL'
      };
    }
  }

  async deleteFile(fileName: string, bucketName: string = 'documents'): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        console.error('❌ Delete error:', error);
        return false;
      }

      console.log('✅ File deleted successfully:', fileName);
      return true;
    } catch (error) {
      console.error('💥 Delete failed:', error);
      return false;
    }
  }
}

export const fileUploadService = new FileUploadService();
