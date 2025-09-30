import React from 'react';
import { Plus, Settings } from 'lucide-react';

interface NewsHeaderProps {
  onAddNews: () => void;
  onShowCategoryManagement: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ onAddNews, onShowCategoryManagement }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">お知らせ管理</h2>
          <p className="text-sm sm:text-base text-gray-600">新着情報・プレスリリースの管理</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onShowCategoryManagement}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
          >
            <Settings className="w-5 h-5" />
            <span>カテゴリ管理</span>
          </button>
          <button
            onClick={onAddNews}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>新しいお知らせを追加</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsHeader;