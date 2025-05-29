
import React from 'react';
import { URLForm } from './URLForm';
import { MultiLinkForm } from './MultiLinkForm';
import { PDFForm } from './PDFForm';
import { EmailForm } from './EmailForm';
import { PhoneForm } from './PhoneForm';
import { SMSForm } from './SMSForm';
import { DefaultForm } from './DefaultForm';

interface QRFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export const QRFormRegistry: Record<string, React.ComponentType<QRFormProps>> = {
  'url': URLForm,
  'multi-link': MultiLinkForm,
  'pdf': PDFForm,
  'email-static': EmailForm,
  'call-static': PhoneForm,
  'sms-static': SMSForm,
};

export function getQRForm(qrTypeId: string): React.ComponentType<QRFormProps> {
  return QRFormRegistry[qrTypeId] || DefaultForm;
}
