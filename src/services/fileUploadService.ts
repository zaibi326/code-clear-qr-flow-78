
import { supabase } from '@/integrations/supabase/client';

export interface FileUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

export class FileUploadService {
  private static instance: FileUploadService;

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  async uploadDataUrlToStorage(dataUrl: string, fileName: string = 'document.pdf'): Promise<FileUploadResult> {
    try {
      console.log('🔄 Converting data URL to public URL for PDF.co API');
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      
      console.log('📁 Uploading file to Supabase Storage:', uniqueFileName);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('templates')
        .upload(uniqueFileName, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Upload failed:', error);
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('templates')
        .getPublicUrl(uniqueFileName);

      if (!urlData?.publicUrl) {
        return {
          success: false,
          error: 'Failed to generate public URL'
        };
      }

      console.log('✅ File uploaded successfully, public URL:', urlData.publicUrl);
      
      return {
        success: true,
        publicUrl: urlData.publicUrl
      };
    } catch (error: any) {
      console.error('💥 File upload service error:', error);
      return {
        success: false,
        error: error.message || 'Unknown upload error'
      };
    }
  }

  async ensurePublicUrl(url: string, fileName?: string): Promise<FileUploadResult> {
    // If it's already a valid HTTP/HTTPS URL, return it
    if (this.isValidHttpUrl(url)) {
      return {
        success: true,
        publicUrl: url
      };
    }

    // If it's a data URL, upload it to get a public URL
    if (url.startsWith('data:')) {
      return await this.uploadDataUrlToStorage(url, fileName);
    }

    return {
      success: false,
      error: 'Invalid URL format. Only HTTP/HTTPS and data URLs are supported.'
    };
  }

  private isValidHttpUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

export const fileUploadService = FileUploadService.getInstance();
