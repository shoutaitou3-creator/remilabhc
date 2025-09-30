import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin, isSupabaseConfigured, isAdminConfigured } from '../lib/supabase';

// URLパラメータからサイトスラッグを取得するヘルパー関数
const getSiteSlugFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('app') || 'remila-bhc'; // デフォルトは remila-bhc
};

export interface SiteSettings {
  id?: string;
  site_slug: string;
  site_title: string;
  site_description: string;
  site_keywords: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  company_name: string;
  company_url: string;
  service_name: string;
  service_url: string;
  instagram_url: string;
  twitter_url: string;
  facebook_url: string;
  youtube_url: string;
  maintenance_mode: boolean;
  analytics_id: string;
  favicon: string;
  meta_pixel_id: string;
  animation_duration: number;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentSiteSlug] = useState<string>(getSiteSlugFromUrl());

  // サイト設定を取得
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');

      // Supabase設定チェック
      if (!isSupabaseConfigured()) {
        const errorMsg = 'Supabaseが正しく設定されていません。「Connect to Supabase」ボタンをクリックしてSupabaseを接続してください。';
        console.error('useSiteSettings - 設定エラー:', errorMsg);
        setError(errorMsg);
        return;
      }

      console.log('useSiteSettings - サイト設定取得開始:', { 
        site_slug: currentSiteSlug,
        supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        supabaseUrlValue: import.meta.env.VITE_SUPABASE_URL,
        environment: import.meta.env.MODE
      });

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('site_slug', currentSiteSlug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // レコードが見つからない場合、デフォルト設定を作成
          console.log('useSiteSettings - サイト設定が見つからない:', currentSiteSlug);
          await createDefaultSettings();
          return;
        } else {
          console.error('useSiteSettings - サイト設定の取得に失敗:', error);
          setError(`サイト設定の取得に失敗しました: ${error.message} (コード: ${error.code})`);
          return;
        }
      }

      console.log('useSiteSettings - サイト設定取得成功:', { 
        site_slug: data.site_slug, 
        site_title: data.site_title 
      });
      setSettings(data);
    } catch (err) {
      console.error('useSiteSettings - サイト設定の取得エラー:', err);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Supabaseに接続できません。「Connect to Supabase」ボタンをクリックしてSupabaseを接続してください。');
      } else {
        setError(`サイト設定の取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // デフォルト設定を作成
  const createDefaultSettings = async () => {
    try {
      // デフォルト設定の作成は管理画面から手動で行うため、ここでは何もしない
      console.log('useSiteSettings - デフォルト設定が見つかりません。管理画面から設定を作成してください。');
      setError('サイト設定が見つかりません。管理画面から設定を作成してください。');
    } catch (err) {
      console.error('useSiteSettings - デフォルト設定作成処理エラー:', err);
      setError(`デフォルト設定の作成に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // サイト設定を保存
  const saveSettings = async (newSettings: SiteSettings): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      // 管理者権限チェック
      if (!isAdminConfigured()) {
        const errorMessage = '管理者権限が必要です。Service Role Keyを設定してください。';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      console.log('データベース更新開始:', {
        id: settings?.id,
        site_slug: newSettings.site_slug,
        favicon: newSettings.favicon,
        site_title: newSettings.site_title
      });

      const { error } = await supabaseAdmin
        .from('site_settings')
        .update({
          ...newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('site_slug', currentSiteSlug);

      if (error) {
        console.error('サイト設定の保存に失敗:', error);
        setError(`サイト設定の保存に失敗しました: ${error.message}`);
        return { success: false, error: error.message };
      }

      console.log('データベース更新成功');

      // ローカルステートを更新
      setSettings(newSettings);
      
      console.log('ローカルステート更新完了');
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('サイト設定の保存エラー:', errorMessage);
      setError(`サイト設定の保存に失敗しました: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    currentSiteSlug,
    loading,
    error,
    saveSettings,
    refetch: fetchSettings
  };
};