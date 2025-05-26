
import React from 'react';
import { Upload, Database, FileText } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DataManagerTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DataManagerTabs = ({ activeTab, setActiveTab }: DataManagerTabsProps) => {
  const tabs: Tab[] = [
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'manage', label: 'Manage Data', icon: Database },
    { id: 'templates', label: 'CSV Templates', icon: FileText }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
