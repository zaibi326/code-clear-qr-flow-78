
import React from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({ label, htmlFor, error, children }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;
