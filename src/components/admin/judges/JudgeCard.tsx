import React from 'react';
import { Edit, Instagram, ChevronUp, ChevronDown } from 'lucide-react';

interface Judge {
  id: string;
  name: string;
  salon: string;
  instagram: string;
  image: string;
  profile: string;
  display_order: number;
}

interface JudgeCardProps {
  judge: Judge;
  index: number;
  totalJudges: number;
  onEdit: (judge: Judge) => void;
  onMoveUp: (judgeId: string) => void;
  onMoveDown: (judgeId: string) => void;
}

const JudgeCard: React.FC<JudgeCardProps> = ({
  judge,
  index,
  totalJudges,
  onEdit,
  onMoveUp,
  onMoveDown
}) => {
  // 審査員カードは常に公開状態として扱う（審査員に公開/非公開の概念はないため）
  const cardStyling = {
    container: 'bg-white border-gray-200 hover:shadow-lg',
    title: 'text-gray-900',
    content: 'text-gray-600',
    meta: 'text-gray-500'
  };

  return (
    <div className={`p-6 transition-all duration-300 ${cardStyling.container}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          {/* 順序変更ボタン */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => onMoveUp(judge.id)}
              disabled={index === 0}
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="上に移動"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onMoveDown(judge.id)}
              disabled={index === totalJudges - 1}
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="下に移動"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <img
            src={judge.image}
            alt={judge.name}
            className="w-20 h-20 object-contain rounded-lg border border-gray-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                #{judge.display_order || index + 1}
              </span>
            </div>
            <h3 className={`text-xl font-bold transition-colors duration-300 ${cardStyling.title}`}>
              {judge.name}
            </h3>
            <p className="text-purple-600 font-medium transition-colors duration-300">{judge.salon}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              <a
                href={judge.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors text-sm"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500 text-right mr-2">
            <div>順序変更</div>
            <div>↑↓ボタン</div>
          </div>
          <button
            onClick={() => onEdit(judge)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            <Edit className="w-4 h-4" />
            <span>編集</span>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">プロフィール:</h4>
        <p className={`text-sm leading-relaxed transition-colors duration-300 ${cardStyling.content}`}>
          {judge.profile.length > 150 
            ? judge.profile.substring(0, 150) + '...' 
            : judge.profile
          }
        </p>
        {judge.profile.length > 150 && (
          <button className="text-purple-600 text-sm mt-1 hover:text-purple-700">
            続きを読む
          </button>
        )}
      </div>
    </div>
  );
};

export default JudgeCard;