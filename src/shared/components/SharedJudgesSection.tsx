// 共有可能な審査員セクション
import React, { useState, useEffect } from 'react';
import { Instagram, Award } from 'lucide-react';
import { SharedSectionProps } from '../types';
import SharedApiClient from '../api/SharedApiClient';
import { useSharedTheme } from '../providers/SharedThemeProvider';

interface Judge {
  id: string;
  name: string;
  salon: string;
  instagram: string;
  image: string;
  profile: string;
  display_order: number;
}

const SharedJudgesSection: React.FC<SharedSectionProps> = ({
  siteSlug,
  apiBaseUrl,
  className = '',
  showTitle = true,
  maxItems,
  enableAnimation = true
}) => {
  const [openProfiles, setOpenProfiles] = useState<number[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { theme } = useSharedTheme();

  const apiClient = new SharedApiClient(siteSlug, apiBaseUrl);

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
      setError('');

      const result = await apiClient.getJudges(maxItems);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      setJudges(result.data);
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudges();
  }, [siteSlug]);

  const sectionStyle = {
    backgroundColor: `${theme.colors.accent}50`,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    padding: theme.spacing.section
  };

  const animationClass = enableAnimation ? 'transition-all duration-300 ease-out' : '';

  return (
    <section 
      className={`py-12 md:py-20 ${className} ${animationClass}`}
      style={sectionStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              審査員
            </h2>
            <p 
              className="text-lg"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              業界を牽引するトップスタイリストが厳正に審査いたします
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: theme.colors.primary }}
            ></div>
            <p style={{ color: theme.colors.text, opacity: 0.7 }}>
              審査員情報を読み込み中...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 border rounded-lg p-4" style={{ 
            backgroundColor: `${theme.colors.accent}50`, 
            borderColor: theme.colors.accent 
          }}>
            <p style={{ color: theme.colors.text }}>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {judges.map((judge, index) => (
            <div 
              key={judge.id}
              className={`bg-white shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl ${animationClass}`}
              style={{ 
                transitionDelay: enableAnimation ? `${index * 100}ms` : '0ms'
              }}
            >
              {/* 写真 */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={judge.image}
                  alt={judge.name}
                  className={`w-full h-full object-contain bg-white hover:scale-105 ${animationClass}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              </div>
              
              {/* 基本情報 */}
              <div className="p-6">
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: theme.colors.text }}
                >
                  {judge.name}
                </h3>
                <p 
                  className="font-medium mb-4"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  {judge.salon}
                </p>
                
                {/* Instagramリンク */}
                <a
                  href={judge.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-2 mb-4 ${animationClass}`}
                  style={{ color: theme.colors.secondary }}
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                
                {/* プロフィールプレビュー */}
                <div>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    {!openProfiles.includes(index) && (
                      <>
                        {judge.profile.length > 70 ? judge.profile.substring(0, 70) + '...' : judge.profile}
                        {judge.profile.length > 70 && (
                          <button
                            onClick={() => toggleProfile(index)}
                            className={`font-medium ml-1 ${animationClass}`}
                            style={{ color: theme.colors.primary }}
                          >
                            続きを読む...
                          </button>
                        )}
                      </>
                    )}
                    {openProfiles.includes(index) && (
                      <>
                        {judge.profile}
                        <button
                          onClick={() => toggleProfile(index)}
                          className={`font-medium mt-2 block text-xs ${animationClass}`}
                          style={{ color: theme.colors.primary }}
                        >
                          閉じる
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {judges.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 
              className="text-lg font-medium mb-2"
              style={{ color: theme.colors.text }}
            >
              審査員情報はまだ登録されていません
            </h3>
            <p style={{ color: theme.colors.text, opacity: 0.7 }}>
              審査員情報が追加されるまでお待ちください。
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SharedJudgesSection;