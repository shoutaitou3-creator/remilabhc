import React from 'react';
import { Instagram, Trophy } from 'lucide-react';

interface EntryWork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instagram_url: string;
  instagram_account: string;
  department: 'creative' | 'reality';
  hashtag: string;
  period: string;
  is_nominated: boolean;
  created_at: string;
}

interface EntryWorkCardProps {
  work: EntryWork;
  index: number;
  onClick: () => void;
}

const EntryWorkCard: React.FC<EntryWorkCardProps> = ({ work, index, onClick }) => {
  const departmentLabel = work.department === 'creative' ? 'クリエイティブ' : 'リアリティー';
  const departmentColor = work.department === 'creative' ? 'bg-blue-500' : 'bg-orange-500';

  return (
    <div
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
        {/* ノミネートバッジ */}
        {work.is_nominated && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full shadow-lg">
              <Trophy className="w-3 h-3" />
              ノミネート
            </span>
          </div>
        )}

        {/* 部門バッジ */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-1 ${departmentColor} text-white text-xs font-medium rounded-full`}>
            {departmentLabel}
          </span>
        </div>

        {/* 画像 */}
        <div className="relative overflow-hidden">
          <img
            src={work.image_url}
            alt={work.title}
            className="w-full aspect-[9/16] object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* コンテンツ */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {work.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {work.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-pink-500">
              <Instagram className="w-4 h-4" />
              <a
                href={work.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium hover:text-pink-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {work.instagram_account}
              </a>
            </div>
            <span className="text-xs text-gray-500">{work.period}</span>
          </div>
          
          <div className="mt-2">
            <span className="text-xs text-blue-600 font-medium">{work.hashtag}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryWorkCard;