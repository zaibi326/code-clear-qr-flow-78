
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import { parseCSV } from '@/utils/csvParser';
import { leadListService } from '@/utils/leadListService';
import { TagInput } from '@/components/tags/TagInput';
import { Tag } from '@/services/tagService';

interface FieldMapping {
  csvField: string;
  targetField: string;
}

interface ImportProgress {
  step: 'upload' | 'mapping' | 'processing' | 'complete';
  progress: number;
  processedRows: number;
  totalRows: number;
  errors: string[];
}

const TARGET_FIELDS = [
  { value: 'name', label: 'Name *', required: true },
  { value: 'phone', label: 'Phone', required: false },
  { value: 'email', label: 'Email', required: false },
  { value: 'qr_id', label: 'QR ID', required: false },
  { value: 'notes', label: 'Notes', required: false },
  { value: 'company', label: 'Company', required: false },
  { value: 'skip', label: 'Skip Field', required: false }
];

export const LeadImportDialog: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [listName, setListName] = useState('');
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    step: 'upload',
    progress: 0,
    processedRows: 0,
    totalRows: 0,
    errors: []
  });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parseResult = parseCSV(text);
      
      if (parseResult.errors.length > 0) {
        toast({
          title: "CSV Parse Errors",
          description: `Found ${parseResult.errors.length} errors`,
          variant: "destructive"
        });
      }

      setCsvData(parseResult.data);
      setCsvHeaders(parseResult.headers);
      setListName(file.name.replace(/\.(csv|xlsx?)$/i, ''));
      
      // Initialize field mappings
      const initialMappings = parseResult.headers.map(header => ({
        csvField: header,
        targetField: autoMapField(header)
      }));
      setFieldMappings(initialMappings);
      
      setImportProgress({
        step: 'mapping',
        progress: 25,
        processedRows: 0,
        totalRows: parseResult.data.length,
        errors: []
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse CSV file",
        variant: "destructive"
      });
    }
  }, []);

  const autoMapField = (header: string): string => {
    const lowerHeader = header.toLowerCase();
    if (lowerHeader.includes('name')) return 'name';
    if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) return 'phone';
    if (lowerHeader.includes('email')) return 'email';
    if (lowerHeader.includes('qr') && lowerHeader.includes('id')) return 'qr_id';
    if (lowerHeader.includes('note') || lowerHeader.includes('comment')) return 'notes';
    if (lowerHeader.includes('company') || lowerHeader.includes('organization')) return 'company';
    return 'skip';
  };

  const updateFieldMapping = (csvField: string, targetField: string) => {
    setFieldMappings(prev => 
      prev.map(mapping => 
        mapping.csvField === csvField 
          ? { ...mapping, targetField }
          : mapping
      )
    );
  };

  const validateMappings = (): boolean => {
    const hasRequiredName = fieldMappings.some(m => m.targetField === 'name');
    if (!hasRequiredName) {
      toast({
        title: "Validation Error",
        description: "Name field is required",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const processImport = async () => {
    if (!user || !validateMappings()) return;

    setImportProgress(prev => ({ ...prev, step: 'processing', progress: 50 }));

    try {
      // Create lead list
      const leadList = await leadListService.createLeadList({
        user_id: user.id,
        name: listName,
        description: `Imported CSV with ${csvData.length} records`,
        record_count: csvData.length,
        tags: selectedTags.map(tag => tag.name),
        import_date: new Date().toISOString(),
        status: 'active'
      });

      // Transform CSV data according to field mappings
      const transformedData = csvData.map(row => {
        const mappedRow: any = {};
        fieldMappings.forEach(mapping => {
          if (mapping.targetField !== 'skip') {
            mappedRow[mapping.targetField] = row[mapping.csvField] || '';
          }
        });
        return mappedRow;
      });

      // Import the data
      await leadListService.importCSVData(leadList.id, transformedData, user.id);

      setImportProgress({
        step: 'complete',
        progress: 100,
        processedRows: csvData.length,
        totalRows: csvData.length,
        errors: []
      });

      toast({
        title: "Import Successful",
        description: `Successfully imported ${csvData.length} lead records`
      });

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import lead data",
        variant: "destructive"
      });
    }
  };

  const resetDialog = () => {
    setCsvData([]);
    setCsvHeaders([]);
    setFieldMappings([]);
    setSelectedTags([]);
    setListName('');
    setImportProgress({
      step: 'upload',
      progress: 0,
      processedRows: 0,
      totalRows: 0,
      errors: []
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Import Leads
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Import Lead List
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Import Progress</span>
              <span>{importProgress.progress}%</span>
            </div>
            <Progress value={importProgress.progress} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span className={importProgress.step === 'upload' ? 'text-blue-600 font-medium' : ''}>
                1. Upload File
              </span>
              <span className={importProgress.step === 'mapping' ? 'text-blue-600 font-medium' : ''}>
                2. Map Fields
              </span>
              <span className={importProgress.step === 'processing' ? 'text-blue-600 font-medium' : ''}>
                3. Processing
              </span>
              <span className={importProgress.step === 'complete' ? 'text-green-600 font-medium' : ''}>
                4. Complete
              </span>
            </div>
          </div>

          {/* Step 1: File Upload */}
          {importProgress.step === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV/Excel File</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Choose your file</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a CSV or Excel file with lead data
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: CSV, XLSX, XLS
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Field Mapping */}
          {importProgress.step === 'mapping' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configure Import</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="listName">List Name</Label>
                    <Input
                      id="listName"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder="Enter list name"
                    />
                  </div>
                  
                  <div>
                    <Label>Tags (Optional)</Label>
                    <TagInput
                      selectedTags={selectedTags}
                      onTagsChange={setSelectedTags}
                      placeholder="Add tags to all imported leads"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Map CSV Fields to Lead Fields</CardTitle>
                  <p className="text-sm text-gray-600">
                    Match your CSV columns to the appropriate lead fields. Required fields are marked with *.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fieldMappings.map((mapping) => (
                      <div key={mapping.csvField} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Badge variant="outline">{mapping.csvField}</Badge>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <Select
                            value={mapping.targetField}
                            onValueChange={(value) => updateFieldMapping(mapping.csvField, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TARGET_FIELDS.map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setImportProgress(prev => ({ ...prev, step: 'upload' }))}>
                      Back
                    </Button>
                    <Button onClick={processImport} disabled={!listName.trim()}>
                      Import {csvData.length} Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Processing */}
          {importProgress.step === 'processing' && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Processing Import</h3>
                <p className="text-gray-600">
                  Importing {importProgress.totalRows} lead records...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Complete */}
          {importProgress.step === 'complete' && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Import Complete!</h3>
                <p className="text-gray-600 mb-4">
                  Successfully imported {importProgress.processedRows} of {importProgress.totalRows} records
                </p>
                <Button onClick={resetDialog}>
                  Close
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
