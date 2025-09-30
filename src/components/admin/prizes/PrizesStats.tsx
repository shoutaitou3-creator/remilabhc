import React from 'react';
import { Trophy, Award, Eye, EyeOff } from 'lucide-react';

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

interface PrizesStatsProps {
  mainPrizes: MainPrize[];
  additionalPrizes: AdditionalPrize[];
  totalAmount: string;
}

const PrizesStats: React.FC<PrizesStatsProps> = ({
  mainPrizes,
  additionalPrizes,
  totalAmount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">総額表示</h3>
      <div className="flex items-center space-x-4 mb-6">
        <label className="text-sm font-medium text-gray-700">総賞金・賞品額:</label>
        <div className="text-xl sm:text-2xl font-bold text-rose-600">{totalAmount}</div>
        <span className="text-sm text-gray-500">（自動計算）</span>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">メイン賞金</p>
              <p className="text-xl font-bold text-blue-900">{mainPrizes.length}個</p>
            </div>
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">追加賞金</p>
              <p className="text-xl font-bold text-green-900">{additionalPrizes.length}個</p>
            </div>
            <Award className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">総賞品数</p>
              <p className="text-xl font-bold text-purple-900">{mainPrizes.length + additionalPrizes.length}個</p>
            </div>
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">ハイライト</p>
              <p className="text-xl font-bold text-orange-900">
                {mainPrizes.filter(p => p.highlight).length}個
              </p>
            </div>
            <Eye className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizesStats;