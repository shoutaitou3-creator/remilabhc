import React from 'react';
import { FileText, Eye, EyeOff, Calendar } from 'lucide-react';
import { NewsItem } from '../../../hooks/useNewsData';

interface NewsStatsProps {
  newsItems: NewsItem[];
}

const NewsStats: React.FC<NewsStatsProps> = ({ newsItems }) => {
  const getLatestUpdate = () => {
    if (newsItems.length === 0) return '未更新';
    const latestUpdate = newsItems.reduce((latest, item) => {
      return new Date(item.updated_at) > new Date(latest) ? item.updated_at : latest;
    }, newsItems[0]?.updated_at || new Date().toISOString());
    return new Date(latestUpdate).toLocaleDateString();
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">総お知らせ数</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{newsItems.length}件</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">公開中</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {newsItems.filter(n => n.is_published).length}件
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">非公開</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {newsItems.filter(n => !n.is_published).length}件
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <EyeOff className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">最終更新</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {getLatestUpdate()}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsStats;