
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Upload, FileSpreadsheet, ArrowRight, ArrowLeft, Check, Save, Tag } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { TagInput } from '@/components/tags/TagInput';
import { Tag as TagType } from '@/services/tagService';

interface FileUploadWizardProps {
  onComplete: (data: UploadResult) => void;
  onCancel: () => void;
}

interface UploadResult {
  fileName: string;
  mappedData: Record<string, any>[];
  fieldMappings: FieldMapping[];
  appliedTags: TagType[];
  mappingProfile?: MappingProfile;
}

interface FieldMapping {
  csvField: string;
  systemField: string;
  required: boolean;
}

interface MappingProfile {
  name: string;
  mappings: FieldMapping[];
  description?: string;
}

interface ParsedCSVData {
  headers: string[];
  rows: Record<string, string>[];
  fileName: string;
  fileSize: number;
}

const SYSTEM_FIELDS = [
  { value: 'name', label: 'Name *', required: true, description: 'Full name or display name' },
  { value: 'email', label: 'Email', required: false, description: 'Email address' },
  { value: 'phone', label: 'Phone', required: false, description: 'Phone number' },
  { value: 'company', label: 'Company', required: false, description: 'Company or organization' },
  { value: 'url', label: 'URL', required: false, description: 'Website or profile URL' },
  { value: 'notes', label: 'Notes', required: false, description: 'Additional notes or comments' },
  { value: 'qr_id', label: 'QR ID', required: false, description: 'Existing QR code identifier' },
  { value: 'skip', label: '-- Skip Field --', required: false, description: 'Do not import this field' }
];

// Predefined auto-tagging rules
const AUTO_TAG_RULES = [
  { name: 'Uploaded', condition: 'always', description: 'Applied to all uploaded records' },
  { name: 'Batch-2025', condition: 'date_based', description: 'Applied to records uploaded in 2025' },
  { name: 'Has-Email', condition: 'has_email', description: 'Applied when email field is present' },
  { name: 'Has-Phone', condition: 'has_phone', description: 'Applied when phone field is present' },
  { name: 'Company-Record', condition: 'has_company', description: 'Applied when company field is present' }
];

export const FileUploadWizard: React.FC<FileUploadWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [csvData, setCsvData] = useState<ParsedCSVData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [appliedTags, setAppliedTags] = useState<TagType[]>([]);
  const [mappingProfileName, setMappingProfileName] = useState('');
  const [shouldSaveProfile, setShouldSaveProfile] = useState(false);
  const [enableAutoTagging, setEnableAutoTagging] = useState(true);
  const [selectedAutoTagRules, setSelectedAutoTagRules] = useState<string[]>(['Uploaded', 'Batch-2025']);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV, XLSX, or XLS file",
        variant: "destructive"
      });
      return;
    }

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      
      if (lines.length < 2) {
        toast({
          title: "Invalid File",
          description: "File must contain at least a header row and one data row",
          variant: "destructive"
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      const parsedData: ParsedCSVData = {
        headers,
        rows,
        fileName: file.name,
        fileSize: file.size
      };

      setCsvData(parsedData);
      
      // Auto-generate initial mappings
      const initialMappings: FieldMapping[] = headers.map(header => ({
        csvField: header,
        systemField: autoMapField(header),
        required: false
      }));
      
      setFieldMappings(initialMappings);
      setCurrentStep(2);

      toast({
        title: "File Uploaded Successfully",
        description: `Loaded ${rows.length} records from ${file.name}`
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to parse the uploaded file",
        variant: "destructive"
      });
    }
  }, []);

  const autoMapField = (header: string): string => {
    const lowerHeader = header.toLowerCase().trim();
    if (lowerHeader.includes('name') || lowerHeader.includes('full')) return 'name';
    if (lowerHeader.includes('email') || lowerHeader.includes('mail')) return 'email';
    if (lowerHeader.includes('phone') || lowerHeader.includes('mobile') || lowerHeader.includes('tel')) return 'phone';
    if (lowerHeader.includes('company') || lowerHeader.includes('organization') || lowerHeader.includes('org')) return 'company';
    if (lowerHeader.includes('url') || lowerHeader.includes('website') || lowerHeader.includes('link')) return 'url';
    if (lowerHeader.includes('note') || lowerHeader.includes('comment') || lowerHeader.includes('description')) return 'notes';
    if (lowerHeader.includes('qr') && lowerHeader.includes('id')) return 'qr_id';
    return 'skip';
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const updateFieldMapping = (csvField: string, systemField: string) => {
    setFieldMappings(prev => 
      prev.map(mapping => 
        mapping.csvField === csvField 
          ? { ...mapping, systemField, required: SYSTEM_FIELDS.find(f => f.value === systemField)?.required || false }
          : mapping
      )
    );
  };

  const validateMappings = (): boolean => {
    const requiredFields = SYSTEM_FIELDS.filter(f => f.required);
    const mappedRequiredFields = fieldMappings.filter(m => 
      requiredFields.some(rf => rf.value === m.systemField)
    );

    if (mappedRequiredFields.length < requiredFields.length) {
      toast({
        title: "Missing Required Fields",
        description: "Please map all required fields before proceeding",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 2 && !validateMappings()) return;
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const applyAutoTagging = (data: Record<string, any>[]): TagType[] => {
    if (!enableAutoTagging) return [];

    const autoTags: TagType[] = [];
    const currentYear = new Date().getFullYear();

    selectedAutoTagRules.forEach(ruleName => {
      const rule = AUTO_TAG_RULES.find(r => r.name === ruleName);
      if (!rule) return;

      let shouldApply = false;

      switch (rule.condition) {
        case 'always':
          shouldApply = true;
          break;
        case 'date_based':
          shouldApply = currentYear === 2025;
          break;
        case 'has_email':
          shouldApply = data.some(row => row.email && row.email.trim());
          break;
        case 'has_phone':
          shouldApply = data.some(row => row.phone && row.phone.trim());
          break;
        case 'has_company':
          shouldApply = data.some(row => row.company && row.company.trim());
          break;
      }

      if (shouldApply) {
        // Create a mock tag object - in real implementation, these would be actual Tag objects
        autoTags.push({
          id: `auto-${ruleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          user_id: '', // Would be filled from current user
          name: ruleName,
          color: '#10B981', // Green for auto-generated tags
          category: 'auto',
          description: rule.description,
          usage_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TagType);
      }
    });

    return autoTags;
  };

  const handleComplete = async () => {
    if (!csvData) return;

    setIsProcessing(true);

    try {
      // Transform data according to mappings
      const mappedData = csvData.rows.map(row => {
        const mappedRow: Record<string, any> = {};
        fieldMappings.forEach(mapping => {
          if (mapping.systemField !== 'skip') {
            mappedRow[mapping.systemField] = row[mapping.csvField] || '';
          }
        });
        return mappedRow;
      });

      // Apply auto-tagging
      const autoTags = applyAutoTagging(mappedData);
      const allTags = [...appliedTags, ...autoTags];

      // Create mapping profile if requested
      let mappingProfile: MappingProfile | undefined;
      if (shouldSaveProfile && mappingProfileName.trim()) {
        mappingProfile = {
          name: mappingProfileName.trim(),
          mappings: fieldMappings,
          description: `Mapping profile for ${csvData.fileName}`
        };
      }

      const result: UploadResult = {
        fileName: csvData.fileName,
        mappedData,
        fieldMappings,
        appliedTags: allTags,
        mappingProfile
      };

      onComplete(result);
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process the uploaded data",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepProgress = () => ((currentStep - 1) / 4) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Upload Your File</h3>
              <p className="text-gray-600">Upload CSV, XLSX, or XLS files to get started</p>
            </div>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
              </h4>
              <p className="text-gray-600 mb-4">or click to browse files</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                <Badge variant="outline">CSV</Badge>
                <Badge variant="outline">XLSX</Badge>
                <Badge variant="outline">XLS</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Map Your Fields</h3>
              <p className="text-gray-600">Match your CSV columns to system fields</p>
            </div>

            {csvData && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">{csvData.fileName}</h4>
                      <p className="text-sm text-blue-700">
                        {csvData.rows.length} records • {(csvData.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Field Mappings</Label>
                  {fieldMappings.map((mapping) => (
                    <div key={mapping.csvField} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <Badge variant="outline" className="bg-white">
                          {mapping.csvField}
                        </Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <Select
                          value={mapping.systemField}
                          onValueChange={(value) => updateFieldMapping(mapping.csvField, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SYSTEM_FIELDS.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                <div className="flex flex-col">
                                  <span>{field.label}</span>
                                  <span className="text-xs text-gray-500">{field.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Preview Your Data</h3>
              <p className="text-gray-600">Review the first 10 rows of your mapped data</p>
            </div>

            {csvData && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        {fieldMappings
                          .filter(m => m.systemField !== 'skip')
                          .map((mapping) => (
                            <th key={mapping.systemField} className="border border-gray-300 p-2 text-left font-medium">
                              {SYSTEM_FIELDS.find(f => f.value === mapping.systemField)?.label || mapping.systemField}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.rows.slice(0, 10).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {fieldMappings
                            .filter(m => m.systemField !== 'skip')
                            .map((mapping) => (
                              <td key={mapping.systemField} className="border border-gray-300 p-2">
                                {row[mapping.csvField] || '-'}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {csvData.rows.length > 10 && (
                  <p className="text-sm text-gray-500 text-center">
                    Showing 10 of {csvData.rows.length} total records
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Apply Tags & Configure Auto-Tagging</h3>
              <p className="text-gray-600">Add tags and configure automatic tagging rules</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Manual Tags (Optional)
                </Label>
                <TagInput
                  selectedTags={appliedTags}
                  onTagsChange={setAppliedTags}
                  placeholder="Add tags to organize your imported data"
                />
                <p className="text-sm text-gray-500 mt-2">
                  These tags will be applied to all imported records
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableAutoTagging"
                    checked={enableAutoTagging}
                    onChange={(e) => setEnableAutoTagging(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="enableAutoTagging" className="text-base font-medium">
                    Enable Auto-Tagging
                  </Label>
                </div>

                {enableAutoTagging && (
                  <div className="space-y-3 pl-6">
                    <Label className="text-sm font-medium">Auto-Tagging Rules</Label>
                    {AUTO_TAG_RULES.map((rule) => (
                      <div key={rule.name} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id={`rule-${rule.name}`}
                          checked={selectedAutoTagRules.includes(rule.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAutoTagRules([...selectedAutoTagRules, rule.name]);
                            } else {
                              setSelectedAutoTagRules(selectedAutoTagRules.filter(r => r !== rule.name));
                            }
                          }}
                          className="rounded border-gray-300 mt-1"
                        />
                        <div>
                          <Label htmlFor={`rule-${rule.name}`} className="text-sm font-medium cursor-pointer">
                            {rule.name}
                          </Label>
                          <p className="text-xs text-gray-500">{rule.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="saveProfile"
                    checked={shouldSaveProfile}
                    onChange={(e) => setShouldSaveProfile(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="saveProfile" className="text-base font-medium">
                    <Save className="w-4 h-4 inline mr-2" />
                    Save Mapping Profile
                  </Label>
                </div>
                
                {shouldSaveProfile && (
                  <div>
                    <Label htmlFor="profileName" className="text-sm font-medium">
                      Profile Name
                    </Label>
                    <Input
                      id="profileName"
                      value={mappingProfileName}
                      onChange={(e) => setMappingProfileName(e.target.value)}
                      placeholder="Enter a name for this mapping profile"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Save this mapping configuration to reuse with similar files
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Import</h3>
              <p className="text-gray-600">Review your settings and confirm the import</p>
            </div>

            {csvData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium text-gray-700">File Details</div>
                    <div>Name: {csvData.fileName}</div>
                    <div>Records: {csvData.rows.length}</div>
                    <div>Size: {(csvData.fileSize / 1024).toFixed(1)} KB</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-700">Import Settings</div>
                    <div>
                      Mapped Fields: {fieldMappings.filter(m => m.systemField !== 'skip').length}
                    </div>
                    <div>Manual Tags: {appliedTags.length}</div>
                    <div>Auto-Tagging: {enableAutoTagging ? 'Enabled' : 'Disabled'}</div>
                    <div>Save Profile: {shouldSaveProfile ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                {(appliedTags.length > 0 || enableAutoTagging) && (
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Tags to be Applied:</div>
                    <div className="flex flex-wrap gap-2">
                      {appliedTags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                      {enableAutoTagging && selectedAutoTagRules.map((ruleName) => (
                        <Badge key={ruleName} variant="outline" className="border-green-500 text-green-700">
                          {ruleName} (auto)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Advanced File Upload Wizard
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of 5</span>
              <span>{Math.round(getStepProgress())}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handlePreviousStep}
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button
              onClick={currentStep === 5 ? handleComplete : handleNextStep}
              disabled={
                (currentStep === 1 && !csvData) || 
                isProcessing
              }
            >
              {currentStep === 5 ? (
                isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Import
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
