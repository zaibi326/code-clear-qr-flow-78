import { supabase } from '@/integrations/supabase/client';
import { fileUploadService } from './fileUploadService';

export interface PDFOperation {
  operation: 'extract-text' | 'edit-text' | 'add-annotations' | 'fill-form' | 'add-qr-code' | 'export-pdf' | 'extract-for-editing' | 'replace-with-edited' | 'extract-form-fields' | 'finalize-pdf' | 'test-api-key' | 'extract-text-enhanced' | 'process-page-batch';
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
  textBlocks?: any[];
  pageData?: any[];
  boundingBoxes?: any[];
}

export class PDFOperationsService {
  private async ensureValidUrl(fileUrl?: string, fileData?: string): Promise<string | null> {
    console.log('🔍 Ensuring valid URL for PDF operation:', {
      hasFileUrl: !!fileUrl,
      hasFileData: !!fileData,
      fileUrlType: fileUrl ? (fileUrl.startsWith('data:') ? 'data-url' : fileUrl.startsWith('http') ? 'http-url' : 'other') : 'none'
    });

    // If we have a valid HTTP/HTTPS URL, return it
    if (fileUrl && this.isValidHttpUrl(fileUrl)) {
      console.log('✅ Using existing HTTP URL');
      return fileUrl;
    }

    // Convert data URL to public URL if needed
    if (fileUrl && fileUrl.startsWith('data:')) {
      console.log('🔄 Converting data URL to public URL');
      const uploadResult = await fileUploadService.uploadDataUrlToStorage(fileUrl, 'document.pdf');
      
      if (uploadResult.success && uploadResult.publicUrl) {
        console.log('✅ Successfully converted data URL to public URL');
        return uploadResult.publicUrl;
      } else {
        console.error('❌ Failed to convert data URL:', uploadResult.error);
      }
    }

    // If we have fileData, convert it to a public URL
    if (fileData) {
      console.log('🔄 Converting base64 fileData to public URL');
      const dataUrl = `data:application/pdf;base64,${fileData}`;
      const uploadResult = await fileUploadService.uploadDataUrlToStorage(dataUrl, 'document.pdf');
      
      if (uploadResult.success && uploadResult.publicUrl) {
        console.log('✅ Successfully converted fileData to public URL');
        return uploadResult.publicUrl;
      } else {
        console.error('❌ Failed to convert fileData:', uploadResult.error);
      }
    }

    console.error('❌ No valid URL could be created');
    return null;
  }

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

      // Check authentication first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'Authentication required. Please log in to use PDF operations.',
          statusCode: 401
        };
      }

      // Ensure we have a valid public URL for PDF.co API
      const validUrl = await this.ensureValidUrl(operation.fileUrl, operation.fileData);
      
      if (!validUrl) {
        return {
          success: false,
          error: 'Could not process file URL. Please ensure the PDF is accessible and try again.',
          statusCode: 400
        };
      }

      console.log('✅ Using validated URL for PDF operation:', validUrl.substring(0, 100) + '...');

      // Create the processed operation with the valid URL
      const processedOperation: PDFOperation = {
        ...operation,
        fileUrl: validUrl,
        fileData: undefined // Remove fileData since we now have a URL
      };

      const { data, error } = await supabase.functions.invoke('pdf-operations', {
        body: processedOperation
      });

      console.log('📡 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = `PDF operation failed: ${error.message || JSON.stringify(error)}`;
        if (error.message?.includes('unauthorized') || error.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.message?.includes('timeout')) {
          errorMessage = 'Operation timed out. Please try again with a smaller file.';
        } else if (error.message?.includes('API key')) {
          errorMessage = 'PDF.co API key is not configured. Please contact support.';
        }
        
        return {
          success: false,
          error: errorMessage,
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
          error: `PDF processing failed: ${data.error}`,
          statusCode: data.statusCode || 500,
          debugInfo: data.debugInfo || {}
        };
      }

      console.log('✅ Operation successful:', data);
      return data;
    } catch (error: any) {
      console.error('💥 PDF operation failed:', error);
      
      let errorMessage = 'PDF operation failed';
      if (error.message?.includes('storage')) {
        errorMessage = 'File storage error. Please check your permissions and try again.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
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

  private isValidHttpUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async testApiConnection(): Promise<PDFOperationResult> {
    console.log('🧪 Testing PDF.co API connection');
    
    return this.performOperation({
      operation: 'test-api-key',
      options: { test: true }
    });
  }

  async extractTextEnhanced(fileUrl: string, options?: { 
    pages?: string; 
    ocrLanguage?: string;
    preserveFormatting?: boolean;
    includeBoundingBoxes?: boolean;
    chunkSize?: number;
    maxTextLength?: number;
    normalizeSpaces?: boolean;
    preserveLineBreaks?: boolean;
    preserveParagraphs?: boolean;
    detectTables?: boolean;
  }): Promise<PDFOperationResult> {
    console.log('📄 Enhanced text extraction from PDF:', { 
      fileUrl: fileUrl.substring(0, 100) + '...', 
      options 
    });
    
    // Validate file URL
    if (!fileUrl || typeof fileUrl !== 'string') {
      throw new Error('Invalid file URL provided for text extraction');
    }

    return this.performOperation({
      operation: 'extract-text-enhanced',
      fileUrl,
      options: {
        pages: options?.pages || "1-",
        ocrLanguage: options?.ocrLanguage || "eng",
        preserveFormatting: options?.preserveFormatting !== false,
        includeBoundingBoxes: options?.includeBoundingBoxes !== false,
        chunkSize: options?.chunkSize || 1000000, // 1MB chunks
        maxTextLength: options?.maxTextLength || 10000000, // 10MB max
        normalizeSpaces: options?.normalizeSpaces !== false,
        preserveLineBreaks: options?.preserveLineBreaks !== false,
        preserveParagraphs: options?.preserveParagraphs !== false,
        detectTables: options?.detectTables !== false,
        // Enhanced OCR settings for better text recognition
        ocr: true,
        ocrAccuracy: "high",
        ocrWorker: "auto",
        inline: true,
        async: false,
        // Text extraction enhancements
        extractTextCoordinates: true,
        extractTextFont: true,
        extractTextSize: true,
        extractTextColor: true,
        ...options
      }
    });
  }

  async extractText(fileUrl: string, options?: { pages?: string; ocrLanguage?: string }): Promise<PDFOperationResult> {
    console.log('📄 Extracting text from PDF:', { fileUrl: fileUrl.substring(0, 100) + '...', options });
    
    // Use enhanced extraction for better results
    return this.extractTextEnhanced(fileUrl, {
      ...options,
      preserveFormatting: true,
      includeBoundingBoxes: true
    });
  }

  async processPageBatch(fileUrl: string, pageStart: number, pageEnd: number, operation: 'extract' | 'edit', options?: any): Promise<PDFOperationResult> {
    console.log('📑 Processing page batch:', { 
      pageStart, 
      pageEnd, 
      operation,
      fileUrl: fileUrl.substring(0, 100) + '...'
    });

    return this.performOperation({
      operation: 'process-page-batch',
      fileUrl,
      options: {
        pageStart,
        pageEnd,
        batchOperation: operation,
        preserveFormatting: true,
        includeBoundingBoxes: true,
        normalizeSpaces: true,
        preserveLineBreaks: true,
        chunkSize: 500000, // 500KB per batch
        ...options
      }
    });
  }

  async editTextEnhanced(
    fileUrl: string, 
    searchStrings: string[], 
    replaceStrings: string[], 
    options?: {
      caseSensitive?: boolean;
      preserveFormatting?: boolean;
      maintainLayout?: boolean;
      boundingBoxMapping?: boolean;
      normalizeSpaces?: boolean;
      chunkProcessing?: boolean;
    }
  ): Promise<PDFOperationResult> {
    console.log('📝 Enhanced PDF text editing:', { 
      searchCount: searchStrings.length, 
      replaceCount: replaceStrings.length,
      options,
      searchStrings: searchStrings.map(s => s.substring(0, 50) + (s.length > 50 ? '...' : '')),
      replaceStrings: replaceStrings.map(s => s.substring(0, 50) + (s.length > 50 ? '...' : ''))
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

    // Enhanced text processing with normalization
    const processedPairs = searchStrings
      .map((search, index) => ({ 
        search: this.normalizeText(search.trim()), 
        replace: this.normalizeText(replaceStrings[index] || ''),
        originalSearch: search.trim(),
        originalReplace: replaceStrings[index] || ''
      }))
      .filter(pair => pair.search.length > 0);

    if (processedPairs.length === 0) {
      throw new Error('At least one non-empty search string is required');
    }

    console.log('✅ Using processed search/replace pairs:', {
      count: processedPairs.length,
      pairs: processedPairs.map(p => ({ 
        search: p.search.substring(0, 30), 
        replace: p.replace.substring(0, 30) 
      }))
    });

    return this.performOperation({
      operation: 'edit-text',
      fileUrl,
      options: { 
        searchStrings: processedPairs.map(p => p.search), 
        replaceStrings: processedPairs.map(p => p.replace),
        originalSearchStrings: processedPairs.map(p => p.originalSearch),
        originalReplaceStrings: processedPairs.map(p => p.originalReplace),
        caseSensitive: options?.caseSensitive || false,
        preserveFormatting: options?.preserveFormatting !== false,
        maintainLayout: options?.maintainLayout !== false,
        boundingBoxMapping: options?.boundingBoxMapping !== false,
        normalizeSpaces: options?.normalizeSpaces !== false,
        chunkProcessing: options?.chunkProcessing !== false,
        // Enhanced processing options
        matchCase: options?.caseSensitive || false,
        wholeWordsOnly: false,
        replaceAll: true,
        useRegex: false,
        preserveLineBreaks: true,
        preserveParagraphs: true,
        maintainFontSize: true,
        maintainAlignment: true
      }
    });
  }

  async editText(fileUrl: string, searchStrings: string[], replaceStrings: string[], caseSensitive: boolean = false): Promise<PDFOperationResult> {
    // Use enhanced editing for better results
    return this.editTextEnhanced(fileUrl, searchStrings, replaceStrings, {
      caseSensitive,
      preserveFormatting: true,
      maintainLayout: true,
      boundingBoxMapping: true,
      normalizeSpaces: true
    });
  }

  private normalizeText(text: string): string {
    if (!text) return '';
    
    // Normalize whitespace while preserving intentional formatting
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')   // Handle old Mac line endings
      .replace(/\t/g, '    ')  // Convert tabs to spaces
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
      .replace(/\s+/g, ' ')    // Collapse multiple spaces (but preserve single spaces)
      .trim();
  }

  async extractForEditing(fileUrl: string): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'extract-for-editing',
      fileUrl,
      options: { 
        preserveFormatting: true, 
        includePositions: true,
        includeBoundingBoxes: true,
        extractTextCoordinates: true,
        normalizeSpaces: true,
        preserveLineBreaks: true
      }
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
      options: { 
        editedContent,
        preserveFormatting: true,
        maintainLayout: true,
        normalizeSpaces: true
      }
    });
  }

  async extractTextFromFile(file: File, options?: { pages?: string; ocrLanguage?: string }): Promise<PDFOperationResult> {
    const fileData = await this.fileToBase64(file);
    return this.performOperation({
      operation: 'extract-text-enhanced',
      fileData,
      options: {
        pages: options?.pages || "1-",
        ocrLanguage: options?.ocrLanguage || "eng",
        preserveFormatting: true,
        includeBoundingBoxes: true,
        ocr: true,
        ocrAccuracy: "high",
        ocrWorker: "auto",
        inline: true,
        async: false,
        normalizeSpaces: true,
        preserveLineBreaks: true,
        ...options
      }
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

    // Simplified annotation format for PDF.co API compatibility
    const validatedAnnotations = annotations.map((annotation, index) => {
      if (!annotation.type) {
        throw new Error(`Annotation ${index} is missing type`);
      }
      
      if (typeof annotation.x !== 'number' || typeof annotation.y !== 'number') {
        throw new Error(`Annotation ${index} has invalid coordinates`);
      }

      // Use simple annotation structure that PDF.co expects
      const baseAnnotation = {
        x: annotation.x,
        y: annotation.y,
        width: annotation.width || 100,
        height: annotation.height || 100,
        pages: annotation.pages || "1"
      };

      // Handle different annotation types with simple format
      switch (annotation.type.toLowerCase()) {
        case 'highlight':
          return {
            ...baseAnnotation,
            type: "highlight",
            color: "yellow"
          };
        case 'rectangle':
          return {
            ...baseAnnotation,
            type: "rectangle",
            fillColor: "lightblue",
            strokeColor: "blue"
          };
        case 'circle':
        case 'ellipse':
          return {
            ...baseAnnotation,
            type: "ellipse",
            fillColor: "lightgreen",
            strokeColor: "green"
          };
        default:
          return {
            ...baseAnnotation,
            type: "rectangle",
            fillColor: "lightgray",
            strokeColor: "black"
          };
      }
    });

    return this.performOperation({
      operation: 'add-annotations',
      fileUrl,
      options: { annotations: validatedAnnotations }
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
        qrText: qrText.trim(),
        x: x, 
        y: y, 
        size: size, 
        pages: pages || "1"
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
