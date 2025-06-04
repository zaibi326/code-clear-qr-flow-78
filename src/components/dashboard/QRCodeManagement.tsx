
import React, { useState } from 'react';
import { QRCodeGrid } from './QRCodeGrid';
import { QRCodeFilters } from './QRCodeFilters';

export function QRCodeManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <QRCodeFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onSearch={handleSearch}
      />
      <QRCodeGrid 
        activeTab={activeTab}
        viewMode={viewMode}
        searchQuery={searchQuery}
      />
    </div>
  );
}
