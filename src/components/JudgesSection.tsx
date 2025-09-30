import React, { useState } from 'react';
import { useEffect } from 'react';
import { ChevronDown, ChevronUp, Instagram, Award } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { supabase } from '../lib/supabase';

interface Judge {
  id: string;
  name: string;
  salon: string;
  instagram: string;
  image: string;
  profile: string;
}

const JudgesSection = () => {
  const [openProfiles, setOpenProfiles] = useState<number[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleProfile = (index: number) => {
    setOpenProfiles(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // 審査員データを取得
  const fetchJudges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('judges')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('審査員データの取得に失敗しました:', error);
        return;
      }

      setJudges(data || []);
    } catch (err) {
      console.error('審査員データの取得に失敗しました:', err);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchJudges();
  }, []);

  return (
    <section id="judges" className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">審査員</h2>
          <p className="text-lg text-gray-600">
            美容業界を牽引するトップスタイリストが厳正に審査いたします
          </p>
        </AnimatedSection>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">審査員情報を読み込み中...</p>
          </div>
        )}

        <div className="space-y-6">
          {judges.map((judge, index) => (
            <AnimatedSection 
              key={judge.id}
              animationType="scaleUp"
              delay={index * 100}
            >
              <div className="bg-white shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="p-4 sm:p-6">
                  {/* 1行目：写真と名前・店舗名 */}
                  <div className="flex items-start space-x-4 mb-4">
                    {/* 写真 */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
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
                    
                    {/* 名前、店舗名、Instagram */}
                    <div className="flex-1 flex flex-col justify-center h-32 sm:h-40">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{judge.name}</h3>
                      <p className="text-black font-medium">{judge.salon}</p>
                      <a
                        href={judge.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors mt-2"
                      >
                        <Instagram className="w-4 h-4" />
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    </div>
                  </div>
                  
                  {/* 2行目：自己紹介文（アコーディオン） */}
                  <div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {!openProfiles.includes(index) ? (
                        <>
                          {judge.profile.length > 40 
                            ? judge.profile.substring(0, 40) + '...' 
                            : judge.profile
                          }
                          {judge.profile.length > 40 && (
                            <button
                              onClick={() => toggleProfile(index)}
                              className="text-purple-600 hover:text-purple-700 font-medium ml-1 transition-colors"
                            >
                              続きを読む
                            </button>
                          )}
                        </>
                      ) : (
                        <div>
                          <div className="mb-4">
                            {judge.profile}
                          </div>
                          {/* 閉じるボタン */}
                          <div className="flex justify-end pt-3 border-t border-gray-200">
                            <button
                              onClick={() => toggleProfile(index)}
                              className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                            >
                              閉じる
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animationType="slideUp" className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#87B9CE]/50 via-[#87B9CE] to-[#87B9CE]/50 text-white p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 drop-shadow-lg">業界トップの審査員があなたの作品を評価</h3>
            <p className="text-lg leading-relaxed text-shadow-strong">
              美容業界を代表するスタイリストたちが、あなたの技術力と創造性を厳正に審査します。<br />
              この機会に、プロフェッショナルからの評価を受けてみませんか？
            </p>
            <a 
              href="#entry"
              className="block w-full sm:inline-block sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-4 sm:px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg text-center relative z-10 mt-6"
            >
              @remila_bhcをフォローしてエントリー
            </a>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
};

export default JudgesSection;