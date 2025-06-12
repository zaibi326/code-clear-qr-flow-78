
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Folder, Target, QrCode, Users, Calendar, TrendingUp } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  campaigns: Campaign[];
  totalQRCodes: number;
  totalScans: number;
  status: 'active' | 'completed' | 'paused';
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  qrCodes: number;
  scans: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
}

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Summer Marketing 2024',
    description: 'Comprehensive summer marketing initiative across all channels',
    totalQRCodes: 25,
    totalScans: 1245,
    status: 'active',
    campaigns: [
      {
        id: 'camp-1',
        name: 'Social Media Push',
        type: 'Social Media',
        qrCodes: 8,
        scans: 456,
        startDate: '2024-05-01',
        endDate: '2024-07-31',
        status: 'active'
      },
      {
        id: 'camp-2',
        name: 'Email Campaign',
        type: 'Email Marketing',
        qrCodes: 12,
        scans: 678,
        startDate: '2024-05-15',
        endDate: '2024-08-15',
        status: 'active'
      },
      {
        id: 'camp-3',
        name: 'Print Materials',
        type: 'Print',
        qrCodes: 5,
        scans: 111,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        status: 'active'
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Product Launch Q4',
    description: 'New product line launch with interactive demonstrations',
    totalQRCodes: 18,
    totalScans: 987,
    status: 'active',
    campaigns: [
      {
        id: 'camp-4',
        name: 'Demo Campaign',
        type: 'Product Demo',
        qrCodes: 10,
        scans: 567,
        startDate: '2024-05-20',
        endDate: '2024-09-30',
        status: 'active'
      },
      {
        id: 'camp-5',
        name: 'Beta Testing',
        type: 'Testing',
        qrCodes: 8,
        scans: 420,
        startDate: '2024-05-01',
        endDate: '2024-07-01',
        status: 'completed'
      }
    ]
  }
];

export function ProjectCampaignHierarchy() {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      paused: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project & Campaign Hierarchy</span>
          <Button variant="outline" size="sm">
            View All Projects
          </Button>
        </CardTitle>
        <div className="text-sm text-gray-600 mt-2">
          <p><strong>Project:</strong> A collection of related campaigns under one business objective</p>
          <p><strong>Campaign:</strong> Specific marketing activities within a project with defined goals and timelines</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 bg-gray-50">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <QrCode className="w-4 h-4 text-gray-500" />
                        {project.totalQRCodes} QR Codes
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        {project.totalScans.toLocaleString()} Scans
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusBadge(project.status)} border`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>

              {/* Campaigns */}
              <div className="ml-8 space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Campaigns ({project.campaigns.length})
                </h4>
                {project.campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.type}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-semibold text-sm">{campaign.qrCodes}</div>
                        <div className="text-xs text-gray-500">QR Codes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm">{campaign.scans}</div>
                        <div className="text-xs text-gray-500">Scans</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={`${getStatusBadge(campaign.status)} border text-xs`}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">System Hierarchy Summary</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Projects</strong> represent major business initiatives or objectives</p>
            <p>• <strong>Campaigns</strong> are specific marketing activities within projects</p>
            <p>• <strong>QR Codes</strong> are individual assets created for campaigns</p>
            <p>• All scan data and analytics roll up from QR Codes → Campaigns → Projects</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
