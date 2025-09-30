import React from 'react';
import { BarChart3, FileText, ExternalLink, TrendingUp } from 'lucide-react';
import { TabType } from '../../../types/resourceDownload';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview' as TabType, label: '概要', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'resources' as TabType, label: '資料設定', icon: <FileText className="w-4 h-4" /> },
    { id: 'redirect' as TabType, label: '遷移先設定', icon: <ExternalLink className="w-4 h-4" /> },
    { id: 'analytics' as TabType, label: '分析', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;