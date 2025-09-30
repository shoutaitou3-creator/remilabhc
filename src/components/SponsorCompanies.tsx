import React from 'react';
import { useState, useEffect } from 'react';
import { Building, Crown, Gem, Award, Medal, Zap, Shield } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';

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

const SponsorCompanies = () => {
  const [openDescriptions, setOpenDescriptions] = useState<number[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  const toggleDescription = (index: number) => {
    setOpenDescriptions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // 協賛企業データを取得
  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('協賛企業データの取得に失敗しました:', error);
        return;
      }

      setSponsors(data || []);
    } catch (err) {
      console.error('協賛企業データの取得に失敗しました:', err);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchSponsors();
  }, []);

  // ランク順に並び替える関数
  const getRankOrder = (rank: string) => {
    const rankOrder = {
      'スペシャル': 1,
      'ダイヤモンド': 2,
      'ゴールド': 3,
      'シルバー': 4,
      'ブロンズ': 5,
      'チタン': 6
    };
    return rankOrder[rank as keyof typeof rankOrder] || 999;
  };

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
        return <Crown className="w-4 h-4 mr-1" />;
      case 'ダイヤモンド':
        return <Gem className="w-4 h-4 mr-1" />;
      case 'ゴールド':
        return <Award className="w-4 h-4 mr-1" />;
      case 'シルバー':
        return <Medal className="w-4 h-4 mr-1" />;
      case 'ブロンズ':
        return <Shield className="w-4 h-4 mr-1" />;
      case 'チタン':
        return <Zap className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  // ランクに応じたカードサイズクラスを取得する関数
  const getCardSizeClasses = (rank: string) => {
    switch (rank) {
      case 'スペシャル':
        return {
          cardPadding: 'p-10',
          titleSize: 'text-3xl',
          descriptionSize: 'text-base',
          awardSize: 'text-lg',
          imageHeight: 'h-64',
          rankBadgeSize: 'text-base px-4 py-2'
        };
      case 'ダイヤモンド':
        return {
          cardPadding: 'p-8',
          titleSize: 'text-2xl',
          descriptionSize: 'text-base',
          awardSize: 'text-lg',
          imageHeight: 'h-56',
          rankBadgeSize: 'text-base px-3 py-1.5'
        };
      case 'ゴールド':
        return {
          cardPadding: 'p-6',
          titleSize: 'text-xl',
          descriptionSize: 'text-sm',
          awardSize: 'text-base',
          imageHeight: 'h-48',
          rankBadgeSize: 'text-sm px-3 py-1'
        };
      case 'シルバー':
        return {
          cardPadding: 'p-5',
          titleSize: 'text-lg',
          descriptionSize: 'text-sm',
          awardSize: 'text-base',
          imageHeight: 'h-40',
          rankBadgeSize: 'text-sm px-2.5 py-0.5'
        };
      case 'ブロンズ':
        return {
          cardPadding: 'p-4',
          titleSize: 'text-base',
          descriptionSize: 'text-xs',
          awardSize: 'text-sm',
          imageHeight: 'h-32',
          rankBadgeSize: 'text-xs px-2 py-0.5'
        };
      case 'チタン':
        return {
          cardPadding: 'p-3',
          titleSize: 'text-sm',
          descriptionSize: 'text-xs',
          awardSize: 'text-xs',
          imageHeight: 'h-24',
          rankBadgeSize: 'text-xs px-1.5 py-0.5'
        };
      default:
        return {
          cardPadding: 'p-6',
          titleSize: 'text-xl',
          descriptionSize: 'text-sm',
          awardSize: 'text-base',
          imageHeight: 'h-48',
          rankBadgeSize: 'text-sm px-3 py-1'
        };
    }
  };

  return (
    <section id="sponsors" className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">協賛・協力企業様のご紹介</h2>
          <p className="text-lg text-gray-600">REMILA BHC 2026を支援いただいている企業様からの豪華賞品</p>
        </AnimatedSection>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">協賛企業情報を読み込み中...</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => {
            const sizeClasses = getCardSizeClasses(sponsor.rank);
            return (
              <AnimatedSection
                key={`${sponsor.id}-${index}`}
                animationType="scaleUp"
                delay={index * 200}
              >
                <div className={`bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 ${sizeClasses.cardPadding}`}>
                  <div className="mb-6">
                    <img 
                      src={sponsor.image}
                      alt={sponsor.name}
                      className={`w-full object-contain bg-white ${sizeClasses.imageHeight}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                  </div>
                  
                  <h3 className={`font-bold text-black mb-4 border-b border-gray-200 pb-2 ${sizeClasses.titleSize}`}>
                    {sponsor.name}
                  </h3>
                  
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center font-bold rounded-full ${getRankColor(sponsor.rank)} ${sizeClasses.rankBadgeSize}`}>
                      {getRankIcon(sponsor.rank)}
                      {sponsor.rank}
                    </span>
                    <a 
                      href={sponsor.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-purple-800 font-semibold ${sizeClasses.awardSize}`}
                    >
                      サイトリンク
                    </a>
                  </div>
                  
                  <div className="mb-6">
                    <p className={`text-gray-700 leading-relaxed mb-3 ${sizeClasses.descriptionSize}`}>
                      {!openDescriptions.includes(index) && (
                        <>
                          {sponsor.description.length > 100 ? sponsor.description.substring(0, 100) + '...' : sponsor.description}
                          {sponsor.description.length > 100 && (
                            <button
                              onClick={() => toggleDescription(index)}
                              className="text-purple-600 hover:text-purple-700 font-medium ml-1 transition-colors"
                            >
                              続きを読む
                            </button>
                          )}
                        </>
                      )}
                      {openDescriptions.includes(index) && (
                        <>
                          {sponsor.description}
                          <button
                            onClick={() => toggleDescription(index)}
                            className="text-purple-600 hover:text-purple-700 font-medium mt-2 block transition-colors text-sm"
                          >
                            閉じる
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-100 to-rose-100 p-4">
                    <p className="text-purple-800 font-semibold">
                      {sponsor.award}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SponsorCompanies;