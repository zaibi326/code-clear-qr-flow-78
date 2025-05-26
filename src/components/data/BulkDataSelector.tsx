
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, Square, Users, FileText, QrCode } from 'lucide-react';
import { Template } from '@/types/template';

interface DataRow {
  id: string;
  name: string;
  email: string;
  url: string;
  company?: string;
  phone?: string;
  customField?: string;
}

interface BulkDataSelectorProps {
  dataRows: DataRow[];
  templates: Template[];
  onCreateCampaign: (selectedRows: DataRow[], template: Template) => void;
}

export function BulkDataSelector({ dataRows, templates, onCreateCampaign }: BulkDataSelectorProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(dataRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = dataRows.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = () => {
    if (selectedRows.length === dataRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(dataRows.map(row => row.id));
    }
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleCreateCampaign = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const rows = dataRows.filter(row => selectedRows.includes(row.id));
    
    if (template && rows.length > 0) {
      onCreateCampaign(rows, template);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Bulk Data Selection</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {selectedRows.length} of {dataRows.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Template for QR Codes
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleCreateCampaign}
              disabled={selectedRows.length === 0 || !selectedTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Create QR Campaign ({selectedRows.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Data List View</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSelectAll}
              className="flex items-center space-x-2"
            >
              {selectedRows.length === dataRows.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>{selectedRows.length === dataRows.length ? 'Deselect All' : 'Select All'}</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-700">Select</th>
                  <th className="text-left p-3 font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 font-medium text-gray-700">Email</th>
                  <th className="text-left p-3 font-medium text-gray-700">URL</th>
                  <th className="text-left p-3 font-medium text-gray-700">Company</th>
                  <th className="text-left p-3 font-medium text-gray-700">Phone</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr 
                    key={row.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedRows.includes(row.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="p-3">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={() => handleRowSelect(row.id)}
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-900">{row.name}</td>
                    <td className="p-3 text-gray-600">{row.email}</td>
                    <td className="p-3">
                      <a 
                        href={row.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline truncate block max-w-xs"
                      >
                        {row.url}
                      </a>
                    </td>
                    <td className="p-3 text-gray-600">{row.company || '-'}</td>
                    <td className="p-3 text-gray-600">{row.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, dataRows.length)} of {dataRows.length} entries
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
