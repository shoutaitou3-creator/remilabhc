import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useNewsCategoriesData = () => {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // カテゴリデータを取得（管理画面用 - 全件取得）
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('news_categories')
        .select(`
          id,
          name,
          slug,
          color,
          description,
          is_active,
          display_order,
          created_at,
          updated_at
        `)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('カテゴリデータ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('カテゴリデータ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          name: item.name, 
          is_active: item.is_active,
          slug: item.slug,
          color: item.color
        })) || []
      });

      setCategories(data || []);
      setError('');
    } catch (err) {
      console.error('カテゴリデータ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // カテゴリデータを取得（フロントエンド用 - 有効のみ）
  const fetchActiveCategories = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('news_categories')
        .select(`
          id,
          name,
          slug,
          color,
          description,
          is_active,
          display_order
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('有効カテゴリデータ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('有効カテゴリデータ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          name: item.name, 
          slug: item.slug,
          color: item.color,
          is_active: item.is_active
        })) || []
      });
      setCategories(data || []);
      setError('');
    } catch (err) {
      console.error('有効カテゴリデータ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // カテゴリを作成
  const createCategory = async (categoryData: Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string; data?: NewsCategory }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      const { data, error } = await supabaseAdmin
        .from('news_categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) {
        console.error('カテゴリ作成エラー:', error);
        return { success: false, error: `カテゴリの作成に失敗しました: ${error.message}` };
      }

      const newCategory = data as NewsCategory;
      setCategories([...categories, newCategory]);
      
      return { success: true, data: newCategory };
    } catch (err) {
      return { 
        success: false, 
        error: `カテゴリの作成に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // カテゴリを更新
  const updateCategory = async (id: string, categoryData: Partial<NewsCategory>): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      const { error } = await supabaseAdmin
        .from('news_categories')
        .update({
          ...categoryData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('カテゴリ更新エラー:', error);
        return { success: false, error: `カテゴリの更新に失敗しました: ${error.message}` };
      }

      // ローカルステートを更新
      setCategories(categories.map(item => 
        item.id === id ? { ...item, ...categoryData } : item
      ));
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `カテゴリの更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // カテゴリを削除
  const deleteCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      const { error } = await supabaseAdmin
        .from('news_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('カテゴリ削除エラー:', error);
        return { success: false, error: `カテゴリの削除に失敗しました: ${error.message}` };
      }

      // ローカルステートを更新
      setCategories(categories.filter(item => item.id !== id));
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `カテゴリの削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // 表示順序を更新
  const updateDisplayOrder = async (reorderedItems: NewsCategory[]): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      // バッチで表示順序を更新
      for (const item of reorderedItems) {
        const { error } = await supabaseAdmin
          .from('news_categories')
          .update({ display_order: item.display_order })
          .eq('id', item.id);

        if (error) {
          console.error('表示順序更新エラー:', error);
          return { success: false, error: `表示順序の更新に失敗しました: ${error.message}` };
        }
      }

      // ローカルステートを更新
      setCategories(reorderedItems);
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `表示順序の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // スラッグからカテゴリを取得
  const getCategoryBySlug = (slug: string): NewsCategory | undefined => {
    return categories.find(cat => cat.slug === slug);
  };

  // カテゴリIDからカテゴリを取得
  const getCategoryById = (id: string): NewsCategory | undefined => {
    return categories.find(cat => cat.id === id);
  };

  return {
    categories,
    setCategories,
    loading,
    setLoading,
    error,
    setError,
    fetchAllCategories,
    fetchActiveCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateDisplayOrder,
    getCategoryBySlug,
    getCategoryById
  };
};