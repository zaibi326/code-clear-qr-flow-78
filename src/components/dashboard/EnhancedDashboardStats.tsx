
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Eye, Users, TrendingUp, MapPin, Clock, Tag, Download } from 'lucide-react';
import { enhancedQRService } from '@/utils/enhancedQRService';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface DashboardStatsProps {
  totalQRCodes?: number;
  totalScans?: number;
  uniqueScans?: number;
  activeCampaigns?: number;
  totalProjects?: number;
  recentScans?: any[];
}

export function EnhancedDashboardStats({ 
  totalQRCodes = 0, 
  totalScans = 0, 
  uniqueScans = 0, 
  activeCampaigns = 0,
  totalProjects = 0,
  recentScans = []
}: DashboardStatsProps) {
  const { user } = useAuth();
  const [realTimeStats, setRealTimeStats] = useState({
    qrCodes: totalQRCodes,
    scans: totalScans,
    uniqueScans: uniqueScans,
    recentActivity: recentScans
  });

  useEffect(() => {
    if (user) {
      loadRealTimeStats();
    }
  }, [user]);

  const loadRealTimeStats = async () => {
    try {
      const qrData = await enhancedQRService.getQRCodesWithAnalytics(user!.id);
      const analytics = await enhancedQRService.getScanAnalytics(user!.id, 'month');
      
      const totalScansCount = qrData.reduce((sum, qr) => sum + (qr.stats?.total_scans || 0), 0);
      const uniqueSessionIds = new Set(analytics.map(scan => scan.session_id));
      
      setRealTimeStats({
        qrCodes: qrData.length,
        scans: totalScansCount,
        uniqueScans: uniqueSessionIds.size,
        recentActivity: analytics.slice(0, 5).map(scan => ({
          qrName: scan.qr_codes?.name || 'Unnamed QR',
          project: scan.projects?.name || 'No Project',
          location: scan.location_data?.country || 'Unknown',
          time: new Date(scan.scan_timestamp).toLocaleString()
        }))
      });
    } catch (error) {
      console.error('Error loading real-time stats:', error);
    }
  };

  const statsData = [
    {
      title: "Total QR Codes Generated",
      value: realTimeStats.qrCodes.toLocaleString(),
      change: "+12 today",
      changeType: "positive" as const,
      icon: QrCode,
      description: "Across all projects",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Scans",
      value: realTimeStats.scans.toLocaleString(),
      change: "+18% this week",
      changeType: "positive" as const,
      icon: Eye,
      description: "All-time scans",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Unique Scans",
      value: realTimeStats.uniqueScans.toLocaleString(),
      change: "+8% vs last week",
      changeType: "positive" as const,
      icon: Users,
      description: "Unique visitors",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Projects",
      value: totalProjects.toString(),
      change: "+2 this month",
      changeType: "positive" as const,
      icon: Tag,
      description: "Running projects",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-sm font-medium text-green-600">
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Scan Activity */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Scan Activity</span>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realTimeStats.recentActivity.slice(0, 5).map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{scan.qrName}</p>
                    <p className="text-xs text-gray-500">{scan.project}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {scan.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {scan.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
