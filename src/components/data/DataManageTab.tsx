
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Plus, Eye, Download, Trash2, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [selectedDataset, setSelectedDataset] = useState<DataSet | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const mockData = [
    { id: 1, name: "John Doe", email: "john@example.com", url: "https://johndoe.com", company: "Tech Corp" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", url: "https://janesmith.com", company: "Design LLC" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", url: "https://bobjohnson.com", company: "Marketing Inc" },
  ];

  const handleUploadNew = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Upload Started",
          description: `Processing ${file.name}...`,
        });
        // Here you would handle the actual upload
        setTimeout(() => {
          toast({
            title: "Upload Complete",
            description: `Successfully uploaded ${file.name}`,
          });
        }, 2000);
      }
    };
    fileInput.click();
  };

  const handleView = (dataset: DataSet) => {
    setSelectedDataset(dataset);
    setIsViewDialogOpen(true);
  };

  const handleExport = (dataset: DataSet) => {
    try {
      // Create mock CSV data
      const csvContent = [
        'name,email,url,company',
        ...mockData.map(row => `${row.name},${row.email},${row.url},${row.company}`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.name.replace(/\s+/g, '_')}_export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `${dataset.name} has been exported successfully`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export the dataset",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (dataset: DataSet) => {
    if (!confirm(`Are you sure you want to delete "${dataset.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Dataset Deleted",
        description: `${dataset.name} has been deleted successfully`,
      });
      
      // Here you would remove the dataset from the list
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the dataset",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Data Sets</h2>
          <p className="text-gray-600">Manage your uploaded CSV files and campaign data</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleUploadNew}
        >
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleView(dataset)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport(dataset)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(dataset)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>{selectedDataset?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing sample data from {selectedDataset?.name}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectedDataset && handleExport(selectedDataset)}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export Full Dataset
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Company</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell className="text-blue-600 hover:underline">
                        <a href={row.url} target="_blank" rel="noopener noreferrer">
                          {row.url}
                        </a>
                      </TableCell>
                      <TableCell>{row.company}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-sm text-gray-500 text-center">
              Showing 3 of {selectedDataset?.rows} total rows
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
