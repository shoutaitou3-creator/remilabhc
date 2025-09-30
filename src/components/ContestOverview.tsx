import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Star, Award, Calendar, Users, Target, CheckCircle, ClipboardCheck, FileText, Instagram, Camera, Sparkles } from 'lucide-react';
import AccordionItem from './AccordionItem';
import AnimatedSection from './AnimatedSection';

const ContestOverview = () => {
  const [totalAmount, setTotalAmount] = useState("計算中...");

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
    <section id="contest-overview" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* バナー写真セクション */}
        <AnimatedSection animationType="fadeIn" className="mb-20">
          <div className="mb-20">
            <div className="w-full">
              <img
                src="/banner1.jpg" 
                alt="REMILA バックスタイルヘアコンテスト バナー" 
                className="w-full h-auto object-contain shadow-lg"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* バックヘアコンテストとは */}
        <AnimatedSection animationType="slideUp" className="text-center mb-16">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-sm font-medium mb-6 rounded-full">
              業界初の革新的コンテスト
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              レミラ バックスタイルヘアコンテストとは
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                「レミラ バックスタイルヘアコンテスト」は、美容師・理容師の皆様を対象に、日本全国で"後ろ姿の美しさ"を競い合う革新的なコンテストです。
              </p>
              <p>
                従来の正面デザインだけでなく、「後ろ姿から伝わる美意識」にフォーカスし、あなたの技術力と創造性を最大限に発揮できる新しいステージを提供します。
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* 開催目的セクション */}
        <AnimatedSection animationType="slideUp" delay={1200}>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-12 mb-8 shadow-2xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">開催目的</h3>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              「バックスタイルを美しく」をテーマに、世界初のバックスタイルのコンテストを実施。美容師へのバックスタイルの意識向上と、美容業界の発展を促す。
            </p>
          </div>
        </AnimatedSection>

        {/* コンテストの特徴 */}
        <AnimatedSection animationType="scaleUp" delay={200}>
          <div className="bg-white p-12 shadow-2xl border border-gray-100 mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">なぜ今、バックスタイルなのか？</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <AnimatedSection animationType="slideUp" delay={400}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">SNS時代の新しい美意識</h4>
                  <p className="text-gray-600">自撮り文化の中で見落とされがちな「後ろ姿美」に注目</p>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="slideUp" delay={600}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">技術力の真の証明</h4>
                  <p className="text-gray-600">見えない部分にこそ宿る、プロの技術と美意識</p>
                </div>
              </AnimatedSection>
              <AnimatedSection animationType="slideUp" delay={800}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">業界初の挑戦</h4>
                  <p className="text-gray-600">新しい価値観を創造する歴史的瞬間に参加</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* コンテスト詳細 */}
      </div>
    </section>
  );
};

export default ContestOverview;