
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar,
  Users,
  QrCode,
  DollarSign,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminReportsTab = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: BarChart3, description: 'General platform metrics' },
    { id: 'users', name: 'User Analytics', icon: Users, description: 'User registration and activity' },
    { id: 'qr-codes', name: 'QR Code Usage', icon: QrCode, description: 'QR code creation and scan metrics' },
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, description: 'Payment and subscription data' },
    { id: 'performance', name: 'Performance Report', icon: TrendingUp, description: 'System performance metrics' }
  ];

  const mockMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalQRCodes: 5432,
    totalScans: 23456,
    revenue: 12450,
    growth: 12.5
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${reportTypes.find(r => r.id === selectedReport)?.name} for the last ${selectedPeriod} has been generated.`,
    });
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting report in ${format.toUpperCase()} format...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Generate and export platform reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mockMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{mockMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{mockMetrics.totalQRCodes.toLocaleString()}</div>
            <p className="text-sm text-gray-600">QR Codes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{mockMetrics.totalScans.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">${mockMetrics.revenue.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">+{mockMetrics.growth}%</div>
            <p className="text-sm text-gray-600">Growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generate Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      {selectedReport === report.id && (
                        <Badge className="ml-auto">Selected</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button onClick={handleGenerateReport} className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Export your generated reports in various formats
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleExportReport('pdf')}
                className="justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportReport('csv')}
                className="justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportReport('xlsx')}
                className="justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportReport('json')}
                className="justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'User Analytics Report', date: '2024-01-15', format: 'PDF', size: '2.3 MB' },
              { name: 'QR Code Usage Report', date: '2024-01-14', format: 'CSV', size: '1.1 MB' },
              { name: 'Revenue Report', date: '2024-01-13', format: 'Excel', size: '3.2 MB' },
              { name: 'Performance Report', date: '2024-01-12', format: 'PDF', size: '1.8 MB' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-600">
                      {report.date} • {report.format} • {report.size}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsTab;
