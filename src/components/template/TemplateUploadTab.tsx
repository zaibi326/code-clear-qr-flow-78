
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const TemplateUploadTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Upload Template</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag and drop your template here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse files from your computer
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Choose File
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Supports PDF, PNG, JPG files up to 10MB
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
