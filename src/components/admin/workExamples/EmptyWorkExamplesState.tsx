import React from 'react';
import { Image, Search } from 'lucide-react';

interface EmptyWorkExamplesStateProps {
  hasWorkExamples: boolean;
  hasSearchResults: boolean;
  onAddWorkExample: () => void;
  onResetSearch: () => void;
}

const EmptyWorkExamplesState: React.FC<EmptyWorkExamplesStateProps> = ({
  hasWorkExamples,
  hasSearchResults,
  onAddWorkExample,
  onResetSearch
}) => {
  if (!hasWorkExamples) {
    // 作品例が1件もない場合
    return (
      <div className="text-center py-12">
        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">作品例が登録されていません</h3>
        <p className="text-gray-600 mb-6">新しい作品例を追加してください。</p>
        <button
          onClick={onAddWorkExample}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium min-h-[44px]"
        >
          最初の作品例を追加
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

export default EmptyWorkExamplesState;