
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataTemplatesTab = () => {
  const { toast } = useToast();

  const downloadTemplate = (templateType: 'basic' | 'advanced') => {
    try {
      let csvContent = '';
      let filename = '';

      if (templateType === 'basic') {
        csvContent = [
          'name,email,url',
          'John Doe,john@example.com,https://johndoe.com',
          'Jane Smith,jane@example.com,https://janesmith.com',
          'Bob Johnson,bob@example.com,https://bobjohnson.com'
        ].join('\n');
        filename = 'basic_campaign_template.csv';
      } else {
        csvContent = [
          'name,email,url,company,phone,custom_field',
          'John Doe,john@example.com,https://johndoe.com,Tech Corp,+1234567890,VIP Customer',
          'Jane Smith,jane@example.com,https://janesmith.com,Design LLC,+0987654321,Premium Member',
          'Bob Johnson,bob@example.com,https://bobjohnson.com,Marketing Inc,+1122334455,New Lead'
        ].join('\n');
        filename = 'advanced_campaign_template.csv';
      }

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Template Downloaded",
        description: `${filename} has been downloaded successfully`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the template file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>CSV Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-3">Basic Campaign Template</h3>
              <p className="text-gray-600 text-sm mb-4">
                Simple template with name, email, and URL columns for basic QR campaigns.
              </p>
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  <strong>Includes:</strong> name, email, url
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadTemplate('basic')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-3">Advanced Campaign Template</h3>
              <p className="text-gray-600 text-sm mb-4">
                Extended template with additional fields for comprehensive campaign data.
              </p>
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  <strong>Includes:</strong> name, email, url, company, phone, custom_field
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadTemplate('advanced')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Required Fields</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>name:</strong> Recipient's full name</li>
                <li>• <strong>email:</strong> Valid email address (will be validated)</li>
                <li>• <strong>url:</strong> Target URL for the QR code (must include http:// or https://)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Optional Fields</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>company:</strong> Company or organization name</li>
                <li>• <strong>phone:</strong> Phone number (any format)</li>
                <li>• <strong>custom_field:</strong> Any additional data you want to track</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Best Results</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep column headers exactly as shown in the templates</li>
                <li>• Ensure all URLs start with http:// or https://</li>
                <li>• Use valid email formats (will be automatically validated)</li>
                <li>• Save your file as CSV format before uploading</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
