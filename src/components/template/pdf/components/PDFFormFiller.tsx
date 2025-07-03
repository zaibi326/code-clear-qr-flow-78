
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  CheckSquare, 
  Circle,
  Square,
  Type,
  Calendar,
  Signature,
  Save
} from 'lucide-react';

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'date' | 'signature';
  value: any;
  x: number;
  y: number;
  width: number;
  height: number;
  required?: boolean;
  options?: string[];
}

interface PDFFormFillerProps {
  currentPage: number;
  pdfDocument: any;
}

export const PDFFormFiller: React.FC<PDFFormFillerProps> = ({
  currentPage,
  pdfDocument
}) => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');

  // Extract form fields from PDF
  useEffect(() => {
    const extractFormFields = async () => {
      if (!pdfDocument) return;

      try {
        const page = await pdfDocument.getPage(currentPage + 1);
        const annotations = await page.getAnnotations();
        
        const fields: FormField[] = annotations
          .filter((annotation: any) => annotation.subtype === 'Widget')
          .map((annotation: any, index: number) => ({
            id: `field-${currentPage}-${index}`,
            name: annotation.fieldName || `Field ${index + 1}`,
            type: getFieldType(annotation),
            value: annotation.fieldValue || '',
            x: annotation.rect[0],
            y: annotation.rect[1],
            width: annotation.rect[2] - annotation.rect[0],
            height: annotation.rect[3] - annotation.rect[1],
            required: annotation.required || false,
            options: annotation.options || []
          }));

        setFormFields(fields);
      } catch (error) {
        console.error('Error extracting form fields:', error);
      }
    };

    extractFormFields();
  }, [pdfDocument, currentPage]);

  const getFieldType = (annotation: any): FormField['type'] => {
    if (annotation.fieldType === 'Tx') return 'text';
    if (annotation.fieldType === 'Btn') return 'checkbox';
    if (annotation.fieldType === 'Ch') return 'select';
    return 'text';
  };

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `custom-field-${Date.now()}`,
      name: `New ${type} field`,
      type,
      value: type === 'checkbox' ? false : '',
      x: 100,
      y: 100,
      width: type === 'textarea' ? 200 : 150,
      height: type === 'textarea' ? 100 : 30,
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };

    setFormFields(prev => [...prev, newField]);
    setSelectedField(newField.id);
    setIsAddingField(false);
  };

  const handleDeleteField = (fieldId: string) => {
    setFormFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const selectedFieldData = formFields.find(field => field.id === selectedField);

  const renderFieldInput = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={field.value}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name}`}
            className="h-8"
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={field.value}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name}`}
            className="min-h-[60px]"
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => handleFieldValueChange(field.id, checked)}
            />
            <Label className="text-sm">{field.name}</Label>
          </div>
        );
      case 'select':
        return (
          <Select
            value={field.value}
            onValueChange={(value) => handleFieldValueChange(field.id, value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'date':
        return (
          <Input
            type="date"
            value={field.value}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            className="h-8"
          />
        );
      default:
        return (
          <Input
            value={field.value}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name}`}
            className="h-8"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Form Fields</Label>
        <p className="text-xs text-gray-500 mb-3">
          {formFields.length} form field(s) found on this page
        </p>
      </div>

      {/* Add New Field */}
      <div className="space-y-2">
        <Button
          onClick={() => setIsAddingField(!isAddingField)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          Add Form Field
        </Button>
        
        {isAddingField && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleAddField('text')}
              variant="outline"
              size="sm"
            >
              <Type className="w-4 h-4 mr-1" />
              Text
            </Button>
            <Button
              onClick={() => handleAddField('textarea')}
              variant="outline"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-1" />
              Textarea
            </Button>
            <Button
              onClick={() => handleAddField('checkbox')}
              variant="outline"
              size="sm"
            >
              <CheckSquare className="w-4 h-4 mr-1" />
              Checkbox
            </Button>
            <Button
              onClick={() => handleAddField('select')}
              variant="outline"
              size="sm"
            >
              <Square className="w-4 h-4 mr-1" />
              Select
            </Button>
            <Button
              onClick={() => handleAddField('date')}
              variant="outline"
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Date
            </Button>
            <Button
              onClick={() => handleAddField('signature')}
              variant="outline"
              size="sm"
            >
              <Signature className="w-4 h-4 mr-1" />
              Signature
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Form Fields List */}
      <div className="space-y-3">
        {formFields.map((field) => (
          <div
            key={field.id}
            className={`p-3 border rounded-lg ${
              selectedField === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedField(field.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">{field.name}</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {field.type}
                </span>
                {field.required && (
                  <span className="text-xs text-red-500">*</span>
                )}
              </div>
            </div>
            {renderFieldInput(field)}
          </div>
        ))}
      </div>

      {formFields.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No form fields found on this page</p>
          <p className="text-xs text-gray-400 mt-1">
            Add custom form fields using the button above
          </p>
        </div>
      )}

      {/* Field Properties */}
      {selectedFieldData && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Field Properties</Label>
            <div>
              <Label className="text-xs text-gray-600">Field Name</Label>
              <Input
                value={selectedFieldData.name}
                onChange={(e) => {
                  setFormFields(prev => 
                    prev.map(field => 
                      field.id === selectedField ? { ...field, name: e.target.value } : field
                    )
                  );
                }}
                className="h-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedFieldData.required}
                onCheckedChange={(checked) => {
                  setFormFields(prev => 
                    prev.map(field => 
                      field.id === selectedField ? { ...field, required: !!checked } : field
                    )
                  );
                }}
              />
              <Label className="text-sm">Required field</Label>
            </div>
            <Button
              onClick={() => handleDeleteField(selectedField)}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              Delete Field
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
