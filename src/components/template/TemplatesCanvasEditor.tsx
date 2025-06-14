
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save, X, QrCode, Type, Square, Circle, ImagePlus, Undo, Redo, ZoomIn, ZoomOut } from "lucide-react";
import { Template } from "@/types/template";
import { Canvas, Image as FabricImage, IText, Rect, Circle as FabricCircle } from "fabric";
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
  const fabricRef = useRef<Canvas | null>(null);

  // Helper to load image as Fabric object (Fabric.js v6 pattern)
  const addBackgroundImage = async (imgSrc: string, canvas: Canvas) => {
    try {
      // Fabric.js v6: Use proper signature FabricImage.fromURL(url, options, callback)
      const img = await new Promise<FabricImage>((resolve, reject) =>
        FabricImage.fromURL(imgSrc, {}, (oimg) => {
          if (oimg) resolve(oimg as FabricImage);
          else reject(new Error("Failed to load image"));
        })
      );
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        scaleX: canvasWidth / (img.width || canvasWidth),
        scaleY: canvasHeight / (img.height || canvasHeight),
      });
      canvas.add(img);
      // sendObjectToBack to send image to back
      canvas.sendObjectToBack(img);
    } catch (e) {
      // noop
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = fabricCanvas;

    // Load the template bg image (URL, thumbnail, or preview)
    let imgSrc = template.template_url || template.preview || template.thumbnail_url;
    if (imgSrc) {
      addBackgroundImage(imgSrc, fabricCanvas);
    }

    // Load existing customization JSON
    if (template.editable_json) {
      try {
        fabricCanvas.loadFromJSON(template.editable_json, () => {
          fabricCanvas.renderAll();
        });
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
    // We want to re-run only if the template changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  // Canvas tools (add objects and set as active after)
  const handleAddQR = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    try {
      const img = await new Promise<FabricImage>((resolve, reject) =>
        FabricImage.fromURL("/sample-qr.png", {}, (oimg) => {
          if (oimg) resolve(oimg as FabricImage);
          else reject(new Error("Failed to load QR image"));
        })
      );
      img.set({
        left: 60,
        top: 60,
        scaleX: 1,
        scaleY: 1,
        hasBorders: true,
        borderColor: "#3182ce",
        lockUniScaling: false,
      });
      canvas.add(img);
      canvas.setActiveObject?.(img); // still works in v6
      toast({ title: "QR code placeholder added!" });
    } catch (e) {
      toast({ title: "Failed to add QR code" });
    }
  };

  const handleAddText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new IText("Edit me!", {
      left: 160,
      top: 110,
      fontSize: 32,
      fill: "#22223b",
      fontWeight: "bold",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const handleAddRect = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const rect = new Rect({
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
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const handleAddCircle = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const circ = new FabricCircle({
      left: 360,
      top: 160,
      radius: 44,
      fill: "#f59e42b0",
      stroke: "#ea580c",
      strokeWidth: 2,
    });
    canvas.add(circ);
    canvas.setActiveObject(circ);
  };

  const handleImageUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const file = evt.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = await new Promise<FabricImage>((resolve, reject) =>
          FabricImage.fromURL(e.target?.result as string, {}, (oimg) => {
            if (oimg) resolve(oimg as FabricImage);
            else reject(new Error("Failed to load image from upload"));
          })
        );
        img.set({
          left: 130,
          top: 130,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
        canvas.setActiveObject?.(img);
      } catch (e) {
        toast({ title: "Failed to add image" });
      }
    };
    reader.readAsDataURL(file);
  };

  // Undo/Redo not supported in base Fabric.js 6. Omit those for now.
  // const handleUndo = () => {};
  // const handleRedo = () => {};
  const handleZoomIn = () => {
    if (!fabricRef.current) return;
    fabricRef.current.setZoom((fabricRef.current.getZoom() || 1) * 1.1);
  };
  const handleZoomOut = () => {
    if (!fabricRef.current) return;
    fabricRef.current.setZoom((fabricRef.current.getZoom() || 1) / 1.1);
  };

  const handleReset = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    if (window.confirm("Reset all canvas changes?")) {
      canvas.clear();
      let imgSrc = template.template_url || template.preview || template.thumbnail_url;
      if (imgSrc) {
        await addBackgroundImage(imgSrc, canvas);
      }
    }
  };

  const handleSave = () => {
    if (fabricRef.current) {
      const json = fabricRef.current.toJSON();
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      const exportUrl = fabricRef.current.toDataURL({ multiplier: 1, format: "png" });
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
