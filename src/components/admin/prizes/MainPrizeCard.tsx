import React from 'react';
import { Edit, Crown, Medal, Award, ChevronUp, ChevronDown } from 'lucide-react';
import { getDepartmentDisplayName } from '../../../lib/utils';

interface MainPrize {
  id: string;
  rank: string;
  title: string;
  amount: string;
  description: string;
  icon: string;
  highlight: boolean;
  amount_value: number;
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

interface MainPrizeCardProps {
  prize: MainPrize;
  index: number;
  totalPrizes: number;
  onEdit: (prize: MainPrize) => void;
  onMoveUp: (prizeId: string) => void;
  onMoveDown: (prizeId: string) => void;
}

const MainPrizeCard: React.FC<MainPrizeCardProps> = ({
  prize,
  index,
  totalPrizes,
  onEdit,
  onMoveUp,
  onMoveDown
}) => {
  // アイコン取得関数
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'crown':
        return <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-600" />;
      case 'medal':
        return <Medal className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500" />;
      case 'award':
        return <Award className="w-8 h-8 sm:w-12 sm:h-12 text-amber-700" />;
      default:
        return <Award className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600" />;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4 sm:mb-6">
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

          {/* アイコンと基本情報 */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
            <div className="flex-shrink-0">
              {getIcon(prize.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0">
                  #{prize.display_order || index + 1}
                </span>
                {prize.highlight && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ハイライト
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                {prize.title}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
                {prize.amount}
              </p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {prize.description}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs sm:text-sm font-medium text-green-600">
                  金額換算: {prize.amount_value.toLocaleString()}円
                </p>
                <p className="text-xs sm:text-sm font-medium text-blue-600">
                  対象部門: {getDepartmentDisplayName(prize.department, false)}
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

export default MainPrizeCard;