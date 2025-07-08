import React, { useState, useRef, useEffect } from 'react';

interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  pageNumber: number;
}

interface FreehandDrawingProps {
  paths: DrawingPath[];
  onAddPath: (path: Omit<DrawingPath, 'id'>) => void;
  onRemovePath: (id: string) => void;
  currentPage: number;
  scale: number;
  color: string;
  isActive: boolean;
}

export const FreehandDrawing: React.FC<FreehandDrawingProps> = ({
  paths,
  onAddPath,
  onRemovePath,
  currentPage,
  scale,
  color,
  isActive
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || !isDrawing) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isActive || !isDrawing || currentPath.length < 2) return;
    
    onAddPath({
      points: currentPath,
      color: color,
      strokeWidth: 2,
      pageNumber: currentPage + 1
    });
    
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const pathToSVGPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x * scale} ${points[0].y * scale}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x * scale} ${points[i].y * scale}`;
    }
    return path;
  };

  const currentPagePaths = paths.filter(p => p.pageNumber === currentPage + 1);

  return (
    <>
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 998 }}
      >
        {/* Existing paths */}
        {currentPagePaths.map((path, index) => (
          <path
            key={path.id}
            d={pathToSVGPath(path.points)}
            stroke={path.color}
            strokeWidth={path.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer pointer-events-auto hover:opacity-70"
            onClick={() => onRemovePath(path.id)}
          />
        ))}
        
        {/* Current path being drawn */}
        {isActive && currentPath.length > 1 && (
          <path
            d={pathToSVGPath(currentPath)}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      
      {/* Drawing overlay */}
      {isActive && (
        <div
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ zIndex: 997 }}
        />
      )}
    </>
  );
};
