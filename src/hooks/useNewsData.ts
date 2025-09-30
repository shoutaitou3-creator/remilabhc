import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { NewsCategory } from './useNewsCategoriesData';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'news' | 'press' | 'update' | 'event';
  category_id: string | null;
  link_url: string;
  link_text: string;
  image: string;
  video_url: string;
  attachments: string[];
  is_published: boolean;
  publish_date: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  news_category?: NewsCategory;
}

export const useNewsData = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // お知らせデータを取得（管理画面用 - 全件取得）
  const fetchAllNews = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('news')
        .select(`
          id,
          title,
          content,
          category,
          category_id,
          link_url,
          link_text,
          image,
          video_url,
          attachments,
          is_published,
          publish_date,
          display_order,
          created_at,
          updated_at,
          news_category:news_categories!category_id(
            id,
            name,
            slug,
            color,
            is_active
          )
        `)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('お知らせデータ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('お知らせデータ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          title: item.title.substring(0, 30) + '...', 
          is_published: item.is_published,
          category_id: item.category_id,
          has_news_category: !!item.news_category
        })) || []
      });

      setNewsItems(data || []);
      setError('');
    } catch (err) {
      console.error('お知らせデータ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // お知らせデータを取得（フロントエンド用 - 公開済みのみ）
  const fetchPublishedNews = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
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

      if (error) {
        console.error('公開お知らせデータ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('公開お知らせデータ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          title: item.title.substring(0, 30) + '...', 
          category_id: item.category_id,
          has_news_category: !!item.news_category
        })) || []
      });
      setNewsItems(data || []);
      setError('');
    } catch (err) {
      console.error('公開お知らせデータ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // お知らせを作成
  const createNews = async (newsData: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'news_category'>): Promise<{ success: boolean; error?: string; data?: NewsItem }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      const { data, error } = await supabaseAdmin
        .from('news')
        .insert(newsData)
        .select(`
          id,
          title,
          content,
          category,
          category_id,
          link_url,
          link_text,
          image,
          video_url,
          attachments,
          is_published,
          publish_date,
          display_order,
          created_at,
          updated_at,
          news_category:news_categories!category_id(
            id,
            name,
            slug,
            color,
            is_active
          )
        `)
        .single();

      if (error) {
        console.error('お知らせ作成エラー:', error);
        return { success: false, error: `お知らせの作成に失敗しました: ${error.message}` };
      }

      const newNewsItem = data as NewsItem;
      setNewsItems([...newsItems, newNewsItem]);
      
      return { success: true, data: newNewsItem };
    } catch (err) {
      return { 
        success: false, 
        error: `お知らせの作成に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // お知らせを更新
  const updateNews = async (id: string, newsData: Partial<NewsItem>): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      // news_categoryはJOINで取得されるリレーションデータなので、更新時には除外
      const { news_category, ...updateData } = newsData;

      const { error } = await supabaseAdmin
        .from('news')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('お知らせ更新エラー:', error);
        return { success: false, error: `お知らせの更新に失敗しました: ${error.message}` };
      }

      // ローカルステートを更新
      setNewsItems(newsItems.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      ));
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `お知らせの更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // お知らせを削除
  const deleteNews = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      const { error } = await supabaseAdmin
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('お知らせ削除エラー:', error);
        return { success: false, error: `お知らせの削除に失敗しました: ${error.message}` };
      }

      // ローカルステートを更新
      setNewsItems(newsItems.filter(item => item.id !== id));
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `お知らせの削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // 表示順序を更新
  const updateDisplayOrder = async (reorderedItems: NewsItem[]): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      // バッチで表示順序を更新
      for (const item of reorderedItems) {
        const { error } = await supabaseAdmin
          .from('news')
          .update({ display_order: item.display_order })
          .eq('id', item.id);

        if (error) {
          console.error('表示順序更新エラー:', error);
          return { success: false, error: `表示順序の更新に失敗しました: ${error.message}` };
        }
      }

      // ローカルステートを更新
      setNewsItems(reorderedItems);
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `表示順序の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // カテゴリ別お知らせ数を取得
  const getNewsByCategory = async (): Promise<{ [categoryId: string]: number }> => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('category_id')
        .eq('is_published', true);

      if (error) {
        console.error('カテゴリ別お知らせ数取得エラー:', error);
        return {};
      }

      const counts: { [categoryId: string]: number } = {};
      data?.forEach(item => {
        if (item.category_id) {
          counts[item.category_id] = (counts[item.category_id] || 0) + 1;
        }
      });

      return counts;
    } catch (err) {
      console.error('カテゴリ別お知らせ数取得処理エラー:', err);
      return {};
    }
  };

  return {
    newsItems,
    setNewsItems,
    loading,
    setLoading,
    error,
    setError,
    fetchAllNews,
    fetchPublishedNews,
    createNews,
    updateNews,
    deleteNews,
    updateDisplayOrder,
    getNewsByCategory
  };
};