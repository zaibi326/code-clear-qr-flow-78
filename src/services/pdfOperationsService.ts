import { supabase } from '@/integrations/supabase/client';
import { fileUploadService } from './fileUploadService';

export interface PDFOperation {
  operation: 'extract-text' | 'edit-text' | 'add-annotations' | 'fill-form' | 'add-qr-code' | 'export-pdf' | 'extract-for-editing' | 'replace-with-edited' | 'extract-form-fields' | 'finalize-pdf' | 'test-api-key';
  fileUrl?: string;
  fileData?: string;
  options?: Record<string, any>;
}

export interface PDFOperationResult {
  success: boolean;
  text?: string;
  url?: string;
  downloadUrl?: string;
  pages?: number;
  replacements?: number;
  error?: string;
  extractedContent?: any;
  formFields?: any[];
  fileSize?: number;
  fileName?: string;
  debugInfo?: any;
  statusCode?: number;
  responseHeaders?: Record<string, string>;
}

export class PDFOperationsService {
  async performOperation(operation: PDFOperation): Promise<PDFOperationResult> {
    try {
      console.log('🔄 Performing PDF operation:', operation.operation);
      console.log('📋 Operation details:', {
        hasFileUrl: !!operation.fileUrl,
        hasFileData: !!operation.fileData,
        fileUrlLength: operation.fileUrl?.length || 0,
        fileDataLength: operation.fileData?.length || 0,
        options: operation.options
      });

      // Enhanced validation and URL conversion before sending to edge function
      const processedOperation = await this.preprocessOperation(operation);
      if (!processedOperation.success) {
        return {
          success: false,
          error: processedOperation.error,
          statusCode: 400
        };
      }

      const { data, error } = await supabase.functions.invoke('pdf-operations', {
        body: processedOperation.operation
      });

      console.log('📡 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        return {
          success: false,
          error: `Supabase function error: ${error.message || JSON.stringify(error)}`,
          statusCode: error.status || 500,
          debugInfo: {
            operation: operation.operation,
            supabaseError: error,
            timestamp: new Date().toISOString()
          }
        };
      }

      if (data?.error) {
        console.error('❌ PDF.co API error:', data.error);
        return {
          success: false,
          error: `PDF.co API error: ${data.error}`,
          statusCode: data.statusCode || 500,
          debugInfo: data.debugInfo || {}
        };
      }

      console.log('✅ Operation successful:', data);
      return data;
    } catch (error: any) {
      console.error('💥 PDF operation failed:', error);
      return {
        success: false,
        error: error.message || 'PDF operation failed',
        statusCode: 500,
        debugInfo: {
          operation: operation.operation,
          hasFileUrl: !!operation.fileUrl,
          hasFileData: !!operation.fileData,
          errorStack: error.stack,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  private async preprocessOperation(operation: PDFOperation): Promise<{
    success: boolean;
    operation?: PDFOperation;
    error?: string;
  }> {
    try {
      // If we have a fileUrl, ensure it's a public HTTP/HTTPS URL
      if (operation.fileUrl) {
        console.log('🔍 Processing fileUrl:', operation.fileUrl.substring(0, 50) + '...');
        
        const urlResult = await fileUploadService.ensurePublicUrl(
          operation.fileUrl,
          'document.pdf'
        );

        if (!urlResult.success) {
          return {
            success: false,
            error: `URL processing failed: ${urlResult.error}`
          };
        }

        // Update the operation with the public URL
        return {
          success: true,
          operation: {
            ...operation,
            fileUrl: urlResult.publicUrl,
            fileData: undefined // Remove fileData if we have a valid URL
          }
        };
      }

      // If we have fileData but no fileUrl, convert fileData to public URL
      if (operation.fileData && !operation.fileUrl) {
        console.log('🔍 Converting base64 fileData to public URL');
        
        // Convert base64 to data URL
        const dataUrl = `data:application/pdf;base64,${operation.fileData}`;
        
        const uploadResult = await fileUploadService.uploadDataUrlToStorage(
          dataUrl,
          'document.pdf'
        );

        if (!uploadResult.success) {
          return {
            success: false,
            error: `File upload failed: ${uploadResult.error}`
          };
        }

        // Update the operation with the public URL
        return {
          success: true,
          operation: {
            ...operation,
            fileUrl: uploadResult.publicUrl,
            fileData: undefined // Remove fileData since we now have a URL
          }
        };
      }

      // Validate that we have either fileUrl or fileData
      if (!operation.fileUrl && !operation.fileData) {
        return {
          success: false,
          error: 'Either fileUrl or fileData must be provided'
        };
      }

      return {
        success: true,
        operation
      };
    } catch (error: any) {
      console.error('💥 Operation preprocessing failed:', error);
      return {
        success: false,
        error: `Preprocessing failed: ${error.message}`
      };
    }
  }

  private validateOperation(operation: PDFOperation): { isValid: boolean; error?: string } {
    // Check if we have either fileUrl or fileData
    if (!operation.fileUrl && !operation.fileData) {
      return { isValid: false, error: 'Either fileUrl or fileData must be provided' };
    }

    // Enhanced fileUrl validation
    if (operation.fileUrl) {
      // Check for data URLs
      if (operation.fileUrl.startsWith('data:')) {
        return { 
          isValid: false, 
          error: 'Data URLs are not supported by PDF.co API. Please upload file to a public HTTP/HTTPS URL.' 
        };
      }

      // Check for blob URLs
      if (operation.fileUrl.startsWith('blob:')) {
        return { 
          isValid: false, 
          error: 'Blob URLs are not supported by PDF.co API. Please upload file to a public HTTP/HTTPS URL.' 
        };
      }

      // Validate URL format
      try {
        const url = new URL(operation.fileUrl);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          return { isValid: false, error: 'fileUrl must be a valid HTTP/HTTPS URL' };
        }
      } catch {
        return { isValid: false, error: 'fileUrl must be a valid HTTP/HTTPS URL' };
      }

      // Check for common issues
      if (operation.fileUrl.includes(' ')) {
        return { 
          isValid: false, 
          error: 'fileUrl contains spaces. Please encode the URL properly or remove spaces.' 
        };
      }
    }

    // Validate fileData if provided
    if (operation.fileData) {
      if (typeof operation.fileData !== 'string') {
        return { isValid: false, error: 'fileData must be a base64 string' };
      }
      
      // Basic base64 validation
      try {
        atob(operation.fileData);
      } catch {
        return { isValid: false, error: 'fileData must be valid base64 encoded data' };
      }
    }

    return { isValid: true };
  }

  async testApiConnection(): Promise<PDFOperationResult> {
    console.log('🧪 Testing PDF.co API connection');
    
    return this.performOperation({
      operation: 'test-api-key',
      options: { test: true }
    });
  }

  async extractText(fileUrl: string, options?: { pages?: string; ocrLanguage?: string }): Promise<PDFOperationResult> {
    console.log('📄 Extracting text from PDF:', { fileUrl: fileUrl.substring(0, 100) + '...', options });
    
    // Validate file URL
    if (!fileUrl || typeof fileUrl !== 'string') {
      throw new Error('Invalid file URL provided for text extraction');
    }

    return this.performOperation({
      operation: 'extract-text',
      fileUrl,
      options: {
        pages: options?.pages || "1-",
        ocrLanguage: options?.ocrLanguage || "eng",
        ...options
      }
    });
  }

  async extractForEditing(fileUrl: string): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'extract-for-editing',
      fileUrl,
      options: { preserveFormatting: true, includePositions: true }
    });
  }

  async replaceWithEditedText(fileUrl: string, editedContent: string): Promise<PDFOperationResult> {
    console.log('✏️ Replacing PDF text with edited content');
    
    if (!fileUrl || !editedContent) {
      throw new Error('File URL and edited content are required for text replacement');
    }

    return this.performOperation({
      operation: 'replace-with-edited',
      fileUrl,
      options: { editedContent }
    });
  }

  async extractTextFromFile(file: File, options?: { pages?: string; ocrLanguage?: string }): Promise<PDFOperationResult> {
    const fileData = await this.fileToBase64(file);
    return this.performOperation({
      operation: 'extract-text',
      fileData,
      options
    });
  }

  async editText(fileUrl: string, searchStrings: string[], replaceStrings: string[], caseSensitive: boolean = false): Promise<PDFOperationResult> {
    console.log('📝 Editing PDF text:', { 
      searchCount: searchStrings.length, 
      replaceCount: replaceStrings.length,
      caseSensitive 
    });

    if (!fileUrl) {
      throw new Error('File URL is required for text editing');
    }

    if (!searchStrings.length || !replaceStrings.length) {
      throw new Error('Search and replace strings are required');
    }

    if (searchStrings.length !== replaceStrings.length) {
      throw new Error('Number of search strings must match number of replace strings');
    }

    return this.performOperation({
      operation: 'edit-text',
      fileUrl,
      options: { searchStrings, replaceStrings, caseSensitive }
    });
  }

  async addAnnotations(fileUrl: string, annotations: any[]): Promise<PDFOperationResult> {
    console.log('🎨 Adding annotations to PDF:', { 
      annotationCount: annotations.length,
      types: annotations.map(a => a.type)
    });

    if (!fileUrl) {
      throw new Error('File URL is required for adding annotations');
    }

    if (!annotations.length) {
      throw new Error('At least one annotation is required');
    }

    // Validate annotation structure
    const validatedAnnotations = annotations.map((annotation, index) => {
      if (!annotation.type) {
        throw new Error(`Annotation ${index} is missing type`);
      }
      
      if (typeof annotation.x !== 'number' || typeof annotation.y !== 'number') {
        throw new Error(`Annotation ${index} has invalid coordinates`);
      }

      return {
        type: annotation.type,
        x: Math.round(annotation.x),
        y: Math.round(annotation.y),
        width: Math.round(annotation.width || 100),
        height: Math.round(annotation.height || 100),
        pages: annotation.pages || "1",
        color: annotation.color || { r: 0, g: 0, b: 1 },
        fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
        strokeWidth: annotation.strokeWidth || 2
      };
    });

    return this.performOperation({
      operation: 'add-annotations',
      fileUrl,
      options: { annotations: validatedAnnotations }
    });
  }

  async addShapes(fileUrl: string, shapes: any[]): Promise<PDFOperationResult> {
    const annotations = shapes.map(shape => ({
      type: shape.type,
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      pages: shape.pages || "1",
      color: shape.color || { r: 0, g: 0, b: 1 },
      fillColor: shape.fillColor || { r: 0.8, g: 0.8, b: 1 },
      strokeWidth: shape.strokeWidth || 2
    }));

    return this.performOperation({
      operation: 'add-annotations',
      fileUrl,
      options: { annotations }
    });
  }

  async fillForm(fileUrl: string, fields: Record<string, any>): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'fill-form',
      fileUrl,
      options: { fields }
    });
  }

  async extractFormFields(fileUrl: string): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'extract-form-fields',
      fileUrl,
      options: {}
    });
  }

  async addQRCode(fileUrl: string, qrText: string, x: number = 100, y: number = 100, size: number = 100, pages: string = "1"): Promise<PDFOperationResult> {
    console.log('📱 Adding QR code to PDF:', { 
      qrText: qrText.substring(0, 50) + '...', 
      x, y, size, pages 
    });

    if (!fileUrl) {
      throw new Error('File URL is required for QR code insertion');
    }

    if (!qrText) {
      throw new Error('QR code text/content is required');
    }

    // Validate coordinates
    if (x < 0 || y < 0 || size <= 0) {
      throw new Error('Invalid QR code position or size');
    }

    return this.performOperation({
      operation: 'add-qr-code',
      fileUrl,
      options: { 
        qrText, 
        x: Math.round(x), 
        y: Math.round(y), 
        size: Math.round(size), 
        pages 
      }
    });
  }

  async addAdvancedQRCode(
    fileUrl: string, 
    qrData: {
      content: string;
      type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'sms';
      x: number;
      y: number;
      size: number;
      pages: string;
      foregroundColor?: string;
      backgroundColor?: string;
      logoUrl?: string;
    }
  ): Promise<PDFOperationResult> {
    console.log('🚀 Adding advanced QR code to PDF:', qrData);

    if (!qrData.content) {
      throw new Error('QR code content is required');
    }

    return this.performOperation({
      operation: 'add-qr-code',
      fileUrl,
      options: {
        qrText: qrData.content,
        x: Math.round(qrData.x),
        y: Math.round(qrData.y),
        size: Math.round(qrData.size),
        pages: qrData.pages,
        foregroundColor: qrData.foregroundColor || '#000000',
        backgroundColor: qrData.backgroundColor || '#FFFFFF',
        logoUrl: qrData.logoUrl
      }
    });
  }

  async finalizePDF(fileUrl: string, modifications: {
    textChanges?: any[];
    annotations?: any[];
    qrCodes?: any[];
    formData?: Record<string, any>;
  }): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'finalize-pdf',
      fileUrl,
      options: modifications
    });
  }

  async exportPDF(fileUrl: string, format: string = 'pdf', options?: {
    fileName?: string;
    quality?: number;
    compression?: boolean;
  }): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'export-pdf',
      fileUrl,
      options: { format, ...options }
    });
  }

  async downloadPDF(url: string, fileName: string = 'edited-document.pdf'): Promise<void> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download PDF');
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 content
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const pdfOperationsService = new PDFOperationsService();
