
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid3X3, List, Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QRCodeFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
}

export function QRCodeFilters({ activeTab, setActiveTab, viewMode, setViewMode }: QRCodeFiltersProps) {
  const navigate = useNavigate();

  const tabs = [
    { id: 'all', label: 'All QR Codes', count: 234 },
    { id: 'dynamic', label: 'Dynamic', count: 186 },
    { id: 'static', label: 'Static', count: 48 },
    { id: 'active', label: 'Active', count: 221 },
    { id: 'inactive', label: 'Inactive', count: 13 }
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => navigate('/quick-generate')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search QR codes..."
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
