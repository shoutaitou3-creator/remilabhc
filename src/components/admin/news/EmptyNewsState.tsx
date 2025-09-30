import React from 'react';
import { FileText, Search } from 'lucide-react';

interface EmptyNewsStateProps {
  hasNews: boolean;
  hasSearchResults: boolean;
  onAddNews: () => void;
  onResetSearch: () => void;
}

const EmptyNewsState: React.FC<EmptyNewsStateProps> = ({
  hasNews,
  hasSearchResults,
  onAddNews,
  onResetSearch
}) => {
  if (!hasNews) {
    // お知らせが1件もない場合
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">お知らせがありません</h3>
        <p className="text-gray-600 mb-6">新しいお知らせを追加してください。</p>
        <button
          onClick={onAddNews}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium min-h-[44px]"
        >
          最初のお知らせを追加
        </button>
      </div>
    );
  }

  if (!hasSearchResults) {
    // 検索結果が0件の場合
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
        <p className="text-gray-600 mb-6">検索条件を変更してお試しください。</p>
        <button
          onClick={onResetSearch}
          className="text-purple-600 hover:text-purple-700 underline"
        >
          検索条件をリセット
        </button>
      </div>
    );
  }

  return null;
};

export default EmptyNewsState;