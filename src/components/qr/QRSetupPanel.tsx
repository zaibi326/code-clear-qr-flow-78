
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QRCodeType } from './QRGeneratorStepper';

interface QRSetupPanelProps {
  qrType: QRCodeType;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function QRSetupPanel({ qrType, onComplete, onBack }: QRSetupPanelProps) {
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (isFormValid()) {
      onComplete(formData);
    }
  };

  const isFormValid = () => {
    switch (qrType.id) {
      case 'url':
      case 'multi-link':
      case 'pdf':
        return formData.url && formData.url.trim();
      case 'email-static':
        return formData.email && formData.email.trim();
      case 'call-static':
      case 'sms-static':
        return formData.phone && formData.phone.trim();
      default:
        return true;
    }
  };

  const renderFormFields = () => {
    switch (qrType.id) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="title">Page Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter page title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'multi-link':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkpage-url">Linkpage URL *</Label>
              <Input
                id="linkpage-url"
                type="url"
                placeholder="https://linktr.ee/yourname"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your link collection"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pdf-url">PDF URL *</Label>
              <Input
                id="pdf-url"
                type="url"
                placeholder="https://example.com/document.pdf"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pdf-title">Document Title (Optional)</Label>
              <Input
                id="pdf-title"
                placeholder="Enter document title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'email-static':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                value={formData.subject || ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'call-static':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'sms-static':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Enter your message"
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Enter your content"
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${qrType.color} text-white`}>
              <qrType.icon className="h-5 w-5" />
            </div>
            Setup {qrType.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderFormFields()}
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!isFormValid()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
