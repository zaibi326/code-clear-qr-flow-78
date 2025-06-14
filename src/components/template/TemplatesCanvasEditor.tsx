
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save, X, QrCode, Type, Square, Circle, ImagePlus, Undo, Redo, ZoomIn, ZoomOut } from "lucide-react";
import { Template } from "@/types/template";
// You must have 'fabric' v6 installed!
import { fabric } from "fabric";
import { toast } from "@/hooks/use-toast";

interface TemplatesCanvasEditorProps {
  template: Template;
  onBack: () => void;
  onSave: (layout: object, exportUrl?: string) => void;
}

const CANVAS_ID = "custom-template-canvas-main";

const canvasWidth = 900;
const canvasHeight = 630;

const TemplatesCanvasEditor: React.FC<TemplatesCanvasEditorProps> = ({
  template,
  onBack,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // Initialize and load background image/template
  useEffect(() => {
    if (!canvasRef.current) return;
    let fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = fabricCanvas;

    // Load the template bg image (URL, thumbnail, or preview)
    let imgSrc = template.template_url || template.preview || template.thumbnail_url;
    if (imgSrc) {
      fabric.Image.fromURL(imgSrc, (img) => {
        img.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
          scaleX: canvasWidth / (img.width || canvasWidth),
          scaleY: canvasHeight / (img.height || canvasHeight),
        });
        fabricCanvas.add(img);
        fabricCanvas.sendToBack(img);
      });
    }

    // Load existing customization JSON
    if (template.editable_json) {
      try {
        fabricCanvas.loadFromJSON(template.editable_json, fabricCanvas.renderAll.bind(fabricCanvas));
      } catch (e) {
        // Fallback: ignore broken json
        console.warn("Invalid saved JSON layout");
      }
    }

    // Clean up on unmount
    return () => {
      fabricCanvas.dispose();
      fabricRef.current = null;
    };
  }, [template]);

  // Canvas tools
  const handleAddQR = () => {
    // A real app would generate a real QR, for demo a placeholder:
    fabric.Image.fromURL("/sample-qr.png", (img) => {
      img.set({
        left: 60,
        top: 60,
        scaleX: 1,
        scaleY: 1,
        hasBorders: true,
        borderColor: "#3182ce",
        lockUniScaling: false,
      });
      fabricRef.current?.add(img).setActiveObject(img);
    });
    toast({ title: "QR code placeholder added!" });
  };

  const handleAddText = () => {
    const text = new fabric.IText("Edit me!", {
      left: 160,
      top: 110,
      fontSize: 32,
      fill: "#22223b",
      fontWeight: "bold",
    });
    fabricRef.current?.add(text).setActiveObject(text);
  };

  const handleAddRect = () => {
    const rect = new fabric.Rect({
      left: 200,
      top: 200,
      width: 120,
      height: 55,
      fill: "#3182ce88",
      stroke: "#1976d2",
      strokeWidth: 2,
      rx: 8,
      ry: 8,
    });
    fabricRef.current?.add(rect).setActiveObject(rect);
  };
  const handleAddCircle = () => {
    const circ = new fabric.Circle({
      left: 360,
      top: 160,
      radius: 44,
      fill: "#f59e42b0",
      stroke: "#ea580c",
      strokeWidth: 2,
    });
    fabricRef.current?.add(circ).setActiveObject(circ);
  };
  const handleImageUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target?.result as string, (img) => {
        img.set({
          left: 130,
          top: 130,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        fabricRef.current?.add(img).setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUndo = () => fabricRef.current?.undo && (fabricRef.current as any).undo();
  const handleRedo = () => fabricRef.current?.redo && (fabricRef.current as any).redo();
  const handleZoomIn = () => fabricRef.current?.setZoom((fabricRef.current?.getZoom() || 1) * 1.1);
  const handleZoomOut = () => fabricRef.current?.setZoom((fabricRef.current?.getZoom() || 1) / 1.1);

  const handleReset = () => {
    if (window.confirm("Reset all canvas changes?")) {
      fabricRef.current?.clear();
      // Restore background
      let imgSrc = template.template_url || template.preview || template.thumbnail_url;
      if (imgSrc) {
        fabric.Image.fromURL(imgSrc, (img) => {
          img.set({
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
            scaleX: canvasWidth / (img.width || canvasWidth),
            scaleY: canvasHeight / (img.height || canvasHeight),
          });
          fabricRef.current?.add(img);
          fabricRef.current?.sendToBack(img);
        });
      }
    }
  };

  const handleSave = () => {
    if (fabricRef.current) {
      const json = fabricRef.current.toJSON();
      // Optionally create export (image, PDF, etc)
      fabricRef.current.discardActiveObject().renderAll();
      // For demo, we capture PNG export
      const exportUrl = fabricRef.current.toDataURL({ format: "png" });
      onSave(json, exportUrl);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex flex-col items-center">
        <div className="relative max-w-[900px] w-full shadow-lg border rounded-xl bg-white p-3">
          <canvas ref={canvasRef} id={CANVAS_ID} width={canvasWidth} height={canvasHeight} className="rounded-xl border" />
        </div>
        <div className="flex gap-2 justify-center mt-4">
          <Button variant="outline" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
          <Button variant="outline" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
          <Button variant="outline" onClick={handleReset}><Undo className="w-4 h-4" /> Reset</Button>
        </div>
      </div>
      <div className="md:w-72 flex-shrink-0">
        <div className="bg-slate-50 rounded-xl shadow-lg p-4 space-y-4">
          <h4 className="font-bold text-base mb-2">Canvas Tools</h4>
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={handleAddQR}><QrCode className="w-4 h-4 mr-2" />QR Code</Button>
            <Button variant="outline" onClick={handleAddText}><Type className="w-4 h-4 mr-2" />Text Box</Button>
            <Button variant="outline" onClick={handleAddRect}><Square className="w-4 h-4 mr-2" />Rectangle</Button>
            <Button variant="outline" onClick={handleAddCircle}><Circle className="w-4 h-4 mr-2" />Circle</Button>
            <input
              id="template-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="template-image-upload">
              <Button variant="outline" className="w-full">
                <ImagePlus className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </label>
          </div>
          <hr className="my-2 border-gray-200" />
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" /> Save/Export
          </Button>
          <Button variant="outline" onClick={onBack} className="w-full">
            <X className="w-4 h-4 mr-2" /> Back to Gallery
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesCanvasEditor;
