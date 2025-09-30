import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SharedNewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  category_id: string | null;
  link_url: string;
  link_text: string;
  publish_date: string;
  display_order: number;
  updated_at: string;
  news_category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
    is_active: boolean;
  };
}

interface UseSharedNewsOptions {
  siteSlug?: string;
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useSharedNews = (options: UseSharedNewsOptions = {}) => {
  const {
    siteSlug = 'remila-bhc',
    maxItems,
    autoRefresh = true,
    refreshInterval = 30000 // 30秒
  } = options;

  const [newsItems, setNewsItems] = useState<SharedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // お知らせデータを取得
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('共有お知らせデータ取得開始:', { siteSlug, maxItems });

      let query = supabase
        .from('news')
        .select(`
          id,
          title,
          content,
          category,
          category_id,
          link_url,
          link_text,
          publish_date,
          display_order,
          updated_at,
          news_category:news_categories!category_id(
            id,
            name,
            slug,
            color,
            is_active
          )
        `)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (maxItems) {
        query = query.limit(maxItems);
      }

      const { data, error } = await query;

      if (error) {
        console.error('共有お知らせデータ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('共有お知らせデータ取得成功:', {
        count: data?.length || 0,
        siteSlug,
        items: data?.map(item => ({ 
          id: item.id, 
          title: item.title.substring(0, 30) + '...', 
          category_id: item.category_id,
          has_news_category: !!item.news_category
        })) || []
      });

      setNewsItems(data || []);
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      console.error('共有お知らせデータ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // リアルタイム更新の設定
  useEffect(() => {
    fetchNews();

    if (autoRefresh) {
      // Supabaseリアルタイム更新
      const subscription = supabase
        .channel(`shared-news-${siteSlug}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'news' 
          }, 
          (payload) => {
            console.log('お知らせデータが更新されました:', payload);
            fetchNews();
          }
        )
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'news_categories' 
          }, 
          (payload) => {
            console.log('お知らせカテゴリが更新されました:', payload);
            fetchNews();
          }
        )
        .subscribe();

      // 定期更新（フォールバック）
      const interval = setInterval(() => {
        console.log('定期更新でお知らせデータを再取得');
        fetchNews();
      }, refreshInterval);

      return () => {
        subscription.unsubscribe();
        clearInterval(interval);
      };
    }
  }, [siteSlug, maxItems, autoRefresh, refreshInterval]);

  return {
    newsItems,
    loading,
    error,
    lastUpdated,
    refetch: fetchNews
  };
};