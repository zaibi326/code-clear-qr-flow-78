import { supabase } from '@/integrations/supabase/client';

export interface PDFOperation {
  operation: 'extract-text' | 'edit-text' | 'add-annotations' | 'fill-form' | 'add-qr-code' | 'export-pdf' | 'extract-for-editing' | 'replace-with-edited' | 'extract-form-fields' | 'finalize-pdf';
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
}

export class PDFOperationsService {
  async performOperation(operation: PDFOperation): Promise<PDFOperationResult> {
    try {
      console.log('Performing PDF operation:', operation.operation);
      
      const { data, error } = await supabase.functions.invoke('pdf-operations', {
        body: operation
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error: any) {
      console.error('PDF operation failed:', error);
      return {
        success: false,
        error: error.message || 'PDF operation failed'
      };
    }
  }

  async extractText(fileUrl: string, options?: { pages?: string; ocrLanguage?: string }): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'extract-text',
      fileUrl,
      options
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
    return this.performOperation({
      operation: 'edit-text',
      fileUrl,
      options: { searchStrings, replaceStrings, caseSensitive }
    });
  }

  async addAnnotations(fileUrl: string, annotations: any[]): Promise<PDFOperationResult> {
    return this.performOperation({
      operation: 'add-annotations',
      fileUrl,
      options: { annotations }
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
    return this.performOperation({
      operation: 'add-qr-code',
      fileUrl,
      options: { qrText, x, y, size, pages }
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
    return this.performOperation({
      operation: 'add-qr-code',
      fileUrl,
      options: {
        qrText: qrData.content,
        x: qrData.x,
        y: qrData.y,
        size: qrData.size,
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
