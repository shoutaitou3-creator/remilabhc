import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';

// 配列をランダムにシャッフルするヘルパー関数（Fisher-Yates shuffle）
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export interface EntryWork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instagram_url: string;
  instagram_account: string;
  department: 'creative' | 'reality';
  hashtag: string;
  period: string;
  is_nominated: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useEntryWorksData = () => {
  const [entryWorks, setEntryWorks] = useState<EntryWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // エントリー作品データを取得（管理画面用 - 全件取得）
  const fetchAllEntryWorks = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('エントリー作品データ取得開始 - supabaseAdmin状況:', {
        supabaseAdminExists: !!supabaseAdmin,
        serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定'
      });
      
      // supabaseAdminが利用できない場合は通常のsupabaseクライアントを使用
      const client = supabaseAdmin || supabase;

      const { data, error } = await client
        .from('entry_works')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('エントリー作品データ取得エラー:', error);
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        } else {
          setError(`データの取得に失敗しました: ${error.message}`);
        }
        return;
      }

      console.log('エントリー作品データ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          title: item.title.substring(0, 30) + '...', 
          is_published: item.is_published,
          is_nominated: item.is_nominated,
          department: item.department,
          period: item.period
        })) || []
      });

      setEntryWorks(data || []);
      setError('');
    } catch (err) {
      console.error('エントリー作品データ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // エントリー作品データを取得（フロントエンド用 - 公開済みのみ）
  const fetchPublishedEntryWorks = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('entry_works')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('公開エントリー作品データ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('公開エントリー作品データ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          title: item.title.substring(0, 30) + '...', 
          is_nominated: item.is_nominated,
          department: item.department,
          period: item.period
        })) || []
      });
      
      // データをランダムにシャッフルしてから設定
      const shuffledData = shuffleArray(data || []);
      console.log('エントリー作品をランダムシャッフル:', {
        originalOrder: (data || []).slice(0, 3).map(item => ({ id: item.id, title: item.title.substring(0, 20) })),
        shuffledOrder: shuffledData.slice(0, 3).map(item => ({ id: item.id, title: item.title.substring(0, 20) }))
      });
      
      setEntryWorks(shuffledData);
      setError('');
    } catch (err) {
      console.error('公開エントリー作品データ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // エントリー作品を作成
  const createEntryWork = async (workData: Omit<EntryWork, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string; data?: EntryWork }> => {
    try {
      setError('');

      const client = supabaseAdmin || supabase;

      const { data, error } = await client
        .from('entry_works')
        .insert(workData)
        .select()
        .single();

      if (error) {
        console.error('エントリー作品作成エラー:', error);
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
        } else {
          return { success: false, error: `エントリー作品の作成に失敗しました: ${error.message}` };
        }
      }

      const newEntryWork = data as EntryWork;
      setEntryWorks([...entryWorks, newEntryWork]);
      
      return { success: true, data: newEntryWork };
    } catch (err) {
      return { 
        success: false, 
        error: `エントリー作品の作成に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // エントリー作品を更新
  const updateEntryWork = async (id: string, workData: Partial<EntryWork>): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      const client = supabaseAdmin || supabase;

      const { error } = await client
        .from('entry_works')
        .update({
          ...workData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('エントリー作品更新エラー:', error);
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
        } else {
          return { success: false, error: `エントリー作品の更新に失敗しました: ${error.message}` };
        }
      }

      // ローカルステートを更新
      setEntryWorks(entryWorks.map(item => 
        item.id === id ? { ...item, ...workData } : item
      ));
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `エントリー作品の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // エントリー作品を削除
  const deleteEntryWork = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      const client = supabaseAdmin || supabase;

      const { error } = await client
        .from('entry_works')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('エントリー作品削除エラー:', error);
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
        } else {
          return { success: false, error: `エントリー作品の削除に失敗しました: ${error.message}` };
        }
      }

      // ローカルステートを更新
      setEntryWorks(entryWorks.filter(item => item.id !== id));
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `エントリー作品の削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // 表示順序を更新
  const updateDisplayOrder = async (reorderedItems: EntryWork[]): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      const client = supabaseAdmin || supabase;

      // バッチで表示順序を更新
      for (const item of reorderedItems) {
        const { error } = await client
          .from('entry_works')
          .update({ display_order: item.display_order })
          .eq('id', item.id);

        if (error) {
          console.error('表示順序更新エラー:', error);
          if (error.message.includes('RLS') || error.message.includes('policy')) {
            return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
          } else {
            return { success: false, error: `表示順序の更新に失敗しました: ${error.message}` };
          }
        }
      }

      // ローカルステートを更新
      setEntryWorks(reorderedItems);
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `表示順序の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  return {
    entryWorks,
    setEntryWorks,
    loading,
    setLoading,
    error,
    setError,
    fetchAllEntryWorks,
    fetchPublishedEntryWorks,
    createEntryWork,
    updateEntryWork,
    deleteEntryWork,
    updateDisplayOrder
  };
};