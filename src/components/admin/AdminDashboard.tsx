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

  const sampleWorks = [
    {
      id: '7',
      title: 'ダメージケアスタイル',
      description: 'ダメージを受けた髪を美しく見せるバックスタイル。',
      imageUrl: 'https://images.pexels.com/photos/3992885/pexels-photo-3992885.jpeg?auto=compress&cs=tinysrgb&w=600',
      instagramUrl: 'https://www.instagram.com/p/sample7/',
      instagramAccount: '@damage_care_salon',
      department: 'reality',
      hashtag: '#レミラバックスタイルR',
      submittedAt: '第1期',
      isNominated: false
    },
    {
      id: '8',
      title: 'レイヤードスタイル',
      description: '多層的なレイヤーで動きのあるバックスタイル。',
      imageUrl: 'https://images.pexels.com/photos/3992886/pexels-photo-3992886.jpeg?auto=compress&cs=tinysrgb&w=600',
      instagramUrl: 'https://www.instagram.com/p/sample8/',
      instagramAccount: '@layer_master',
      department: 'creative',
      hashtag: '#レミラバックスタイルC',
      submittedAt: '第1期',
      isNominated: false
    },
    {
      id: '9',
      title: 'エイジングケアスタイル',
      description: '年齢による髪の変化に対応した美しいスタイル。',
      imageUrl: 'https://images.pexels.com/photos/3992887/pexels-photo-3992887.jpeg?auto=compress&cs=tinysrgb&w=600',
      instagramUrl: 'https://www.instagram.com/p/sample9/',
      instagramAccount: '@aging_care_expert',
      department: 'reality',
      hashtag: '#レミラバックスタイルR',
      submittedAt: '第1期',
      isNominated: false
    },
    {
      id: '10',
      title: 'アバンギャルドスタイル',
      description: '前衛的なデザインで表現する革新的なバックスタイル。',
      imageUrl: 'https://images.pexels.com/photos/3992888/pexels-photo-3992888.jpeg?auto=compress&cs=tinysrgb&w=600',
      instagramUrl: 'https://www.instagram.com/p/sample10/',
      instagramAccount: '@avant_garde_hair',
      department: 'creative',
      hashtag: '#レミラバックスタイルC',
      submittedAt: '第1期',
      isNominated: false
    }
  ];

  // 現在のタブに応じて作品をフィルタリング
  const filteredWorks = activeTab === 'all' ? sampleWorks : sampleWorks.filter(work => work.department === activeTab);
  const displayedWorks = filteredWorks.slice(0, displayedWorksCount);
  const remainingCount = filteredWorks.length - displayedWorksCount;

  // 統計データを計算
  const totalWorks = sampleWorks.length;
  const creativeWorks = sampleWorks.filter(work => work.department === 'creative').length;
  const realityWorks = sampleWorks.filter(work => work.department === 'reality').length;

  const handleWorkClick = (work: any) => {
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

        {/* もっと見るボタン */}
        {remainingCount > 0 && (
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
        {displayedWorksCount > 8 && (
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