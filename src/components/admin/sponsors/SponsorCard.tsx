import React from 'react';
import { Edit, ChevronUp, ChevronDown, Crown, Gem, Award, Medal, Zap, Shield } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  description: string;
  award: string;
  image: string;
  rank: string;
  url: string;
  display_order: number;
}

interface SponsorCardProps {
  sponsor: Sponsor;
  index: number;
  totalSponsors: number;
  onEdit: (sponsor: Sponsor) => void;
  onMoveUp: (sponsorId: string) => void;
  onMoveDown: (sponsorId: string) => void;
}

const SponsorCard: React.FC<SponsorCardProps> = ({
  sponsor,
  index,
  totalSponsors,
  onEdit,
  onMoveUp,
  onMoveDown
}) => {
  // ランクに応じた色を取得する関数
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'スペシャル':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg border-2 border-purple-300';
      case 'ダイヤモンド':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border-2 border-blue-300';
      case 'ゴールド':
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg border-2 border-yellow-300';
      case 'シルバー':
        return 'bg-gradient-to-r from-gray-400 to-slate-400 text-white shadow-md border-2 border-gray-300';
      case 'ブロンズ':
        return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md border-2 border-orange-300';
      case 'チタン':
        return 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-md border-2 border-slate-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // ランクに応じたアイコンを取得する関数
  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'スペシャル':
        return <Crown className="w-5 h-5 mr-2" />;
      case 'ダイヤモンド':
        return <Gem className="w-5 h-5 mr-2" />;
      case 'ゴールド':
        return <Award className="w-5 h-5 mr-2" />;
      case 'シルバー':
        return <Medal className="w-4 h-4 mr-2" />;
      case 'ブロンズ':
        return <Shield className="w-4 h-4 mr-2" />;
      case 'チタン':
        return <Zap className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  // 協賛企業カードは常に公開状態として扱う（協賛企業に公開/非公開の概念はないため）
  const cardStyling = {
    container: 'bg-white border-gray-200 hover:shadow-lg',
    title: 'text-gray-900',
    content: 'text-gray-600',
    meta: 'text-gray-500'
  };
  return (
    <div className={`p-4 sm:p-6 transition-all duration-300 ${cardStyling.container}`}>
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4 sm:mb-6">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
          {/* 順序変更ボタン */}
          <div className="hidden sm:flex flex-col space-y-1">
            <button
              onClick={() => onMoveUp(sponsor.id)}
              disabled={index === 0}
              type="button"
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="上に移動"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onMoveDown(sponsor.id)}
              disabled={index === totalSponsors - 1}
              type="button"
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="下に移動"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <img
            src={sponsor.image || 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={sponsor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-200 flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0">
                #{sponsor.display_order || index + 1}
              </span>
              <span className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-lg ${getRankColor(sponsor.rank)}`}>
                {getRankIcon(sponsor.rank)}
                {sponsor.rank}
              </span>
            </div>
            <h3 className={`text-lg sm:text-xl font-bold truncate transition-colors duration-300 ${cardStyling.title}`}>
              {sponsor.name}
            </h3>
            <p className="text-sm sm:text-base text-purple-600 font-medium line-clamp-2 transition-colors duration-300">
              {sponsor.award}
            </p>
            <a 
              href={sponsor.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm underline mt-1 block truncate"
            >
              企業サイト
            </a>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          {/* モバイル用順序変更ボタン */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => onMoveUp(sponsor.id)}
              disabled={index === 0}
              type="button"
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="上に移動"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onMoveDown(sponsor.id)}
              disabled={index === totalSponsors - 1}
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
            onClick={() => onEdit(sponsor)}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 text-sm min-h-[44px]"
          >
            <Edit className="w-4 h-4" />
            <span>編集</span>
          </button>
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">企業説明:</h4>
        <p className={`text-sm leading-relaxed line-clamp-3 transition-colors duration-300 ${cardStyling.content}`}>
          {sponsor.description.length > 100 
            ? sponsor.description.substring(0, 100) + '...' 
            : sponsor.description
          }
        </p>
        {sponsor.description.length > 100 && (
          <button className="text-purple-600 text-sm mt-1 hover:text-purple-700">
            続きを読む
          </button>
        )}
      </div>
    </div>
  );
};

export default SponsorCard;