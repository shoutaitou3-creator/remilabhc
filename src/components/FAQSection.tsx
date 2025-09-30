import React, { useState } from 'react';
import { useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { supabase } from '../lib/supabase';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  display_order: number;
}

const FAQSection = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // FAQデータを取得
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('FAQデータの取得に失敗しました:', error);
        
        // エラーが発生してもアプリケーションは継続（空のFAQリストを表示）
        setFaqs([]);
        return;
      }

      setFaqs(data || []);
    } catch (err) {
      console.warn('FAQデータの取得処理でエラーが発生しました:', err);
      
      // ネットワークエラーやその他のエラーでもアプリケーションは継続
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchFaqs();
  }, []);

  const displayedFAQs = faqs.slice(0, visibleCount);
  const remainingCount = faqs.length - visibleCount;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, faqs.length));
  };

  const handleShowLess = () => {
    setVisibleCount(5);
    setOpenItems([]); // 閉じる際は全ての項目を閉じる
  };

  return (
    <section id="faq" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">よくある質問</h2>
            <p className="text-lg text-gray-600">REMILA BHC 2026に関するよくあるご質問</p>
          </div>
        </AnimatedSection>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">よくある質問を読み込み中...</p>
          </div>
        )}

        <div className="space-y-6 mb-12">
          {displayedFAQs.map((faq, index) => (
            <AnimatedSection 
              key={faq.id}
              animationType="slideUp"
              delay={index * 100}
            >
              <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-4 line-clamp-2">
                        {faq.question}
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
                        className="text-gray-700 leading-relaxed text-sm sm:text-base"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {visibleCount < faqs.length && !loading && (
          <AnimatedSection animationType="scaleUp" className="text-center">
            <button
              onClick={handleShowMore}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              さらに見る（残り{remainingCount}件）
            </button>
          </AnimatedSection>
        )}

        {visibleCount > 5 && !loading && (
          <AnimatedSection animationType="scaleUp" className="text-center mt-4">
            <button
              onClick={handleShowLess}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              閉じる
            </button>
          </AnimatedSection>
        )}

        {faqs.length === 0 && !loading && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              よくある質問はまだ登録されていません
            </h3>
            <p className="text-gray-600">
              管理者によってFAQが追加されるまでお待ちください。
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default FAQSection;