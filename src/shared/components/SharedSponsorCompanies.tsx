import React, { useState, useEffect, useRef } from 'react';
import { Building, Crown, Gem, Award, Medal, Zap, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

interface SharedSponsorCompaniesProps {
  siteSlug: string;
  maxItems?: number;
}

const SharedSponsorCompanies: React.FC<SharedSponsorCompaniesProps> = ({
  siteSlug = 'remila-bhc',
  maxItems
}) => {
  const [openDescriptions, setOpenDescriptions] = useState<number[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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
      setError('');

      let query = supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });

      if (maxItems) {
        query = query.limit(maxItems);
      }

      const { data, error } = await query;

      if (error) {
        console.error('共有協賛企業データ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('共有協賛企業データ取得成功:', {
        count: data?.length || 0,
        siteSlug
      });

      setSponsors(data || []);
    } catch (err) {
      console.error('共有協賛企業データ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();

    // リアルタイム更新の設定
    const subscription = supabase
      .channel('shared-sponsors-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'sponsors' 
        }, 
        () => {
          console.log('協賛企業データが更新されました。再取得します。');
          fetchSponsors();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [siteSlug, maxItems]);

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

  // 自己完結型アニメーションフック
  const useScrollAnimation = (delay: number = 0) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            observer.unobserve(element);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }, [delay]);

    return { elementRef, isVisible };
  };

  const AnimatedSection: React.FC<{ animationType: string; className: string; children: React.ReactNode }> = ({ animationType, className, children }) => {
    return <div className={className}>{children}</div>;
  };

  return (
    <section 
      className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-rose-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">協賛・協力企業様のご紹介</h2>
          <p className="text-lg text-gray-600">REMILA BHC 2026を支援いただいている企業様からの豪華賞品</p>
        </AnimatedSection>
        
        {loading && (
          <div className="text-center py-8">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"
            ></div>
            <p className="text-gray-600">協賛企業情報を読み込み中...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => {
            const sizeClasses = getCardSizeClasses(sponsor.rank);
            const { elementRef, isVisible } = useScrollAnimation(index * 200);
            
            const animationClasses = isVisible
              ? 'opacity-100 transform translate-x-0 translate-y-0 scale-100'
              : 'opacity-0 transform scale-95';

            return (
              <div
                ref={elementRef}
                key={`${sponsor.id}-${index}`}
                className={`bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl transition-all duration-[560ms] ease-out border border-gray-100 ${sizeClasses.cardPadding} ${animationClasses}`}
              >
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
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
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
                
                <div 
                  className="bg-gradient-to-r from-purple-100 to-rose-100 p-4"
                >
                  <p className={`text-purple-800 font-semibold ${sizeClasses.awardSize}`}>
                    {sponsor.award}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 協賛企業が0件の場合 */}
        {!loading && sponsors.length === 0 && !error && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              協賛企業情報はまだありません
            </h3>
            <p className="text-gray-600">
              協賛企業情報が追加されるまでお待ちください。
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SharedSponsorCompanies;