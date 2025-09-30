import React from 'react';
import { Trophy, Search } from 'lucide-react';

interface EmptyPrizesStateProps {
  hasPrizes: boolean;
  hasSearchResults: boolean;
  onAddMainPrize: () => void;
  onAddAdditionalPrize: () => void;
  onResetSearch: () => void;
}

const EmptyPrizesState: React.FC<EmptyPrizesStateProps> = ({
  hasPrizes,
  hasSearchResults,
  onAddMainPrize,
  onAddAdditionalPrize,
  onResetSearch
}) => {
  if (!hasPrizes) {
    // 賞金・賞品が1件もない場合
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">賞金・賞品が登録されていません</h3>
        <p className="text-gray-600 mb-6">新しい賞金・賞品を追加してください。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onAddMainPrize}
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium min-h-[44px]"
          >
            メイン賞金を追加
          </button>
          <button
            onClick={onAddAdditionalPrize}
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium min-h-[44px]"
          >
            追加賞金・副賞を追加
          </button>
        </div>
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

export default EmptyPrizesState;