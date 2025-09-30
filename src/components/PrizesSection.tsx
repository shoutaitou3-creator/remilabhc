import React, { useState, useEffect } from 'react';
import { Crown, Medal, Award, Calendar, Users, Target, CheckCircle, ClipboardCheck, FileText } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { supabase } from '../lib/supabase';
import { getDepartmentDisplayName } from '../lib/utils';

interface MainPrize {
  id: string;
  rank: string;
  title: string;
  amount: string;
  description: string;
  icon: string;
  highlight: boolean;
  amount_value: number;
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

interface AdditionalPrize {
  id: string;
  name: string;
  description: string;
  value: string;
  amount: number;
  image?: string;
  department: 'both' | 'creative' | 'reality';
  display_order: number;
}

const PrizesSection = () => {
  const [mainPrizes, setMainPrizes] = useState<MainPrize[]>([]);
  const [additionalPrizes, setAdditionalPrizes] = useState<AdditionalPrize[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [totalAmount, setTotalAmount] = useState("計算中...");

  // データを取得
  const fetchPrizes = async () => {
    try {
      setLoading(true);

      // メイン賞金を取得
      const { data: mainData, error: mainError } = await supabase
        .from('main_prizes')
        .select('*')
        .order('display_order', { ascending: true });

      if (mainError) {
        console.error('メイン賞金データの取得に失敗しました:', mainError);
        return;
      }

      // 追加賞金を取得
      const { data: additionalData, error: additionalError } = await supabase
        .from('additional_prizes')
        .select('*')
        .order('display_order', { ascending: true });

      if (additionalError) {
        console.error('追加賞金データの取得に失敗しました:', additionalError);
        return;
      }

      setMainPrizes(mainData || []);
      setAdditionalPrizes(additionalData || []);
    } catch (err) {
      console.error('賞金データの取得に失敗しました:', err);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchPrizes();
  }, []);

  // 総額を自動計算する関数
  const calculateTotalAmount = () => {
    const mainTotal = mainPrizes.reduce((sum, prize) => {
      return sum + (prize.amount_value || 0);
    }, 0);
    
    const additionalTotal = additionalPrizes.reduce((sum, prize) => {
      return sum + (prize.amount || 0);
    }, 0);
    
    const total = mainTotal + additionalTotal;
    
    // 1円単位で表示（カンマ区切り）
    return `${total.toLocaleString()}円`;
  };
  
  // 総額を自動更新
  useEffect(() => {
    const newTotal = calculateTotalAmount();
    setTotalAmount(newTotal);
  }, [mainPrizes, additionalPrizes]);
  
  // アイコン取得関数
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'crown':
        return <Crown className="w-12 h-12 text-yellow-600" />;
      case 'medal':
        return <Medal className="w-12 h-12 text-gray-500" />;
      case 'award':
        return <Award className="w-12 h-12 text-amber-700" />;
      default:
        return <Award className="w-12 h-12 text-gray-600" />;
    }
  };

  // 総額を自動更新
  useEffect(() => {
    const newTotal = calculateTotalAmount();
    setTotalAmount(newTotal);
  }, [mainPrizes, additionalPrizes]);

  return (
    <section id="prizes" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">【賞金・賞品】</h2>
            <div className="text-6xl font-bold text-rose-600 mb-8">
              総額{totalAmount}
            </div>
          </div>
        </AnimatedSection>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">賞金情報を読み込み中...</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {mainPrizes.map((prize, index) => (
            <AnimatedSection 
              key={index}
              animationType="scaleUp"
              delay={index * 200}
            >
              <div 
                className={`text-center p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  prize.highlight 
                    ? 'bg-gradient-to-br from-yellow-100 to-amber-100 shadow-2xl hover:shadow-3xl min-h-[320px]' 
                    : 'bg-white shadow-xl hover:shadow-2xl min-h-[320px]'
                }`}
              >
                <div className="flex justify-center mb-8">
                  {getIcon(prize.icon)}
                </div>
                <h3 className={`text-3xl font-bold mb-6 ${prize.highlight ? 'text-yellow-700' : 'text-gray-900'}`}>
                  {prize.title}
                </h3>
                <div className={`text-5xl font-bold mb-6 ${prize.highlight ? 'text-yellow-600' : 'text-gray-800'}`}>
                  {prize.amount}
                </div>
                <p className="text-gray-600 text-base leading-relaxed">
                  {prize.description}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-blue-600">
                    {getDepartmentDisplayName(prize.department)}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        <AnimatedSection animationType="slideUp" delay={600}>
          <div className="bg-gradient-to-r from-purple-50 to-rose-50 p-12 text-center mb-20">
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {additionalPrizes.map((prize, index) => (
                <div key={prize.id} className="bg-white p-6 shadow-lg">
                  {prize.image && (
                    <img
                      src={prize.image}
                      alt={prize.name}
                      className="w-full h-32 object-contain bg-white mb-4"
                    />
                  )}
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{prize.name}</h4>
                  <p className="text-sm font-medium text-purple-600 mb-2">内容: {prize.value}</p>
                  <p className="text-sm text-gray-600">{prize.description}</p>
                  <p className="text-sm font-medium text-blue-600 mt-2">
                    {getDepartmentDisplayName(prize.department)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xl text-gray-700 font-medium mt-8">
              その他随時、賞金・賞品を追加予定
            </p>
          </div>
        </AnimatedSection>
        
      </div>
    </section>
  );
};

export default PrizesSection;