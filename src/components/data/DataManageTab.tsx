
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Plus, Eye, Download, Trash2 } from 'lucide-react';

interface DataSet {
  id: number;
  name: string;
  rows: number;
  uploadDate: string;
  status: string;
}

interface DataManageTabProps {
  mockDataSets: DataSet[];
}

export const DataManageTab = ({ mockDataSets }: DataManageTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Data Sets</h2>
          <p className="text-gray-600">Manage your uploaded CSV files and campaign data</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Upload New Data
        </Button>
      </div>

      <div className="grid gap-4">
        {mockDataSets.map((dataset) => (
          <Card key={dataset.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{dataset.rows.toLocaleString()} rows</span>
                      <span>•</span>
                      <span>Uploaded {dataset.uploadDate}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dataset.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {dataset.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
