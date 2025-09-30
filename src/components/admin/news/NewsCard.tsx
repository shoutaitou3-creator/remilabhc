import React from 'react';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  ChevronUp, 
  ChevronDown,
  Link
} from 'lucide-react';
import { NewsItem } from '../../../hooks/useNewsData';


interface NewsCardProps {
  item: NewsItem;
  index: number;
  totalItems: number;
  onEdit: (item: NewsItem) => void;
  onDelete: (id: string) => void;
  onMoveNews: (id: string, direction: 'up' | 'down') => void;
  getCategoryDisplay: (item: NewsItem) => { name: string; color: string };
}

const NewsCard: React.FC<NewsCardProps> = ({
  item,
  index,
  totalItems,
  onEdit,
  onDelete,
  onMoveNews,
  getCategoryDisplay
}) => {
  const categoryDisplay = getCategoryDisplay(item);

  return (
    <div
      className={`rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${
        item.isPublished 
          ? 'bg-white border-gray-200 hover:shadow-md' 
          : 'bg-gray-100 border-gray-300 opacity-75'
      }`}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
            {/* 順序変更ボタン（デスクトップ） */}
            <div className="hidden sm:flex flex-col space-y-1">
              <button
                onClick={() => onMoveNews(item.id, 'up')}
                disabled={index === 0}
                className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  item.isPublished ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                }`}
                title="上に移動"
              >
                <ChevronUp className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onMoveNews(item.id, 'down')}
                disabled={index === totalItems - 1}
                className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  item.isPublished ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                }`}
                title="下に移動"
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span 
                  className="text-xs px-2 py-1 rounded font-medium text-white"
                  style={{ backgroundColor: categoryDisplay.color }}
                >
                  {categoryDisplay.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded font-medium border transition-all duration-300 ${
                  item.is_published 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {item.is_published ? '✓ 公開中' : '✕ 非公開'}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  #{item.display_order}
                </span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{item.publish_date}</span>
                </div>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 line-clamp-2 transition-colors duration-300 ${
                item.is_published ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {item.title}
              </h3>
              <p className={`text-sm leading-relaxed line-clamp-3 mb-3 transition-colors duration-300 ${
                item.is_published ? 'text-gray-600' : 'text-gray-500'
              }`}>
                {item.content.replace(/<[^>]*>/g, '').length > 200 
                  ? item.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
                  : item.content.replace(/<[^>]*>/g, '')
                }
              </p>
              <div className={`text-xs transition-colors duration-300 ${
                item.is_published ? 'text-gray-500' : 'text-gray-400'
              }`}>
                カテゴリ: {categoryDisplay.name} | 
                更新: {new Date(item.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            {/* モバイル用順序変更ボタン */}
            <div className="flex sm:hidden items-center space-x-2">
              <button
                onClick={() => onMoveNews(item.id, 'up')}
                disabled={index === 0}
                className={`flex items-center justify-center w-10 h-10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  item.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                }`}
                title="上に移動"
              >
                <ChevronUp className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onMoveNews(item.id, 'down')}
                disabled={index === totalItems - 1}
                className={`flex items-center justify-center w-10 h-10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  item.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                }`}
                title="下に移動"
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="hidden sm:block text-xs text-gray-500 text-right mr-2">
              <div>順序変更</div>
              <div>↑↓ボタン</div>
            </div>
            <button
              onClick={() => onEdit(item)}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-all duration-300 text-sm min-h-[44px] ${
                item.is_published 
                  ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105' 
                  : 'bg-gray-500 hover:bg-gray-600 hover:shadow-md'
              }`}
            >
              <Edit className="w-4 h-4" />
              <span>編集</span>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-all duration-300 text-sm min-h-[44px] ${
                item.is_published 
                  ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105' 
                  : 'bg-gray-600 hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>削除</span>
            </button>
          </div>
        </div>

        {/* 添付ファイル・リンク・動画の表示 */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {item.link_url && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Link className="w-4 h-4" />
              <span>リンクあり</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;