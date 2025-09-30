import React, { useState, useEffect } from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import { useSiteMetadata } from '../hooks/useSiteMetadata';
import AnimatedSection from './AnimatedSection';
import EntryWorkCard from './entryWorks/EntryWorkCard';
import EntryWorkModal from './entryWorks/EntryWorkModal';
import { useEntryWorksData } from '../hooks/useEntryWorksData';

const EntryWorksPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'creative' | 'reality'>('all');
  const [displayedWorksCount, setDisplayedWorksCount] = useState(12);
  const [showModal, setShowModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const { settings: siteSettings } = useSiteMetadata();

  const { entryWorks, loading, error, fetchPublishedEntryWorks } = useEntryWorksData();

  useEffect(() => {
    fetchPublishedEntryWorks();
  }, []);

  const filteredWorks = activeTab === 'all' ? entryWorks : entryWorks.filter(work => work.department === activeTab);
  const displayedWorks = filteredWorks.slice(0, displayedWorksCount);
  const remainingCount = filteredWorks.length - displayedWorksCount;

  const totalWorks = entryWorks.length;
  const creativeWorks = entryWorks.filter(work => work.department === 'creative').length;
  const realityWorks = entryWorks.filter(work => work.department === 'reality').length;

  const handleWorkClick = (work: any) => {
    setSelectedWork(work);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedWork(null);
  };

  const handleShowMore = () => {
    setDisplayedWorksCount(prev => Math.min(prev + 12, filteredWorks.length));
  };

  const handleShowLess = () => {
    setDisplayedWorksCount(12);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">エントリー作品を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPublishedEntryWorks}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              再読み込み
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">エントリー作品</h1>
              <p className="text-lg text-gray-600">
                REMILA BHC 2026にエントリーされた素晴らしい作品をご紹介
              </p>
            </div>
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              メインサイトに戻る
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 統計情報 */}
        <AnimatedSection animationType="fadeIn" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">総作品数</p>
                  <p className="text-3xl font-bold text-gray-900">{totalWorks}</p>
                </div>
                <Camera className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">クリエイティブ部門</p>
                  <p className="text-3xl font-bold text-blue-600">{creativeWorks}</p>
                </div>
                <Camera className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">リアリティー部門</p>
                  <p className="text-3xl font-bold text-orange-600">{realityWorks}</p>
                </div>
                <Camera className="w-12 h-12 text-orange-500" />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 部門タブ */}
        <AnimatedSection animationType="slideUp" delay={200}>
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-lg shadow-lg border border-gray-200 flex flex-wrap">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setDisplayedWorksCount(12);
                }}
                className={`px-6 py-3 font-medium transition-all duration-300 rounded-lg ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                全て ({totalWorks}作品)
              </button>
              <button
                onClick={() => {
                  setActiveTab('creative');
                  setDisplayedWorksCount(12);
                }}
                className={`px-6 py-3 font-medium transition-all duration-300 rounded-lg ${
                  activeTab === 'creative'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                クリエイティブ部門 ({creativeWorks}作品)
              </button>
              <button
                onClick={() => {
                  setActiveTab('reality');
                  setDisplayedWorksCount(12);
                }}
                className={`px-6 py-3 font-medium transition-all duration-300 rounded-lg ${
                  activeTab === 'reality'
                    ? 'bg-gradient-to-r from-orange-200 to-amber-300 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                リアリティー部門 ({realityWorks}作品)
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* 作品グリッド */}
        {entryWorks.length > 0 ? (
          <AnimatedSection animationType="slideUp" delay={400}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">エントリー作品はまだありません</h3>
            <p className="text-gray-600">エントリー作品が追加されるまでお待ちください。</p>
          </div>
        )}

        {/* もっと見るボタン */}
        {remainingCount > 0 && (
          <AnimatedSection animationType="scaleUp" className="text-center mb-8">
            <button
              onClick={handleShowMore}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              もっと見る（残り{remainingCount}作品）
            </button>
          </AnimatedSection>
        )}

        {/* 閉じるボタン */}
        {displayedWorksCount > 12 && (
          <AnimatedSection animationType="scaleUp" className="text-center mb-8">
            <button
              onClick={handleShowLess}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              閉じる
            </button>
          </AnimatedSection>
        )}

        {/* エントリー促進CTA */}
        <AnimatedSection animationType="fadeIn" delay={600}>
          <div className="bg-gradient-to-r from-[#87B9CE]/50 via-[#87B9CE] to-[#87B9CE]/50 text-white p-8 md:p-12 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
              あなたの作品もここに掲載されます
            </h3>
            <p className="text-lg md:text-xl mb-6 leading-relaxed">
              Instagram で @remila_bhc をタグ付けして投稿すると、<br className="hidden md:block" />
              あなたの作品もこちらに掲載されます！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.instagram.com/remila_bhc/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                <ExternalLink className="w-5 h-5" />
                @remila_bhcをフォローしてエントリー
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 {siteSettings?.company_name || 'REMILA Back Style Hair Contest'}. All rights reserved.
            </p>
            <div className="mt-4">
              <a
                href="/"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline"
              >
                メインサイトに戻る
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 作品詳細モーダル */}
      <EntryWorkModal
        work={selectedWork}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default EntryWorksPage;