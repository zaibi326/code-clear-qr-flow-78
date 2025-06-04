
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { databaseService } from '@/utils/databaseService';
import { toast } from 'sonner';
import {
  Database,
  Calendar,
  Trash2,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react';

interface DataSet {
  id: number;
  name: string;
  rows: number;
  uploadDate: string;
  status: 'active' | 'processed' | 'error';
  progress: number;
}

interface DataManageTabProps {
  mockDataSets: DataSet[];
}

export const DataManageTab = ({ mockDataSets: initialDataSets }: DataManageTabProps) => {
  const [dataSets, setDataSets] = useState<DataSet[]>(initialDataSets);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const handleDeleteDataSet = async (dataSetId: number) => {
    const dataSet = dataSets.find(ds => ds.id === dataSetId);
    if (!dataSet) return;

    if (confirm(`Are you sure you want to delete "${dataSet.name}"? This action cannot be undone.`)) {
      setDeletingIds(prev => new Set(prev).add(dataSetId));
      
      try {
        // Simulate API call to delete dataset
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove from local state
        setDataSets(prev => prev.filter(ds => ds.id !== dataSetId));
        toast.success(`Successfully deleted ${dataSet.name}`);
      } catch (error) {
        toast.error('Failed to delete dataset');
        console.error('Delete error:', error);
      } finally {
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(dataSetId);
          return newSet;
        });
      }
    }
  };

  const handleViewDataSet = (dataSet: DataSet) => {
    toast.success(`Opening ${dataSet.name} for preview`);
    // In a real app, this would open a modal or navigate to a detail view
  };

  const handleDownloadDataSet = (dataSet: DataSet) => {
    toast.success(`Downloading ${dataSet.name}`);
    // In a real app, this would trigger a file download
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processed':
        return <Database className="h-4 w-4 text-blue-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (dataSets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Database className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data sets found</h3>
          <p className="text-gray-600 mb-6">Upload your first CSV file to get started with data management</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Upload Data Set
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {dataSets.map((dataSet) => {
          const isDeleting = deletingIds.has(dataSet.id);
          
          return (
            <Card key={dataSet.id} className="hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {dataSet.name}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{dataSet.rows.toLocaleString()} rows</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{dataSet.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(dataSet.status)} border flex items-center gap-1`}>
                      {getStatusIcon(dataSet.status)}
                      {dataSet.status.charAt(0).toUpperCase() + dataSet.status.slice(1)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Processing Status</span>
                    <span className="font-medium text-gray-900">{dataSet.progress}%</span>
                  </div>
                  <Progress value={dataSet.progress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDataSet(dataSet)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadDataSet(dataSet)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                    onClick={() => handleDeleteDataSet(dataSet.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
