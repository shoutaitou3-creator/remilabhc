import React, { useState } from 'react';
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { supabase } from '../lib/supabase';

interface WorkExample {
  id: string;
  title: string;
  description: string;
  image: string;
  department: 'creative' | 'reality';
  is_published: boolean;
  display_order: number;
}

const WorkExamplesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [workExamples, setWorkExamples] = useState<WorkExample[]>([]);
  const [loading, setLoading] = useState(true);

  // 作品例データを取得
  const fetchWorkExamples = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('work_examples')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('作品例データの取得に失敗しました:', error);
        return;
      }

      // 公開されている作品例のみをフィルタリング
      const publishedWorkExamples = (data || []).filter(work => work.is_published);
      setWorkExamples(publishedWorkExamples);
    } catch (err) {
      console.error('作品例データの取得に失敗しました:', err);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchWorkExamples();
  }, []);

  // 部門表示名を取得
  const getDepartmentLabel = (department: string) => {
    switch (department) {
      case 'creative':
        return 'クリエイティブ部門';
      case 'reality':
        return 'リアリティー部門';
      default:
        return department;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % workExamples.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + workExamples.length) % workExamples.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 作品例がない場合の表示
  if (loading) {
    return (
      <section id="work-examples" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">作品例を読み込み中...</p>
          </div>
        </div>
      </section>
    );
  }

  if (workExamples.length === 0) {
    return (
      <section id="work-examples" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animationType="fadeIn" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">作品例</h2>
            <p className="text-lg text-gray-600">バックスタイルの美しさを表現した作品をご紹介</p>
          </AnimatedSection>
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">作品例はまだ登録されていません</h3>
            <p className="text-gray-600">管理者によって作品例が追加されるまでお待ちください。</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work-examples" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">審査員作品例</h2>
          <p className="text-lg text-gray-600">審査員によるバックスタイルの美しさを表現した作品をご紹介</p>
        </AnimatedSection>

        <AnimatedSection animationType="slideUp" delay={200}>
          <div className="relative">
            {/* メイン画像表示 */}
            <div className="relative mb-6">
              <div className="w-full aspect-[3/2] overflow-hidden shadow-2xl">
                <img
                  src={workExamples[currentSlide].image}
                  alt={workExamples[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* 作品情報（画像の下に配置） */}
            <div className="p-4 sm:p-6 mb-6">
              <div className="text-center sm:text-left">
                <span className="inline-block text-white text-sm px-3 py-1 rounded-full mb-3" style={{ backgroundColor: '#87B9CE' }}>
                  {getDepartmentLabel(workExamples[currentSlide].department)}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{workExamples[currentSlide].title}</h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {workExamples[currentSlide].description.length > 150 
                    ? workExamples[currentSlide].description.substring(0, 150) + '...'
                    : workExamples[currentSlide].description
                  }
                </p>
              </div>
            </div>

            {/* サムネイル画像 */}
            <div className="flex justify-center space-x-4 overflow-x-auto pb-4">
              {workExamples.map((work, index) => (
                <div
                  key={`${work.id}-${index}`}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 cursor-pointer transition-all duration-300 shadow-lg overflow-hidden ${
                    index === currentSlide 
                      ? 'opacity-100 scale-110 ring-2 ring-purple-600' 
                      : 'opacity-60 hover:opacity-80'
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* 左右のナビゲーションボタン */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/3 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 shadow-2xl transition-all duration-300 hover:scale-110 z-10"
              aria-label="前の作品"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/3 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 shadow-2xl transition-all duration-300 hover:scale-110 z-10"
              aria-label="次の作品"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </AnimatedSection>

        {/* 説明テキスト */}
      </div>
    </section>
  );
};

export default WorkExamplesSection;