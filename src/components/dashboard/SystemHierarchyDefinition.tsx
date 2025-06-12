
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, Target, QrCode, BarChart3, Tag, Users } from 'lucide-react';

export function SystemHierarchyDefinition() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          System Hierarchy & Definitions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <Folder className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-blue-900">Projects</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              High-level business initiatives or objectives that group related marketing activities together.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium text-blue-700">Examples:</div>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Summer Marketing 2024</li>
                <li>• Product Launch Q4</li>
                <li>• Holiday Promotions</li>
              </ul>
            </div>
          </div>

          {/* Campaigns */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg text-white">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-green-900">Campaigns</h3>
            </div>
            <p className="text-sm text-green-800 mb-3">
              Specific marketing activities within a project with defined goals, timelines, and target audiences.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium text-green-700">Examples:</div>
              <ul className="text-xs text-green-600 space-y-1">
                <li>• Social Media Push</li>
                <li>• Email Campaign</li>
                <li>• Print Materials</li>
              </ul>
            </div>
          </div>

          {/* QR Codes */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg text-white">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-purple-900">QR Codes</h3>
            </div>
            <p className="text-sm text-purple-800 mb-3">
              Individual trackable assets created for specific campaigns, each with unique content and analytics.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium text-purple-700">Features:</div>
              <ul className="text-xs text-purple-600 space-y-1">
                <li>• Custom logos & styling</li>
                <li>• Variable fields</li>
                <li>• Tagging system</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Flow */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Data Flow & Analytics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-sm mb-2">Hierarchy Structure:</h5>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span>Projects</span>
                  <span className="text-gray-500">contain</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>Campaigns</span>
                  <span className="text-gray-500">contain</span>
                </div>
                <div className="flex items-center gap-2 ml-8">
                  <QrCode className="w-4 h-4 text-purple-500" />
                  <span>QR Codes</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-sm mb-2">Analytics Rollup:</h5>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Scan data rolls up from QR Codes → Campaigns → Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Lead tracking by source, location, and device</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tagging System */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tagging System
          </h4>
          <div className="text-sm space-y-2">
            <p>All QR codes, campaigns, and lead lists support tagging for better organization:</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">source: social-media</Badge>
              <Badge variant="outline">campaign: summer-2024</Badge>
              <Badge variant="outline">location: new-york</Badge>
              <Badge variant="outline">type: promotional</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
