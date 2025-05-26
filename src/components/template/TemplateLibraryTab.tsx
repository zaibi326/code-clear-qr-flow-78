
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export const TemplateLibraryTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Template Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-3">Marketing Templates</h3>
              <p className="text-gray-600 text-sm mb-4">
                Professional marketing templates for campaigns and promotions.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-3">Business Templates</h3>
              <p className="text-gray-600 text-sm mb-4">
                Business card and corporate template designs.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
