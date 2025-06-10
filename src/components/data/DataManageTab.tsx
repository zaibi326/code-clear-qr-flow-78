import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataExportService } from '@/utils/dataExportService';
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
  MoreHorizontal,
  FileText
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
  onDataSetsChange?: (dataSets: DataSet[]) => void;
}

export const DataManageTab = ({ mockDataSets: initialDataSets, onDataSetsChange }: DataManageTabProps) => {
  const [dataSets, setDataSets] = useState<DataSet[]>(initialDataSets);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [selectedDataSet, setSelectedDataSet] = useState<DataSet | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const updateDataSets = (newDataSets: DataSet[]) => {
    setDataSets(newDataSets);
    if (onDataSetsChange) {
      onDataSetsChange(newDataSets);
    }
    // Also update localStorage
    localStorage.setItem('dataSets', JSON.stringify(newDataSets));
  };

  const handleDeleteDataSet = async (dataSetId: number) => {
    const dataSet = dataSets.find(ds => ds.id === dataSetId);
    if (!dataSet) return;

    if (confirm(`Are you sure you want to delete "${dataSet.name}"? This action cannot be undone.`)) {
      setDeletingIds(prev => new Set(prev).add(dataSetId));
      
      try {
        // Simulate API call to delete dataset
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove from local state
        const updatedDataSets = dataSets.filter(ds => ds.id !== dataSetId);
        updateDataSets(updatedDataSets);
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
    console.log('Opening dataset for preview:', dataSet);
    setSelectedDataSet(dataSet);
    setViewDialogOpen(true);
    toast.success(`Opening ${dataSet.name} for preview`);
  };

  const handleDownloadDataSet = async (dataSet: DataSet) => {
    try {
      console.log('Downloading dataset:', dataSet);
      
      // Create mock data for the dataset
      const mockData = Array.from({ length: Math.min(dataSet.rows, 100) }, (_, index) => ({
        id: index + 1,
        name: `Record ${index + 1}`,
        email: `user${index + 1}@example.com`,
        url: `https://example.com/page${index + 1}`,
        date_added: new Date().toISOString()
      }));

      // Export as CSV
      const exportData = await DataExportService.exportUserData('mock-user', {
        format: 'csv',
        includeProjects: true,
        includeCampaigns: true,
        includeQRCodes: true
      });

      // Create and download file
      const fileName = `${dataSet.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      DataExportService.downloadFile(exportData, fileName);
      
      toast.success(`Downloaded ${dataSet.name} successfully`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download dataset');
    }
  };

  const generateMockTableData = (dataSet: DataSet) => {
    return Array.from({ length: Math.min(dataSet.rows, 10) }, (_, index) => ({
      id: index + 1,
      name: `Record ${index + 1}`,
      email: `user${index + 1}@example.com`,
      url: `https://example.com/page${index + 1}`,
      status: ['active', 'inactive', 'pending'][index % 3],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }));
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

      {/* View Data Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedDataSet?.name} - Data Preview
            </DialogTitle>
          </DialogHeader>
          
          {selectedDataSet && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Rows:</span>
                  <span className="ml-2">{selectedDataSet.rows.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2">{selectedDataSet.status}</span>
                </div>
                <div>
                  <span className="font-medium">Upload Date:</span>
                  <span className="ml-2">{selectedDataSet.uploadDate}</span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="font-medium">Data Preview (First 10 rows)</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">URL</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateMockTableData(selectedDataSet).map((row) => (
                        <tr key={row.id} className="border-t">
                          <td className="px-4 py-2">{row.id}</td>
                          <td className="px-4 py-2">{row.name}</td>
                          <td className="px-4 py-2">{row.email}</td>
                          <td className="px-4 py-2 text-blue-600">{row.url}</td>
                          <td className="px-4 py-2">
                            <Badge variant="outline" className="text-xs">
                              {row.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2">{row.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadDataSet(selectedDataSet)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Full Dataset
                </Button>
                <Button onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
