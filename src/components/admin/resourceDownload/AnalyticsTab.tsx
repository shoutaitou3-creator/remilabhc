import React from 'react';
import { FileText } from 'lucide-react';
import { Resource, DownloadStats } from '../../../types/resourceDownload';

interface AnalyticsTabProps {
  resources: Resource[];
  downloadStats: DownloadStats;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ resources, downloadStats }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">ダウンロード分析</h3>
      
      {/* 期間別統計 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">期間別ダウンロード数</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
            <div className="text-sm text-gray-600">今週</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">623</div>
            <div className="text-sm text-gray-600">今月</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">1,247</div>
            <div className="text-sm text-gray-600">累計</div>
          </div>
        </div>
      </div>

      {/* 資料別統計 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">資料別ダウンロード数</h4>
        <div className="space-y-3">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{resource.title}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{resource.download_count}回</div>
                <div className="text-xs text-gray-500">
                  {((resource.download_count / downloadStats.totalDownloads) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;