import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, ExternalLink, FileText } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useNewsData, NewsItem } from '../hooks/useNewsData';
import { useNewsCategoriesData } from '../hooks/useNewsCategoriesData';

const NewsSection = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [openItems, setOpenItems] = useState<number[]>([]);
  const { newsItems, loading, error, fetchPublishedNews } = useNewsData();
  const { categories, loading: categoriesLoading, fetchActiveCategories } = useNewsCategoriesData();

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // コンポーネントマウント時に公開済みお知らせを取得
  useEffect(() => {
    fetchPublishedNews();
    fetchActiveCategories();
  }, []);

  // カテゴリ表示の取得
  const getCategoryDisplay = (item: NewsItem) => {
    console.log('getCategoryDisplay called with:', {
      itemId: item.id,
      categoryId: item.category_id,
      newsCategory: item.news_category,
      oldCategory: item.category,
      availableCategories: categories.length
    });

    // 新しいカテゴリシステム（news_categoriesテーブル）
    if (item.news_category?.name) {
      console.log('Using news_category relation:', item.news_category);
      return {
        name: item.news_category.name,
        color: item.news_category.color
      };
    }
    
    // category_idがあるが、news_categoryが取得できていない場合
    if (item.category_id) {
      const category = categories.find(cat => cat.id === item.category_id);
      if (category) {
        console.log('Found category by ID:', category);
        return {
          name: category.name,
          color: category.color
        };
      }
      console.log('Category not found for ID:', item.category_id, 'Available categories:', categories.map(c => ({ id: c.id, name: c.name })));
    }
    
    // フォールバック: 旧形式のカテゴリ（後方互換性）
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
    
    console.log('Using fallback category:', {
      category: item.category,
      fallbackName: fallbackLabels[item.category as keyof typeof fallbackLabels] || 'お知らせ',
      fallbackColor: fallbackColors[item.category as keyof typeof fallbackColors] || '#6b7280'
    });
    
    return {
      name: fallbackLabels[item.category as keyof typeof fallbackLabels] || 'お知らせ',
      color: fallbackColors[item.category as keyof typeof fallbackColors] || '#6b7280'
    };
  };

  const displayedNews = newsItems.slice(0, visibleCount);
  const remainingCount = newsItems.length - visibleCount;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, newsItems.length));
  };

  const handleShowLess = () => {
    setVisibleCount(3);
    setOpenItems([]); // 閉じる際は全ての項目を閉じる
  };

  // カテゴリデータが読み込まれるまで待機
  if (categoriesLoading) {
    return (
      <section id="news" className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">カテゴリ情報を読み込み中...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">NEWS</h2>
          <p className="text-lg text-gray-600">REMILA BHC 2026に関する最新情報</p>
        </AnimatedSection>

        {/* ローディング表示 */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">お知らせを読み込み中...</p>
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
              delay={index * 100}
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
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative z-10"
            >
              もっと見る（残り{remainingCount}件）
            </button>
          </AnimatedSection>
        )}

        {visibleCount > 3 && (
          <AnimatedSection animationType="scaleUp" className="text-center mt-4">
            <button
              onClick={handleShowLess}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative z-10"
            >
              閉じる
            </button>
          </AnimatedSection>
        )}

        {/* お知らせが0件の場合 */}
        {!loading && newsItems.length === 0 && !error && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">お知らせはまだありません</h3>
            <p className="text-gray-600">新しいお知らせが追加されるまでお待ちください。</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default NewsSection;