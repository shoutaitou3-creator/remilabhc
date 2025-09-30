import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Trophy, Star, Award, Calendar, Users, Target, CheckCircle, ClipboardCheck, FileText, Instagram, Camera, Sparkles } from 'lucide-react';
import AccordionItem from './AccordionItem';
import AnimatedSection from './AnimatedSection';

const ContestDetails = () => {
  const [totalAmount, setTotalAmount] = useState("計算中...");
  const { settings } = useSiteSettings();

  // 賞金の合計を計算する関数
  const calculateTotalAmount = async () => {
    try {
      // メイン賞金を取得
      const { data: mainData, error: mainError } = await supabase
        .from('main_prizes')
        .select('amount_value');

      if (mainError) {
        console.error('メイン賞金データの取得に失敗:', mainError);
        return '取得エラー';
      }

      // 追加賞金を取得
      const { data: additionalData, error: additionalError } = await supabase
        .from('additional_prizes')
        .select('amount');

      if (additionalError) {
        console.error('追加賞金データの取得に失敗:', additionalError);
        return '取得エラー';
      }

      const mainTotal = (mainData || []).reduce((sum, prize) => {
        return sum + (prize.amount_value || 0);
      }, 0);
      
      const additionalTotal = (additionalData || []).reduce((sum, prize) => {
        return sum + (prize.amount || 0);
      }, 0);
      
      const total = mainTotal + additionalTotal;
      
      // 1円単位で表示（カンマ区切り）
      return `${total.toLocaleString()}円`;
    } catch (error) {
      console.error('賞金計算エラー:', error);
      return '計算エラー';
    }
  };

  // 総額を自動更新
  useEffect(() => {
    const fetchTotalAmount = async () => {
      const amount = await calculateTotalAmount();
      setTotalAmount(amount);
    };
    fetchTotalAmount();
  }, []);

  const contestFeatures = [
    {
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      title: "総額1000万円超の賞金・賞品",
      summary: "業界最高水準の賞金で、あなたの技術を正当に評価",
      details: [
        "年間グランプリ：各部門300万円（計600万円）",
        "第2位：各部門30万円（計60万円）",
        "第3位：各部門10万円（計20万円）",
        "その他、審査員賞、協賛企業賞、副賞（レミラ1年間無料 約73万円相当！）なども多数"
      ]
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "2つの部門制",
      summary: "クリエイティブ部門とリアリティー部門で異なる審査基準",
      details: [
        "【A クリエイティブ部門】創造力とデザイン性を競う、自由な発想のバックスタイル作品。カット・カラー・パーマ・セット・アレンジ・ウィッグ・ヘアアクセサリー等を含む、バックスタイルの美しさを最大限に表現したクリエイティブな作品を募集します。",
        "【B リアリティー部門（レミラ導入店限定！）】お客様の悩みを解決する、施術前（ビフォー）から施術後（アフター）の変化したバックスタイルとその背景ストーリーのキャプションを募集します。実際のお客様の「悩み・要望」に寄り添った技術力とストーリー性を表現してください。"
      ]
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      title: "開催スケジュール",
      summary: "3期に分けて開催、2026年5月に年間グランプリ発表",
      details: [
        "【第一期】2025年8月1日(金) ～ 9月30日(火) / 結果発表 2025年10月",
        "【第二期】2025年11月1日(土) ～ 12月31日(水) / 結果発表 2026年1月", 
        "【第三期】2026年2月1日(月) ～ 3月31日(火) / 結果発表 2026年4月",
        "【年間グランプリ発表】2026年5月予定 - 各期の優秀作品から年間グランプリを決定"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "審査方法・審査員",
      summary: "業界トップスタイリストによる厳正審査",
      details: [
        "【審査方法】審査員による審査（投稿のいいね数も参考にします）",
        "【審査員】川畑タケル(BEAUTRIUM)、照屋寛倖(in Chelsea)、suzuna(JURK)、堀江昌樹(Hank.)、米澤香央里(Hank.)、高木達也(ROSE)、内田聡一郎(LECO)",
        "美容業界を牽引するトップスタイリストが厳正に審査いたします。"
      ]
    },
    {
      icon: <Instagram className="w-8 h-8 text-rose-600" />,
      title: "応募方法",
      summary: "Instagramでの簡単応募、指定ハッシュタグで参加",
      details: [
        "【STEP1】Instagramで@remila_bhcをフォロー",
        "【STEP2】@remila_bhcをタグ付け＋ハッシュタグをつけて投稿",
        "A クリエイティブ部門：@remila_bhcをタグ付け＋#レミラバックスタイルC のハッシュタグをつけて、バックスタイル作品（1枚）を投稿",
        "B リアリティー部門：@remila_bhcをタグ付け＋#レミラバックスタイルR のハッシュタグをつけて、ビフォー（1枚）&アフター（2枚）を投稿"
      ]
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-orange-600" />,
      title: "応募資格",
      summary: "美容師・理容師資格保有者、その他制限なし",
      details: [
        "美容師資格・理容師資格を保有する方",
        "その他、一切不問。"
      ]
    }
  ];

  return (
    <section id="contest-details" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* コンテスト詳細 */}
        <AnimatedSection animationType="fadeIn" className="text-center mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              コンテスト詳細
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
            </p>
            <p className="text-xl mb-8 leading-relaxed">
              あなたの技術力を証明し、業界での地位を確立する絶好のチャンス。<br />
              詳細な応募要項をご確認ください。
            </p>
          </div>
        </AnimatedSection>
        
        {/* アコーディオンセクション */}
        <AnimatedSection animationType="slideUp" className="space-y-4 mb-16">
          <div className="space-y-4 mb-16">
            {contestFeatures.map((item, index) => (
              <AnimatedSection key={index} animationType="slideLeft" delay={index * 100}>
                <AccordionItem
                  title={item.title}
                  icon={item.icon}
                  summary={item.summary}
                  details={item.details}
                />
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* 応募規定 */}
        <AnimatedSection animationType="scaleUp">
          <div className="bg-white p-12 shadow-2xl border border-gray-100 mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">応募規定</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection animationType="slideRight" delay={200}>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-800 font-medium">モデル・お客様の顔出し禁止</span>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="slideLeft" delay={300}>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-800 font-medium">生成AIの使用は禁止</span>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="slideRight" delay={400}>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-800 font-medium">リアリティー部門：レタッチ（画像加工）禁止</span>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="slideLeft" delay={500}>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-800 font-medium">両部門への応募も可能</span>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animationType="fadeIn">
          <div className="bg-white p-12 shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                REMILA BHC 2026の規模
              </h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <AnimatedSection animationType="scaleUp" delay={200}>
                <div className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">839万円＋</div>
                  <div className="text-gray-600">業界最高レベルの総賞金・賞品額</div>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="scaleUp" delay={400}>
                <div className="p-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">全国</div>
                  <div className="text-gray-600">全ての美容師・理容師が対象</div>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="scaleUp" delay={600}>
                <div className="p-6">
                  <div className="text-4xl font-bold text-rose-600 mb-2">業界初</div>
                  <div className="text-gray-600">バックスタイル特化</div>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="scaleUp" delay={800}>
                <div className="p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">3期制</div>
                  <div className="text-gray-600">複数回のチャンス</div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animationType="slideUp" className="mt-16 text-center">
          <div className="mt-16 text-center">
            <div className="text-white p-8 max-w-4xl mx-auto bg-gradient-to-r from-[#87B9CE]/50 via-[#87B9CE] to-[#87B9CE]/50">
              <h3 className="text-3xl font-bold mb-6 drop-shadow-lg">今すぐエントリーして歴史を作ろう</h3>
              <p className="text-xl mb-8 leading-relaxed text-shadow-strong">
                業界初のバックスタイルヘアコンテストの記念すべき第1回に参加し、<br />
                あなたの技術で新しい美の価値観を創造しませんか？
              </p>
              <a 
                href="#entry"
                className="block w-full sm:inline-block sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-4 sm:px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg text-center"
              >
                @remila_bhcをフォローしてエントリー
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
   );
 };
 
export default ContestDetails;