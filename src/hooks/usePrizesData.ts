import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';

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
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

export const usePrizesData = () => {
  const [mainPrizes, setMainPrizes] = useState<MainPrize[]>([]);
  const [additionalPrizes, setAdditionalPrizes] = useState<AdditionalPrize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // データを取得
  const fetchPrizes = async () => {
    try {
      setLoading(true);
      setError('');

      // メイン賞金を取得
      const { data: mainData, error: mainError } = await supabase
        .from('main_prizes')
        .select('*')
        .order('display_order', { ascending: true });

      if (mainError) {
        setError(`メイン賞金データの取得に失敗しました: ${mainError.message}`);
        return;
      }

      // 追加賞金を取得
      const { data: additionalData, error: additionalError } = await supabase
        .from('additional_prizes')
        .select('*')
        .order('display_order', { ascending: true });

      if (additionalError) {
        setError(`追加賞金データの取得に失敗しました: ${additionalError.message}`);
        return;
      }

      setMainPrizes(mainData || []);
      setAdditionalPrizes(additionalData || []);
    } catch (err) {
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 総額を自動計算する関数
  const calculateTotalAmount = () => {
    const mainTotal = mainPrizes.reduce((sum, prize) => {
      return sum + (prize.amount_value || 0);
    }, 0);
    
    const additionalTotal = additionalPrizes.reduce((sum, prize) => {
      return sum + (prize.amount || 0);
    }, 0);
    
    const total = mainTotal + additionalTotal;
    
    // 1000万円以上の場合は「○○万円超」形式で表示
    if (total >= 10000000) {
      const manEn = Math.floor(total / 10000);
      return `${manEn}万円超`;
    } else if (total >= 10000) {
      const manEn = Math.floor(total / 10000);
      return `${manEn}万円`;
    } else {
      return `${total.toLocaleString()}円`;
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchPrizes();
  }, []);

  return {
    mainPrizes,
    setMainPrizes,
    additionalPrizes,
    setAdditionalPrizes,
    loading,
    setLoading,
    error,
    setError,
    fetchPrizes,
    calculateTotalAmount
  };
};