
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, TrendingUp, Users, MapPin, Clock } from 'lucide-react';
import { S3Chart } from './S3Chart';
import { DeviceBreakdown } from './DeviceBreakdown';
import { RegionalHeatmap } from './RegionalHeatmap';
import { ScanTable } from './ScanTable';

export interface AnalyticsData {
  timeframe: string;
  campaigns: string[];
  totalScans: number;
  growthRate: number;
  uniqueUsers: number;
  conversionRate: number;
}

interface AdvancedAnalyticsProps {
  initialData?: AnalyticsData;
}

export function AdvancedAnalytics({ initialData }: AdvancedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [campaign, setCampaign] = useState<string>('all');
  
  // Mock data - would be fetched from backend in real implementation
  const analyticsData: AnalyticsData = initialData || {
    timeframe: '7d',
    campaigns: ['Summer Promo', 'Product Launch', 'Holiday Sale'],
    totalScans: 12487,
    growthRate: 23.5,
    uniqueUsers: 8792,
    conversionRate: 4.7
  };
  
  const handleDownloadCSV = () => {
    // Mock function to download analytics data as CSV
    console.log('Downloading analytics data as CSV...');
  };
  
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Advanced Analytics</CardTitle>
            <CardDescription>Detailed insights into your QR code performance</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-white border-0 h-8 w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={campaign} onValueChange={setCampaign}>
                <SelectTrigger className="bg-white border-0 h-8 w-[150px]">
                  <SelectValue placeholder="All Campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {analyticsData.campaigns.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase().replace(/\s+/g, '-')}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" onClick={handleDownloadCSV}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Scans</p>
                <p className="text-2xl font-bold">{analyticsData.totalScans.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{analyticsData.growthRate}% vs. previous</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <Calendar className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600">Unique Users</p>
                <p className="text-2xl font-bold">{analyticsData.uniqueUsers.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-xs text-emerald-600">
                  <Users className="h-3 w-3 mr-1" />
                  <span>70.4% of total</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-amber-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
                <div className="flex items-center mt-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>1.2% vs. previous</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg. Scan Time</p>
                <p className="text-2xl font-bold">14.2s</p>
                <div className="flex items-center mt-1 text-xs text-emerald-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>-0.8s vs. previous</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="scans">Scan Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <S3Chart />
          </TabsContent>
          
          <TabsContent value="devices" className="mt-0">
            <DeviceBreakdown />
          </TabsContent>
          
          <TabsContent value="geography" className="mt-0">
            <RegionalHeatmap />
          </TabsContent>
          
          <TabsContent value="scans" className="mt-0">
            <ScanTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
