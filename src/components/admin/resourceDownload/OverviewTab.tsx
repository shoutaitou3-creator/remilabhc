import React from 'react';
import { Download, TrendingUp, BarChart3, FileText, Clock } from 'lucide-react';
import { DownloadStats, Resource } from '../../../types/resourceDownload';

interface OverviewTabProps {
  downloadStats: DownloadStats;
  resources: Resource[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ downloadStats, resources }) => {
  // 相対時間を計算する関数
  const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '今';
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`;
    return `${Math.floor(diffInMinutes / 1440)}日前`;
  };

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">総ダウンロード数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{downloadStats.totalDownloads.toLocaleString()}件</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日のDL数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{downloadStats.todayDownloads}件</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">コンバージョン率</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{downloadStats.conversionRate}%</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              今日のDL数 ÷ 総DL数 × 100
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">人気資料</p>
              <p className="text-base font-bold text-gray-900 mt-1 line-clamp-2">
                {downloadStats.popularResource}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 最近のダウンロード活動 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">最近のダウンロード活動</h3>
        {downloadStats.recentActivity && downloadStats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {downloadStats.recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className={`w-5 h-5 ${
                    index % 3 === 0 ? 'text-blue-600' : 
                    index % 3 === 1 ? 'text-purple-600' : 'text-green-600'
                  }`} />
                  <span className="text-sm text-gray-900">
                    {activity.resource?.title || '不明な資料'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {getRelativeTime(activity.downloaded_at)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">まだダウンロード活動がありません</p>
            <p className="text-gray-400 text-xs mt-1">
              資料がダウンロードされると、ここに活動履歴が表示されます
            </p>
          </div>
        )}
      </div>

      {/* 追加統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 時間別ダウンロード傾向 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">時間別ダウンロード傾向</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">午前（6:00-12:00）</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">午後（12:00-18:00）</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">夜間（18:00-24:00）</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 資料別ダウンロード数 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">資料別ダウンロード数</h3>
          <div className="space-y-3">
            {resources.slice(0, 5).map((resource, index) => (
              <div key={resource.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 truncate">
                    {resource.title}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {resource.download_count}回
                  </div>
                  <div className="text-xs text-gray-500">
                    {downloadStats.totalDownloads > 0 
                      ? `${Math.round((resource.download_count / downloadStats.totalDownloads) * 100)}%`
                      : '0%'
                    }
                  </div>
                </div>
              </div>
            ))}
            {resources.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">資料が登録されていません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;