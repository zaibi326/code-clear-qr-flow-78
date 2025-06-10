
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus } from 'lucide-react';

interface TemplateManagerHeaderProps {
  onUploadClick: () => void;
}

export const TemplateManagerHeader = ({ onUploadClick }: TemplateManagerHeaderProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Template Manager
          </h1>
          <p className="text-lg text-gray-600">Create, customize, and organize your QR code templates with Canva-like editing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
            <FolderOpen className="h-4 w-4" />
            Browse Library
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
            onClick={onUploadClick}
          >
            <Plus className="h-4 w-4" />
            Upload Template
          </Button>
        </div>
      </div>
    </div>
  );
};
