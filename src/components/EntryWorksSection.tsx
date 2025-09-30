import React, { useState } from 'react';
import { useEffect } from 'react';
import { Camera, Users, Trophy, Clock, Instagram, ExternalLink } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import EntryWorkCard from './entryWorks/EntryWorkCard';
import EntryWorkModal from './entryWorks/EntryWorkModal';
import { useEntryWorksData } from '../hooks/useEntryWorksData';
// EntryWork型は useEntryWorksData から import

const EntryWorksSection = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'creative' | 'reality'>('all');
  const [displayedWorksCount, setDisplayedWorksCount] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any | null>(null);

  // サンプルデータ（10件）
  // Supabaseからエントリー作品データを取得
  const { entryWorks, loading, error, fetchPublishedEntryWorks } = useEntryWorksData();

  // コンポーネントマウント時に公開済みエントリー作品を取得
  useEffect(() => {
    fetchPublishedEntryWorks();
  }, []);
  // 現在のタブに応じて作品をフィルタリング
  const filteredWorks = activeTab === 'all' ? entryWorks : entryWorks.filter(work => work.department === activeTab);
  const displayedWorks = filteredWorks.slice(0, displayedWorksCount);
  const remainingCount = filteredWorks.length - displayedWorksCount;

  // 統計データを計算
  const totalWorks = entryWorks.length;
  const creativeWorks = entryWorks.filter(work => work.department === 'creative').length;
  const realityWorks = entryWorks.filter(work => work.department === 'reality').length;

  const handleWorkClick = (work: EntryWork) => {
    setSelectedWork(work);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedWork(null);
  };

  const handleShowMore = () => {
    setDisplayedWorksCount(prev => Math.min(prev + 4, filteredWorks.length));
  };

  const handleShowLess = () => {
    setDisplayedWorksCount(8);
  };

  // ローディング表示
  if (loading) {
    return (
      <section id="entry-works" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">エントリー作品を読み込み中...</p>
          </div>
        </div>
      </section>
    );
  }

  // エラー表示
  if (error) {
    return (
      <section id="entry-works" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPublishedEntryWorks}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              再読み込み
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="entry-works" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">エントリー作品</h2>
          <p className="text-lg text-gray-600 mb-0">
            REMILA BHC 2026にエントリーされた素晴らしい作品をご紹介
          </p>
        </AnimatedSection>

        {/* 統計情報 */}

        {/* 部門タブ */}
        <AnimatedSection animationType="slideUp" delay={400}>
          <div className="flex justify-center mb-3">
            <div className="bg-white p-1 shadow-lg border border-gray-200 flex flex-wrap">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setDisplayedWorksCount(8);
                }}
                className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 text-xs sm:text-base ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="hidden sm:inline">2部門全て ({totalWorks}作品)</span>
                <span className="sm:hidden">全て ({totalWorks})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('creative');
                  setDisplayedWorksCount(8);
                }}
                className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 text-xs sm:text-base ${
                  activeTab === 'creative'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="hidden sm:inline">A クリエイティブ部門 ({creativeWorks}作品)</span>
                <span className="sm:hidden">クリエイティブ ({creativeWorks})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('reality');
                  setDisplayedWorksCount(8);
                }}
                className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 text-xs sm:text-base ${
                  activeTab === 'reality'
                    ? 'bg-gradient-to-r from-orange-200 to-amber-300 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="hidden sm:inline">B リアリティー部門 ({realityWorks}作品)</span>
                <span className="sm:hidden">リアリティー ({realityWorks})</span>
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* 作品グリッド */}
        <AnimatedSection animationType="slideUp" delay={600}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-3">
            {displayedWorks.map((work, index) => (
              <EntryWorkCard
                key={work.id}
                work={work}
                index={index}
                onClick={() => handleWorkClick(work)}
              />
            ))}
          </div>
        </AnimatedSection>

        {/* エントリー作品が0件の場合 */}
        {!loading && entryWorks.length === 0 && !error && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">エントリー作品はまだありません</h3>
            <p className="text-gray-600">エントリー作品が追加されるまでお待ちください。</p>
          </div>
        )}

        {/* もっと見るボタン */}
        {remainingCount > 0 && !loading && (
          <AnimatedSection animationType="scaleUp" className="text-center mb-3">
            <button
              onClick={handleShowMore}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              もっと見る（残り{remainingCount}作品）
            </button>
          </AnimatedSection>
        )}

        {/* 閉じるボタン */}
        {displayedWorksCount > 8 && !loading && (
          <AnimatedSection animationType="scaleUp" className="text-center mb-3">
            <button
              onClick={handleShowLess}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              閉じる
            </button>
          </AnimatedSection>
        )}

        {/* エントリー促進CTA */}
        <AnimatedSection animationType="fadeIn" delay={800}>
          <div className="bg-gradient-to-r from-[#87B9CE]/50 via-[#87B9CE] to-[#87B9CE]/50 text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 drop-shadow-lg">
              あなたの作品もここに掲載されます
            </h3>
            <p className="text-lg mb-6 leading-relaxed text-shadow-strong">
              Instagram で @remila_bhc をタグ付けして投稿すると、<br />
              あなたの作品もこちらに掲載されます！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.instagram.com/remila_bhc/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                @remila_bhcをフォローしてエントリー
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* 作品詳細モーダル */}
        <EntryWorkModal
          work={selectedWork}
          isOpen={showModal}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default EntryWorksSection;