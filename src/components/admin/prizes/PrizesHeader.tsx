import React from 'react';
import { Plus } from 'lucide-react';

interface PrizesHeaderProps {
  onAddMainPrize: () => void;
  onAddAdditionalPrize: () => void;
}

const PrizesHeader: React.FC<PrizesHeaderProps> = ({
  onAddMainPrize,
  onAddAdditionalPrize
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">賞金賞品管理</h2>
          <p className="text-sm sm:text-base text-gray-600">コンテストの賞金賞品情報を編集・管理できます</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onAddMainPrize}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>メイン賞金追加</span>
          </button>
          <button
            onClick={onAddAdditionalPrize}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>追加賞金追加</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrizesHeader;