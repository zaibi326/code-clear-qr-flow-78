
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
    { id: 'all', label: 'All QR Codes', count: 234 },
    { id: 'dynamic', label: 'Dynamic', count: 186 },
    { id: 'static', label: 'Static', count: 48 },
    { id: 'active', label: 'Active', count: 221 },
    { id: 'inactive', label: 'Inactive', count: 13 }
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
    // Add export logic here
  };

  const handleFilter = () => {
    console.log('Filter functionality triggered');
    // Add filter logic here
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-indigo-100'
              }`}
            >
              <span>{tab.label}</span>
              <Badge 
                variant={activeTab === tab.id ? "secondary" : "outline"} 
                className={`text-xs ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white border-white/20' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                }`}
              >
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => navigate('/quick-generate')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search QR codes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-80 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 border-indigo-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" 
            onClick={handleFilter}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="border-indigo-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-indigo-100">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`rounded-lg ${
              viewMode === 'grid' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={`rounded-lg ${
              viewMode === 'list' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
