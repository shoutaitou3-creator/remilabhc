import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SharedSponsor {
  id: string;
  name: string;
  description: string;
  award: string;
  image: string;
  rank: string;
  url: string;
  display_order: number;
}

interface UseSharedSponsorsOptions {
  siteSlug?: string;
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useSharedSponsors = (options: UseSharedSponsorsOptions = {}) => {
  const {
    siteSlug = 'remila-bhc',
    maxItems,
    autoRefresh = true,
    refreshInterval = 30000 // 30秒
  } = options;

  const [sponsors, setSponsors] = useState<SharedSponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 協賛企業データを取得
  const fetchSponsors = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('共有協賛企業データ取得開始:', { siteSlug, maxItems });

      let query = supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });

      if (maxItems) {
        query = query.limit(maxItems);
      }

      const { data, error } = await query;

      if (error) {
        console.error('共有協賛企業データ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('共有協賛企業データ取得成功:', {
        count: data?.length || 0,
        siteSlug,
        items: data?.map(item => ({ 
          id: item.id, 
          name: item.name,
          rank: item.rank
        })) || []
      });

      setSponsors(data || []);
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      console.error('共有協賛企業データ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // リアルタイム更新の設定
  useEffect(() => {
    fetchSponsors();

    if (autoRefresh) {
      // Supabaseリアルタイム更新
      const subscription = supabase
        .channel(`shared-sponsors-${siteSlug}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'sponsors' 
          }, 
          (payload) => {
            console.log('協賛企業データが更新されました:', payload);
            fetchSponsors();
          }
        )
        .subscribe();

      // 定期更新（フォールバック）
      const interval = setInterval(() => {
        console.log('定期更新で協賛企業データを再取得');
        fetchSponsors();
      }, refreshInterval);

      return () => {
        subscription.unsubscribe();
        clearInterval(interval);
      };
    }
  }, [siteSlug, maxItems, autoRefresh, refreshInterval]);

  return {
    sponsors,
    loading,
    error,
    lastUpdated,
    refetch: fetchSponsors
  };
};