import React from 'react';
import { Edit, ChevronUp, ChevronDown, Image } from 'lucide-react';
import { getDepartmentDisplayName } from '../../../lib/utils';

interface AdditionalPrize {
  id: string;
  name: string;
  description: string;
  value: string;
  amount: number;
  image?: string;
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

interface AdditionalPrizeCardProps {
  prize: AdditionalPrize;
  index: number;
  totalPrizes: number;
  onEdit: (prize: AdditionalPrize) => void;
  onMoveUp: (prizeId: string) => void;
  onMoveDown: (prizeId: string) => void;
}

const AdditionalPrizeCard: React.FC<AdditionalPrizeCardProps> = ({
  prize,
  index,
  totalPrizes,
  onEdit,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
          {/* 順序変更ボタン（デスクトップ） */}
          <div className="hidden sm:flex flex-col space-y-1">
            <button
              onClick={() => onMoveUp(prize.id)}
              disabled={index === 0}
              type="button"
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="上に移動"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onMoveDown(prize.id)}
              disabled={index === totalPrizes - 1}
              type="button"
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="下に移動"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* 画像と基本情報 */}
          <div className="flex items-start space-x-3 flex-1">
            {prize.image ? (
              <img
                src={prize.image}
                alt={prize.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-200 bg-white flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 flex-shrink-0">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0">
                  #{prize.display_order || index + 1}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                {prize.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {prize.description}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-purple-600">
                  内容: {prize.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-green-600">
                  金額換算: {prize.amount.toLocaleString()}円
                </p>
                <p className="text-xs sm:text-sm font-medium text-blue-600">
                  対象部門: {getDepartmentDisplayName(prize.department)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          {/* モバイル用順序変更ボタン */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => onMoveUp(prize.id)}
              disabled={index === 0}
              type="button"
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="上に移動"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onMoveDown(prize.id)}
              disabled={index === totalPrizes - 1}
              type="button"
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
            onClick={() => onEdit(prize)}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <Edit className="w-4 h-4" />
            <span>編集</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalPrizeCard;