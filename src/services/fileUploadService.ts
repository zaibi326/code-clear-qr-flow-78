
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
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ User not authenticated for file upload');
        return {
          success: false,
          error: 'User must be authenticated to upload files'
        };
      }
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Generate unique filename with user prefix to avoid conflicts
      const timestamp = Date.now();
      const uniqueFileName = `${user.id}/${timestamp}-${fileName}`;
      
      console.log('📁 Uploading file to Supabase Storage:', uniqueFileName);
      
      // Upload to Supabase Storage with explicit content type
      const { data, error } = await supabase.storage
        .from('templates')
        .upload(uniqueFileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: blob.type || 'application/pdf'
        });

      if (error) {
        console.error('❌ Upload failed:', error);
        
        // Provide specific error messages for common issues
        let errorMessage = `Upload failed: ${error.message}`;
        if (error.message.includes('row-level security')) {
          errorMessage = 'Upload permission denied. Please ensure you are logged in and have proper access rights.';
        } else if (error.message.includes('duplicate')) {
          errorMessage = 'File already exists. Please try again or use a different filename.';
        } else if (error.message.includes('size')) {
          errorMessage = 'File is too large. Please use a smaller file.';
        }
        
        return {
          success: false,
          error: errorMessage
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
