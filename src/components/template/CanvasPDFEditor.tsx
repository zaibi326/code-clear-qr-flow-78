import React, { useEffect, useRef, useState } from 'react';
import { Canvas, FabricObject, IText } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from '@/hooks/use-toast';
import { Template } from '@/types/template';
import { usePDFEditor } from '@/hooks/canvas/usePDFEditor';
import { usePDFOperations } from '@/hooks/canvas/usePDFOperations';
import { PDFSidebar } from './pdf/PDFSidebar';
import { PDFPropertiesPanel } from './pdf/PDFPropertiesPanel';
import { PDFToolbar } from './pdf/PDFToolbar';
import FileText from '@/components/icons/FileText';
import Button from '@/components/Button';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface CanvasPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const CanvasPDFEditor: React.FC<CanvasPDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    fabricCanvas,
    setFabricCanvas,
    pdfFile,
    setPdfFile,
    pdfPages,
    currentPage,
    selectedObject,
    setSelectedObject,
    zoom,
    setZoom,
    undoStack,
    redoStack,
    editMode,
    setEditMode,
    isTextEditingMode,
    saveState,
    loadPDF,
    loadPageToCanvas,
    enableTextEditing,
    disableTextEditing
  } = usePDFEditor();

  // Text editing properties
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Shape properties
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const {
    addTextAtPosition,
    addNewText,
    addRectangle,
    addCircle,
    addQRCode,
    uploadImage
  } = usePDFOperations({
    fabricCanvas,
    textColor,
    fontSize,
    fontFamily,
    textAlign,
    isBold,
    isItalic,
    isUnderline,
    fillColor,
    strokeColor,
    strokeWidth,
    saveState
  });

  // Initialize canvas
  useEffect(() => {
    if (mainCanvasRef.current && !fabricCanvas) {
      const canvas = new Canvas(mainCanvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      });

      // Event listeners
      canvas.on('selection:created', (e) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        updatePropertyPanel(obj || null);
      });

      canvas.on('selection:updated', (e) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        updatePropertyPanel(obj || null);
      });

      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });

      canvas.on('object:modified', () => {
        saveState();
      });

      // Enhanced click handling for text editing
      canvas.on('mouse:down', (e) => {
        if (editMode === 'text' && !e.target) {
          const pointer = canvas.getPointer(e.e);
          addTextAtPosition(pointer.x, pointer.y);
        }
      });

      setFabricCanvas(canvas);

      return () => {
        canvas.dispose();
      };
    }
  }, [editMode, setFabricCanvas, setSelectedObject, saveState, addTextAtPosition]);

  // Load PDF from template
  useEffect(() => {
    if (template?.file && template.file.type === 'application/pdf') {
      setPdfFile(template.file);
      loadPDF(template.file);
    }
  }, [template, setPdfFile, loadPDF]);

  const updatePropertyPanel = (obj: FabricObject | null) => {
    if (!obj) return;

    if (obj.type === 'i-text') {
      const textObj = obj as IText;
      setTextColor(textObj.fill as string || '#000000');
      setFontSize(textObj.fontSize || 16);
      setFontFamily(textObj.fontFamily || 'Arial');
      setTextAlign((textObj.textAlign as 'left' | 'center' | 'right') || 'left');
      setIsBold(textObj.fontWeight === 'bold');
      setIsItalic(textObj.fontStyle === 'italic');
      setIsUnderline(textObj.underline || false);
    } else if (obj.type === 'rect' || obj.type === 'circle') {
      setFillColor(obj.fill as string || '#3b82f6');
      setStrokeColor(obj.stroke as string || '#1e40af');
      setStrokeWidth(obj.strokeWidth || 2);
    }
  };

  const undo = () => {
    if (undoStack.length > 1 && fabricCanvas) {
      const currentState = undoStack[undoStack.length - 1];
      const previousState = undoStack[undoStack.length - 2];
      
      fabricCanvas.loadFromJSON(previousState, () => {
        fabricCanvas.renderAll();
      });
    }
  };

  const redo = () => {
    if (redoStack.length > 0 && fabricCanvas) {
      const nextState = redoStack[redoStack.length - 1];
      
      fabricCanvas.loadFromJSON(nextState, () => {
        fabricCanvas.renderAll();
      });
    }
  };

  const deleteSelected = () => {
    if (!fabricCanvas || !selectedObject) return;
    
    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
    saveState();
  };

  const updateSelectedObject = (property: string, value: any) => {
    if (!selectedObject || !fabricCanvas) return;
    
    selectedObject.set(property, value);
    fabricCanvas.renderAll();
    saveState();
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    fabricCanvas?.setZoom(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
    fabricCanvas?.setZoom(newZoom);
  };

  const resetZoom = () => {
    setZoom(1);
    fabricCanvas?.setZoom(1);
  };

  const exportAsImage = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `edited-pdf-page-${currentPage + 1}.png`;
    link.href = dataURL;
    link.click();
    
    toast({
      title: 'Image Exported',
      description: `Page ${currentPage + 1} exported as PNG`,
    });
  };

  const exportAsPDF = () => {
    toast({
      title: 'Export PDF',
      description: 'PDF export functionality coming soon!',
    });
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
    const canvasData = fabricCanvas.toJSON();
    const updatedTemplate: Template = {
      ...template,
      id: template?.id || Date.now().toString(),
      name: template?.name || 'Edited PDF',
      type: 'pdf',
      editable_json: canvasData,
      updatedAt: new Date()
    };
    
    onSave(updatedTemplate);
    
    toast({
      title: 'PDF Saved',
      description: 'Your edited PDF has been saved successfully!',
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <PDFSidebar
        editMode={editMode}
        setEditMode={setEditMode}
        isTextEditingMode={isTextEditingMode}
        pdfPages={pdfPages}
        currentPage={currentPage}
        selectedObject={selectedObject}
        onFileUpload={(file) => {
          setPdfFile(file);
          loadPDF(file);
        }}
        onAddText={addNewText}
        onAddRectangle={addRectangle}
        onAddCircle={addCircle}
        onAddQRCode={addQRCode}
        onImageUpload={uploadImage}
        onDeleteSelected={deleteSelected}
        onPageChange={loadPageToCanvas}
        onEnableTextEditing={enableTextEditing}
        onDisableTextEditing={disableTextEditing}
      />

      <div className="flex-1 flex flex-col">
        <PDFToolbar
          zoom={zoom}
          canUndo={undoStack.length > 1}
          canRedo={redoStack.length > 0}
          onUndo={undo}
          onRedo={redo}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onExportImage={exportAsImage}
          onExportPDF={exportAsPDF}
          onSave={handleSave}
          onCancel={onCancel}
        />

        <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-4 relative">
            {pdfPages.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Upload a PDF to Get Started
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Edit PDF text directly like in Canva
                  </p>
                  <Button
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Choose PDF File
                  </Button>
                </div>
              </div>
            )}
            <canvas
              ref={mainCanvasRef}
              className="border border-gray-300 rounded"
              style={{ display: pdfPages.length > 0 ? 'block' : 'none' }}
            />
          </div>
        </div>
      </div>

      <PDFPropertiesPanel
        selectedObject={selectedObject}
        textColor={textColor}
        setTextColor={setTextColor}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        isBold={isBold}
        setIsBold={setIsBold}
        isItalic={isItalic}
        setIsItalic={setIsItalic}
        isUnderline={isUnderline}
        setIsUnderline={setIsUnderline}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUpdateSelectedObject={updateSelectedObject}
      />
    </div>
  );
};
