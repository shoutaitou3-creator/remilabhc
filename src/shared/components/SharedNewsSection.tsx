import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, ExternalLink, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AnimatedSection from '../../components/AnimatedSection';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  category_id: string | null;
  link_url: string;
  link_text: string;
  publish_date: string;
  display_order: number;
  updated_at: string;
  news_category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
    is_active: boolean;
  };
}

interface SharedNewsSectionProps {
  siteSlug?: string;
  maxItems?: number;
  showTitle?: boolean;
  enableAnimation?: boolean;
  className?: string;
  customTheme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
    typography?: {
      fontFamily?: string;
    };
  };
}

const SharedNewsSection: React.FC<SharedNewsSectionProps> = ({
  siteSlug = 'remila-bhc',
  maxItems = 3,
  showTitle = true,
  enableAnimation = true,
  className = '',
  customTheme
}) => {
  const [visibleCount, setVisibleCount] = useState(maxItems);
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // お知らせデータを取得
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('news')
        .select(`
          id,
          title,
          content,
          category,
          category_id,
          link_url,
          link_text,
          publish_date,
          display_order,
          updated_at,
          news_category:news_categories!category_id(
            id,
            name,
            slug,
            color,
            is_active
          )
        `)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('共有お知らせデータ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('共有お知らせデータ取得成功:', {
        count: data?.length || 0,
        siteSlug
      });

      setNewsItems(data || []);
    } catch (err) {
      console.error('共有お知らせデータ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // リアルタイム更新の設定
    const subscription = supabase
      .channel('shared-news-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'news' 
        }, 
        () => {
          console.log('お知らせデータが更新されました。再取得します。');
          fetchNews();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [siteSlug]);

  // カテゴリ表示の取得
  const getCategoryDisplay = (item: NewsItem) => {
    if (item.news_category?.name) {
      return {
        name: item.news_category.name,
        color: item.news_category.color
      };
    }
    
    const fallbackColors = {
      'news': '#3b82f6',
      'press': '#8b5cf6', 
      'update': '#10b981',
      'event': '#f59e0b'
    };
    
    const fallbackLabels = {
      'news': '新着情報',
      'press': 'プレスリリース',
      'update': '更新情報', 
      'event': 'イベント'
    };
    
    return {
      name: fallbackLabels[item.category as keyof typeof fallbackLabels] || 'お知らせ',
      color: fallbackColors[item.category as keyof typeof fallbackColors] || customTheme?.colors?.primary || '#8b5cf6'
    };
  };

  const displayedNews = newsItems.slice(0, visibleCount);
  const remainingCount = newsItems.length - visibleCount;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, newsItems.length));
  };

  const handleShowLess = () => {
    setVisibleCount(maxItems);
    setOpenItems([]);
  };

  // テーマスタイルの適用
  const themeStyles = {
    backgroundColor: customTheme?.colors?.background || '#ffffff',
    color: customTheme?.colors?.text || '#1f2937',
    fontFamily: customTheme?.typography?.fontFamily || 'Noto Sans JP, sans-serif'
  };

  const animationClass = enableAnimation ? 'transition-all duration-300 ease-out' : '';
  const primaryColor = customTheme?.colors?.primary || '#8b5cf6';
  const secondaryColor = customTheme?.colors?.secondary || '#ec4899';

  return (
    <section 
      className={`py-12 md:py-20 bg-gradient-to-br from-slate-50 to-gray-100 ${className}`}
      style={themeStyles}
    >
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <AnimatedSection animationType="fadeIn" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">NEWS</h2>
            <p className="text-lg text-gray-600">最新情報</p>
          </AnimatedSection>
        )}

        {/* ローディング表示 */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              お知らせを読み込み中...
            </p>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6 mb-12">
          {displayedNews.map((item, index) => (
            <AnimatedSection 
              key={item.id}
              animationType="slideUp"
              delay={enableAnimation ? index * 100 : 0}
            >
              <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                >
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-1 min-w-0">
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span 
                          className="text-xs px-2 py-1 rounded font-medium text-white"
                          style={{ backgroundColor: getCategoryDisplay(item).color }}
                        >
                          {getCategoryDisplay(item).name}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(item.publish_date).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 min-w-0 line-clamp-2 sm:line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {openItems.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                    <div className="pt-4">
                      <div 
                        className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      {item.link_url && item.link_text && (
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                          <a
                            href={item.link_url}
                            target={item.link_url.startsWith('http') ? '_blank' : '_self'}
                            rel={item.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors"
                          >
                            {item.link_text}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {visibleCount < newsItems.length && (
          <AnimatedSection animationType="scaleUp" className="text-center">
            <button
              onClick={handleShowMore}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              もっと見る（残り{remainingCount}件）
            </button>
          </AnimatedSection>
        )}

        {visibleCount > maxItems && (
          <AnimatedSection animationType="scaleUp" className="text-center mt-4">
            <button
              onClick={handleShowLess}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              閉じる
            </button>
          </AnimatedSection>
        )}

        {/* お知らせが0件の場合 */}
        {!loading && newsItems.length === 0 && !error && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              お知らせはまだありません
            </h3>
            <p className="text-gray-600">
              新しいお知らせが追加されるまでお待ちください。
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SharedNewsSection;