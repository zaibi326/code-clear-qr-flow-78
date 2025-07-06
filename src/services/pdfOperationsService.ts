
export interface PDFOperationResult {
  success: boolean;
  url?: string;
  error?: string;
  pages?: number;
  replacements?: number;
}

export interface PDFOperationOptions {
  caseSensitive?: boolean;
  preserveFormatting?: boolean;
  maintainLayout?: boolean;
}

export interface PDFTextExtractionOptions {
  preserveFormatting?: boolean;
  includeBoundingBoxes?: boolean;
  detectTables?: boolean;
}

export interface PDFTextExtractionResult {
  success: boolean;
  text?: string;
  pages?: number;
  textBlocks?: any[];
  error?: string;
}

export class PDFOperationsService {
  private baseUrl = 'https://api.pdf.co/v1';

  private async getApiKey(): Promise<string> {
    // In a real implementation, this would fetch from Supabase edge function
    // For now, we'll use a placeholder that should be replaced with actual API call
    return 'zasdq20@gmail.com_3d3q7cZgTgV4rSNtzYm0oXBUurqjrAnkvclvtlCHKKjGpWZ241h0UOcb5QzMj1tm';
  }

  async testApiConnection(): Promise<PDFOperationResult> {
    try {
      const apiKey = await this.getApiKey();
      console.log('🔧 Testing PDF.co API connection with key:', apiKey?.substring(0, 20) + '...');

      const response = await fetch(`${this.baseUrl}/account/credit-balance`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API test failed:', response.status, errorText);
        
        if (response.status === 401) {
          return {
            success: false,
            error: 'Invalid API key. Please check your PDF.co API configuration.'
          };
        }
        
        return {
          success: false,
          error: `API connection failed: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      console.log('✅ PDF.co API connection successful. Credits:', data.remainingCredits || 'Unknown');
      
      return {
        success: true,
        url: 'Connection successful'
      };
    } catch (error: any) {
      console.error('💥 API test error:', error);
      return {
        success: false,
        error: `Network error: ${error.message}`
      };
    }
  }

  async convertPDFToImages(pdfUrl: string): Promise<PDFOperationResult> {
    try {
      const apiKey = await this.getApiKey();
      console.log('🖼️ Converting PDF to images:', pdfUrl);

      // Validate and prepare the PDF URL
      const urlValidation = await this.validatePDFUrl(pdfUrl);
      if (!urlValidation.isValid) {
        return {
          success: false,
          error: urlValidation.error || 'Invalid PDF URL'
        };
      }

      const finalUrl = urlValidation.correctedUrl || pdfUrl;

      const response = await fetch(`${this.baseUrl}/pdf/convert/to/png`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: finalUrl,
          async: false,
          encrypt: false,
          inline: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PDF to PNG conversion failed:', response.status, errorText);
        
        if (response.status === 401) {
          return {
            success: false,
            error: 'Authentication failed. Please check your API key.'
          };
        }
        
        return {
          success: false,
          error: `Conversion failed: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      
      if (!data.error) {
        console.log('✅ PDF converted to images successfully');
        return {
          success: true,
          url: data.url,
          pages: data.pageCount || 1
        };
      } else {
        console.error('❌ PDF.co API error:', data.error);
        return {
          success: false,
          error: data.error
        };
      }
    } catch (error: any) {
      console.error('💥 PDF conversion error:', error);
      return {
        success: false,
        error: `Conversion failed: ${error.message}`
      };
    }
  }

  async extractTextEnhanced(
    pdfUrl: string, 
    options: PDFTextExtractionOptions = {}
  ): Promise<PDFTextExtractionResult> {
    try {
      const apiKey = await this.getApiKey();
      console.log('📝 Extracting text from PDF:', pdfUrl);

      // Validate URL first
      const urlValidation = await this.validatePDFUrl(pdfUrl);
      if (!urlValidation.isValid) {
        return {
          success: false,
          error: urlValidation.error || 'Invalid PDF URL'
        };
      }

      const finalUrl = urlValidation.correctedUrl || pdfUrl;

      const response = await fetch(`${this.baseUrl}/pdf/convert/to/text`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: finalUrl,
          async: false,
          encrypt: false,
          inline: true,
          ...options
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Text extraction failed:', response.status, errorText);
        
        if (response.status === 401) {
          return {
            success: false,
            error: 'Authentication failed. Please check your API key.'
          };
        }
        
        return {
          success: false,
          error: `Text extraction failed: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      
      if (!data.error) {
        console.log('✅ Text extracted successfully');
        return {
          success: true,
          text: data.body || '',
          pages: data.pageCount || 1,
          textBlocks: data.textBlocks || []
        };
      } else {
        console.error('❌ PDF.co text extraction error:', data.error);
        return {
          success: false,
          error: data.error
        };
      }
    } catch (error: any) {
      console.error('💥 Text extraction error:', error);
      return {
        success: false,
        error: `Text extraction failed: ${error.message}`
      };
    }
  }

  async editTextEnhanced(
    pdfUrl: string,
    searchTexts: string[],
    replaceTexts: string[],
    options: PDFOperationOptions = {}
  ): Promise<PDFOperationResult> {
    try {
      const apiKey = await this.getApiKey();
      console.log('✏️ Replacing text in PDF:', { searchTexts, replaceTexts, options });

      // Validate URL first
      const urlValidation = await this.validatePDFUrl(pdfUrl);
      if (!urlValidation.isValid) {
        return {
          success: false,
          error: urlValidation.error || 'Invalid PDF URL'
        };
      }

      const finalUrl = urlValidation.correctedUrl || pdfUrl;

      const response = await fetch(`${this.baseUrl}/pdf/edit/replace-text`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: finalUrl,
          searchStrings: searchTexts,
          replaceStrings: replaceTexts,
          caseSensitive: options.caseSensitive || false,
          async: false,
          encrypt: false,
          inline: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Text replacement failed:', response.status, errorText);
        
        if (response.status === 401) {
          return {
            success: false,
            error: 'Authentication failed. Please check your API key.'
          };
        }
        
        return {
          success: false,
          error: `Text replacement failed: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      
      if (!data.error) {
        console.log('✅ Text replaced successfully');
        return {
          success: true,
          url: data.url,
          replacements: searchTexts.length
        };
      } else {
        console.error('❌ PDF.co text replacement error:', data.error);
        return {
          success: false,
          error: data.error
        };
      }
    } catch (error: any) {
      console.error('💥 Text replacement error:', error);
      return {
        success: false,
        error: `Text replacement failed: ${error.message}`
      };
    }
  }

  async downloadPDF(url: string, filename: string): Promise<void> {
    try {
      console.log('📥 Downloading PDF:', filename);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('✅ PDF downloaded successfully');
    } catch (error: any) {
      console.error('❌ PDF download failed:', error);
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  private async validatePDFUrl(url: string): Promise<{
    isValid: boolean;
    error?: string;
    correctedUrl?: string;
  }> {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'No URL provided' };
    }

    // Check if it's a valid HTTP/HTTPS URL
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        // URL encode spaces if needed
        if (url.includes(' ')) {
          return {
            isValid: true,
            correctedUrl: encodeURI(url),
            error: 'URL contained spaces and was automatically encoded'
          };
        }
        return { isValid: true, correctedUrl: url };
      }
    } catch (e) {
      // Not a valid URL, continue to other checks
    }

    // Check for blob URLs (not supported)
    if (url.startsWith('blob:')) {
      return {
        isValid: false,
        error: 'Blob URLs are not supported by PDF.co API. Please upload to a public URL.'
      };
    }

    // Check for data URLs (not directly supported)
    if (url.startsWith('data:')) {
      return {
        isValid: false,
        error: 'Data URLs are not supported. Please upload the file to get a public URL.'
      };
    }

    return {
      isValid: false,
      error: 'URL must be a valid HTTP or HTTPS URL'
    };
  }
}

export const pdfOperationsService = new PDFOperationsService();
