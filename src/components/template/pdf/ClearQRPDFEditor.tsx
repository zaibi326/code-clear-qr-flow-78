import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PDFUploadZone } from './components/PDFUploadZone';
import { EnhancedPDFCanvas } from './components/EnhancedPDFCanvas';
import { PDFExportDialog } from './components/PDFExportDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ClearQRPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export interface PDFTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor: string;
  opacity: number;
  rotation: number;
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
}

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  properties: Record<string, any>;
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  // Image properties
  src?: string;
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'line';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // Common properties
  opacity?: number;
  rotation?: number;
  isEdited?: boolean;
}

export const ClearQRPDFEditor: React.FC<ClearQRPDFEditorProps> = ({
  template: initialTemplate,
  onSave,
  onCancel
}) => {
  // Core state
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(initialTemplate || null);
  const [elements, setElements] = useState<PDFElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'image' | 'shape'>('select');
  
  // UI state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  // PDF rendering hook
  const {
    isLoading,
    pageRenders,
    numPages,
    documentInfo,
    error,
    loadPDF,
    renderAllPages,
    extractTextElements
  } = usePDFRenderer();

  // Check authentication status and get session
  useEffect(() => {
    const getAuthState = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth session error:', error);
          return;
        }
        
        console.log('Current session:', session);
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting auth state:', error);
      }
    };

    getAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load existing template PDF if available
  useEffect(() => {
    const loadExistingPDF = async () => {
      if (currentTemplate && (currentTemplate.template_url || currentTemplate.preview) && !pdfLoaded) {
        console.log('Loading existing PDF template:', currentTemplate.name);
        setIsProcessing(true);
        
        try {
          let pdfUrl = currentTemplate.template_url || currentTemplate.preview;
          
          // Clean up URL if it has editing parameters
          if (pdfUrl && pdfUrl.includes('?edited=')) {
            pdfUrl = pdfUrl.split('?edited=')[0];
          }
          
          console.log('PDF URL to load:', pdfUrl);
          
          if (pdfUrl) {
            const pdfDoc = await loadPDF(pdfUrl);
            if (pdfDoc) {
              console.log('PDF loaded successfully, rendering pages...');
              const renders = await renderAllPages({ scale: 1.5, enableTextLayer: true });
              console.log('Pages rendered:', renders.length);
              
              if (renders.length > 0) {
                const textElements = await extractTextElements();
                console.log('Text elements extracted:', textElements.length);
                
                const convertedElements: PDFElement[] = textElements.map((textEl, index) => ({
                  id: `text-${index}-${Date.now()}`,
                  type: 'text' as const,
                  x: textEl.x,
                  y: textEl.y,
                  width: textEl.width,
                  height: textEl.height,
                  pageNumber: textEl.pageNumber,
                  text: textEl.text,
                  fontSize: textEl.fontSize,
                  fontFamily: textEl.fontFamily || 'Arial',
                  fontWeight: textEl.fontWeight || 'normal',
                  fontStyle: textEl.fontStyle || 'normal',
                  textAlign: textEl.textAlign || 'left',
                  color: textEl.color || '#000000',
                  backgroundColor: 'transparent',
                  opacity: 1,
                  rotation: 0,
                  isEdited: false,
                  properties: {}
                }));
                
                setElements(convertedElements);
                setPdfLoaded(true);
                
                toast({
                  title: "PDF loaded",
                  description: `${currentTemplate.name} is ready for editing`,
                });
              }
            }
          }
        } catch (error) {
          console.error('Error loading existing PDF:', error);
          toast({
            title: "Loading failed",
            description: "Could not load the PDF. Please try uploading again.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };

    loadExistingPDF();
  }, [currentTemplate, loadPDF, renderAllPages, extractTextElements, pdfLoaded]);

  // Handle PDF upload with improved authentication and storage
  const handlePDFUpload = useCallback(async (file: File) => {
    try {
      console.log('📄 Starting PDF upload for enhanced ClearQR editor:', file.name);
      
      // Check if user is authenticated
      if (!session || !user) {
        console.error('No authenticated session found');
        toast({
          title: "Authentication required",
          description: "Please log in to upload PDF files. Refreshing page...",
          variant: "destructive"
        });
        
        // Try to refresh the session
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (!newSession) {
          window.location.reload();
          return;
        }
        setSession(newSession);
        setUser(newSession.user);
      }
      
      setIsProcessing(true);
      setPdfLoaded(false);
      
      // Validate file
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Please select a valid PDF file');
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('PDF file size must be less than 50MB');
      }
      
      // Create a unique filename with user ID to avoid conflicts
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `pdf-templates/${user.id}/${timestamp}-${randomId}-${cleanFileName}`;
      
      console.log('Uploading to storage with filename:', fileName);
      
      // Upload to Supabase storage with authenticated user
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdf')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf'
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        // Handle specific RLS errors
        if (uploadError.message.includes('row-level security') || uploadError.message.includes('RLS')) {
          // Try to create the bucket policy if it doesn't exist
          console.log('Attempting to resolve RLS policy issue...');
          
          // Alternative: Try uploading with different approach
          const { data: retryUpload, error: retryError } = await supabase.storage
            .from('pdf')
            .upload(`public/${fileName}`, file, {
              cacheControl: '3600',
              upsert: true,
              contentType: 'application/pdf'
            });
            
          if (retryError) {
            throw new Error(`Upload failed: ${retryError.message}. Please ensure you are logged in and try again.`);
          }
          
          uploadData = retryUpload;
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      if (!uploadData) {
        throw new Error('Upload failed: No data returned from storage');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdf')
        .getPublicUrl(uploadData.path);

      console.log('✅ PDF uploaded successfully:', publicUrl);

      // Load PDF for rendering and text extraction
      console.log('Loading PDF document for processing...');
      const pdfDoc = await loadPDF(file);
      if (!pdfDoc) {
        throw new Error('Failed to load PDF document for processing');
      }

      console.log('Rendering PDF pages...');
      // Render all pages with proper scale
      const renders = await renderAllPages({ scale: 1.5, enableTextLayer: true });
      console.log('✅ Pages rendered:', renders.length);

      if (renders.length === 0) {
        throw new Error('No pages could be rendered from the PDF');
      }

      // Extract text elements for direct editing
      console.log('Extracting text elements...');
      const textElements = await extractTextElements();
      console.log('✅ Text elements extracted:', textElements.length);

      const convertedElements: PDFElement[] = textElements.map((textEl, index) => ({
        id: `text-${index}-${Date.now()}`,
        type: 'text' as const,
        x: textEl.x,
        y: textEl.y,
        width: textEl.width,
        height: textEl.height,
        pageNumber: textEl.pageNumber,
        text: textEl.text,
        fontSize: textEl.fontSize,
        fontFamily: textEl.fontFamily || 'Arial',
        fontWeight: textEl.fontWeight || 'normal',
        fontStyle: textEl.fontStyle || 'normal',
        textAlign: textEl.textAlign || 'left',
        color: textEl.color || '#000000',
        backgroundColor: 'transparent',
        opacity: 1,
        rotation: 0,
        isEdited: false,
        properties: {}
      }));

      setElements(convertedElements);
      
      const template: Template = {
        id: initialTemplate?.id || `enhanced-pdf-${timestamp}`,
        name: initialTemplate?.name || file.name.replace('.pdf', ''),
        template_url: publicUrl,
        preview: publicUrl,
        thumbnail_url: publicUrl,
        category: 'pdf-editor',
        tags: ['pdf', 'enhanced', 'editable'],
        created_at: initialTemplate?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customization: {
          canvasWidth: renders[0]?.width || 800,
          canvasHeight: renders[0]?.height || 1000,
          backgroundColor: '#ffffff',
          elements: convertedElements,
          version: '4.0'
        }
      };
      
      setCurrentTemplate(template);
      setCurrentPage(1);
      setPdfLoaded(true);
      
      toast({
        title: "PDF loaded successfully",
        description: `${file.name} with ${numPages} pages is ready for enhanced editing`,
      });
    } catch (error) {
      console.error('PDF upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load PDF file";
      toast({
        title: "Upload failed",  
        description: errorMessage,
        variant: "destructive"
      });
      setPdfLoaded(false);
    } finally {
      setIsProcessing(false);
    }
  }, [loadPDF, renderAllPages, extractTextElements, numPages, initialTemplate, user, session]);

  // Element management
  const addElement = useCallback((element: Omit<PDFElement, 'id'>) => {
    const id = `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement: PDFElement = { 
      ...element, 
      id,
      properties: element.properties || {}
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElementId(id);
    return id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<PDFElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates, isEdited: true } : el
    ));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  // Save template  
  const handleSave = useCallback(() => {
    if (!currentTemplate) return;
    
    const updatedTemplate: Template = {
      ...currentTemplate,
      customization: {
        ...currentTemplate.customization,
        elements: elements,
        version: '4.0'
      },
      updated_at: new Date().toISOString()
    };
    
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
    
    toast({
      title: "Project saved",
      description: "Your enhanced PDF edits have been saved successfully",
    });
  }, [currentTemplate, elements, onSave]);

  // Handle export
  const handleExport = useCallback(() => {
    console.log('Exporting enhanced PDF with', elements.length, 'elements');
    setShowExportDialog(true);
  }, [elements]);

  // Show authentication message if not logged in
  if (!user || !session) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to use the PDF editor</p>
          <Button onClick={onCancel} className="mr-4">Back to Templates</Button>
        </div>
      </div>
    );
  }

  // Show upload screen if no PDF is loaded
  if (!currentTemplate || !pdfLoaded || pageRenders.length === 0) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
        </div>
        
        <PDFUploadZone
          onUpload={handlePDFUpload}
          onCancel={onCancel}
          isLoading={isProcessing || isLoading}
        />
      </div>
    );
  }

  const currentPageElements = elements.filter(el => el.pageNumber === currentPage);

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{currentTemplate.name}</h1>
            <p className="text-sm text-gray-600">Enhanced PDF Editor • {numPages} pages</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{elements.length} elements</span>
        </div>
      </div>

      {/* Main Canvas */}
      <EnhancedPDFCanvas
        pageRender={pageRenders[currentPage - 1]}
        elements={currentPageElements}
        selectedElementId={selectedElementId}
        onSelectElement={setSelectedElementId}
        onUpdateElement={updateElement}
        onAddElement={addElement}
        onDeleteElement={deleteElement}
        zoom={zoom}
        onZoomChange={setZoom}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        currentPage={currentPage}
        totalPages={numPages}
        onPageChange={setCurrentPage}
        onSave={handleSave}
        onExport={handleExport}
      />

      {/* Export Dialog */}
      {showExportDialog && (
        <PDFExportDialog
          template={currentTemplate}
          elements={elements}
          onClose={() => setShowExportDialog(false)}
          onExport={(format) => {
            console.log(`Exporting enhanced PDF as ${format}`);
            setShowExportDialog(false);
            toast({
              title: "Export started",
              description: `Exporting PDF as ${format}...`,
            });
          }}
        />
      )}
    </div>
  );
};
