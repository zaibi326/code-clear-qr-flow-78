
import React from 'react';
import { Plus, Megaphone, BarChart3 } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface CampaignCreatorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CampaignCreatorTabs = ({ activeTab, setActiveTab }: CampaignCreatorTabsProps) => {
  const tabs: Tab[] = [
    { id: 'create', label: 'Create Campaign', icon: Plus },
    { id: 'manage', label: 'Manage Campaigns', icon: Megaphone },
    { id: 'analytics', label: 'Campaign Analytics', icon: BarChart3 }
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
