import React from 'react';
import { X, Instagram } from 'lucide-react';

interface Judge {
  id: string;
  name: string;
  salon: string;
  instagram: string;
  image: string;
  profile: string;
}

interface JudgeDetailModalProps {
  judge: Judge | null;
  isOpen: boolean;
  onClose: () => void;
}

const JudgeDetailModal: React.FC<JudgeDetailModalProps> = ({ judge, isOpen, onClose }) => {
  if (!isOpen || !judge) return null;

  // モーダル背景クリックでも閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESCキーで閉じる
  React.useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* 審査員写真 */}
          <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-t-2xl">
            <img
              src={judge.image}
              alt={judge.name}
              className="w-full h-full object-contain bg-white"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 sm:p-8">
          {/* 基本情報 */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {judge.name}
            </h2>
            <p className="text-lg sm:text-xl text-purple-600 font-medium mb-4">
              {judge.salon}
            </p>
            
            {/* Instagramリンク */}
            <a
              href={judge.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-medium">Instagram</span>
            </a>
          </div>

          {/* プロフィール全文 */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">プロフィール</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {judge.profile}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JudgeDetailModal);