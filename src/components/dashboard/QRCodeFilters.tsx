
import React, { useState } from 'react';
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
  onSearch?: (query: string) => void;
}

export function QRCodeFilters({ 
  activeTab, 
  setActiveTab, 
  viewMode, 
  setViewMode,
  onSearch 
}: QRCodeFiltersProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all-qr-codes', label: 'All QR Codes', count: 234 },
    { id: 'dynamic-qr', label: 'Dynamic', count: 186 },
    { id: 'static-qr', label: 'Static', count: 48 },
    { id: 'active-qr', label: 'Active', count: 221 },
    { id: 'inactive-qr', label: 'Inactive', count: 13 }
  ];

  const handleTabClick = (tabId: string) => {
    console.log('Tab clicked:', tabId);
    setActiveTab(tabId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
    console.log('Search query:', value);
  };

  const handleExport = () => {
    console.log('Export functionality triggered');
  };

  const handleFilter = () => {
    console.log('Filter functionality triggered');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => navigate('/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search QR codes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 border-gray-300 text-gray-600 hover:text-gray-900" 
            onClick={handleFilter}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="border-gray-300 text-gray-600 hover:text-gray-900"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`rounded-md ${
              viewMode === 'grid' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={`rounded-md ${
              viewMode === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
