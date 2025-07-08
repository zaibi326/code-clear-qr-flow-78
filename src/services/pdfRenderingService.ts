
import * as pdfjsLib from 'pdfjs-dist';
import { pdfOperationsService } from './pdfOperationsService';

export interface PDFRenderOptions {
  scale?: number;
  rotation?: number;
  enableTextLayer?: boolean;
  enableAnnotations?: boolean;
  intent?: 'display' | 'print';
}

export interface PDFPageRender {
  canvas: HTMLCanvasElement;
  textLayer?: HTMLDivElement;
  annotations?: any[];
  pageNumber: number;
  width: number;
  height: number;
}

export interface PDFConversionOptions {
  format?: 'PNG' | 'JPEG' | 'WEBP';
  quality?: number;
  dpi?: number;
  pages?: string; // e.g., "1-5" or "1,3,5"
}

class PDFRenderingService {
  private pdfDoc: any = null;
  private workerInitialized = false;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    if (typeof window !== 'undefined' && !this.workerInitialized) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      this.workerInitialized = true;
    }
  }

  async loadPDF(source: string | ArrayBuffer | Uint8Array): Promise<void> {
    try {
      console.log('🔄 Loading PDF for enhanced rendering...');
      
      const loadingTask = pdfjsLib.getDocument({
        data: source,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 0
      });
      
      this.pdfDoc = await loadingTask.promise;
      console.log('✅ PDF loaded successfully:', this.pdfDoc.numPages, 'pages');
    } catch (error) {
      console.error('❌ Error loading PDF:', error);
      throw new Error('Failed to load PDF document');
    }
  }

  async renderPage(pageNumber: number, options: PDFRenderOptions = {}): Promise<PDFPageRender> {
    if (!this.pdfDoc) {
      throw new Error('PDF not loaded. Call loadPDF first.');
    }

    try {
      const page = await this.pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ 
        scale: options.scale || 1.5,
        rotation: options.rotation || 0
      });

      // Create high-quality canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      // High DPI support
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * devicePixelRatio;
      canvas.height = viewport.height * devicePixelRatio;
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      
      context.scale(devicePixelRatio, devicePixelRatio);

      // Render page
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        intent: options.intent || 'display'
      };

      await page.render(renderContext).promise;

      const result: PDFPageRender = {
        canvas,
        pageNumber,
        width: viewport.width,
        height: viewport.height
      };

      // Add text layer if requested
      if (options.enableTextLayer) {
        const textLayer = await this.createTextLayer(page, viewport);
        result.textLayer = textLayer;
      }

      // Add annotations if requested
      if (options.enableAnnotations) {
        const annotations = await page.getAnnotations();
        result.annotations = annotations;
      }

      return result;
    } catch (error) {
      console.error('❌ Error rendering page:', error);
      throw new Error(`Failed to render page ${pageNumber}`);
    }
  }

  private async createTextLayer(page: any, viewport: any): Promise<HTMLDivElement> {
    const textContent = await page.getTextContent();
    const textLayer = document.createElement('div');
    textLayer.className = 'pdf-text-layer';
    textLayer.style.position = 'absolute';
    textLayer.style.left = '0';
    textLayer.style.top = '0';
    textLayer.style.right = '0';
    textLayer.style.bottom = '0';
    textLayer.style.overflow = 'hidden';
    textLayer.style.opacity = '0.2';
    textLayer.style.lineHeight = '1.0';

    // Render text items
    textContent.items.forEach((textItem: any) => {
      const textDiv = document.createElement('div');
      textDiv.textContent = textItem.str;
      textDiv.style.position = 'absolute';
      textDiv.style.whiteSpace = 'pre';
      textDiv.style.color = 'transparent';
      textDiv.style.transformOrigin = '0% 0%';
      
      // Apply text positioning
      const transform = textItem.transform;
      if (transform) {
        textDiv.style.transform = `matrix(${transform.join(',')})`;
      }

      textLayer.appendChild(textDiv);
    });

    return textLayer;
  }

  async renderAllPages(options: PDFRenderOptions = {}): Promise<PDFPageRender[]> {
    if (!this.pdfDoc) {
      throw new Error('PDF not loaded');
    }

    const pages: PDFPageRender[] = [];
    
    for (let i = 1; i <= this.pdfDoc.numPages; i++) {
      const pageRender = await this.renderPage(i, options);
      pages.push(pageRender);
    }

    return pages;
  }

  async convertToImages(options: PDFConversionOptions = {}): Promise<string[]> {
    if (!this.pdfDoc) {
      throw new Error('PDF not loaded');
    }

    const images: string[] = [];
    const format = options.format || 'PNG';
    const quality = options.quality || 0.95;
    
    // Determine which pages to convert
    const pagesToConvert = this.parsePageRange(options.pages, this.pdfDoc.numPages);
    
    for (const pageNum of pagesToConvert) {
      const pageRender = await this.renderPage(pageNum, {
        scale: options.dpi ? options.dpi / 72 : 2.0 // Convert DPI to scale
      });
      
      const imageData = pageRender.canvas.toDataURL(`image/${format.toLowerCase()}`, quality);
      images.push(imageData);
    }

    return images;
  }

  private parsePageRange(pages: string | undefined, totalPages: number): number[] {
    if (!pages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pageNumbers: number[] = [];
    const parts = pages.split(',');

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          pageNumbers.push(i);
        }
      } else {
        const pageNum = parseInt(part.trim());
        if (pageNum > 0 && pageNum <= totalPages) {
          pageNumbers.push(pageNum);
        }
      }
    }

    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  }

  async searchText(searchTerm: string): Promise<Array<{
    pageNumber: number;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    context: string;
  }>> {
    if (!this.pdfDoc) {
      throw new Error('PDF not loaded');
    }

    const results = [];

    for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
      const page = await this.pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      textContent.items.forEach((item: any, index: number) => {
        if (item.str && item.str.toLowerCase().includes(searchTerm.toLowerCase())) {
          const transform = item.transform;
          const context = this.getTextContext(textContent.items, index, searchTerm);
          
          results.push({
            pageNumber: pageNum,
            text: item.str,
            x: transform[4],
            y: transform[5],
            width: item.width || 0,
            height: item.height || Math.abs(transform[3]),
            context: context
          });
        }
      });
    }

    return results;
  }

  private getTextContext(items: any[], currentIndex: number, searchTerm: string): string {
    const contextRange = 3; // Number of items before and after
    const start = Math.max(0, currentIndex - contextRange);
    const end = Math.min(items.length, currentIndex + contextRange + 1);
    
    const contextItems = items.slice(start, end);
    return contextItems.map(item => item.str).join(' ');
  }

  getDocumentInfo() {
    if (!this.pdfDoc) {
      return null;
    }

    return {
      numPages: this.pdfDoc.numPages,
      fingerprint: this.pdfDoc.fingerprint,
      title: this.pdfDoc.title,
      author: this.pdfDoc.author,
      subject: this.pdfDoc.subject,
      creator: this.pdfDoc.creator,
      producer: this.pdfDoc.producer,
      creationDate: this.pdfDoc.creationDate,
      modificationDate: this.pdfDoc.modificationDate
    };
  }

  // Integration with PDF.co service
  async processWithPDFCo(operation: string, params: any = {}) {
    try {
      console.log('🔄 Processing with PDF.co API:', operation);
      
      switch (operation) {
        case 'textReplace':
          return await pdfOperationsService.editTextEnhanced(
            params.pdfUrl,
            params.searchTexts,
            params.replaceTexts,
            params.options
          );
        
        case 'convertToImage':
          return await pdfOperationsService.exportPDF(
            params.pdfUrl,
            'image',
            { format: params.format || 'PNG', dpi: params.dpi || 300 }
          );
        
        case 'addAnnotations':
          return await pdfOperationsService.addAnnotations(params.pdfUrl, params.annotations);
        
        case 'addQRCode':
          return await pdfOperationsService.addQRCode(
            params.pdfUrl,
            params.content,
            params.x,
            params.y,
            params.size,
            params.pages
          );
        
        default:
          throw new Error(`Unsupported PDF.co operation: ${operation}`);
      }
    } catch (error) {
      console.error('❌ PDF.co operation failed:', error);
      throw error;
    }
  }

  dispose() {
    if (this.pdfDoc) {
      this.pdfDoc.destroy();
      this.pdfDoc = null;
    }
  }
}

export const pdfRenderingService = new PDFRenderingService();
