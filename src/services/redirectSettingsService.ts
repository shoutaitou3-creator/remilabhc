import { supabase, isSupabaseConfigured, isAdminConfigured } from '../lib/supabase';
import { RedirectSettings } from '../types/resourceDownload';
import { getSiteSlugFromUrl } from '../utils/siteHelpers';

export class RedirectSettingsService {
  // 遷移先設定を取得
  static async fetchRedirectSettings(): Promise<RedirectSettings> {
    const defaultSettings: RedirectSettings = {
      redirectUrl: 'https://remila.jp/',
      redirectDelay: 3000,
      showCompletionMessage: true,
      enableAutoRedirect: true
    };

    try {
      if (!isSupabaseConfigured()) {
        console.log('Supabaseが設定されていません。デフォルト設定を使用します。');
        return defaultSettings;
      }

      const currentSiteSlug = getSiteSlugFromUrl();
      
      console.log('遷移先設定取得開始:', { siteSlug: currentSiteSlug });

      const { data, error } = await supabase
        .from('redirect_settings')
        .select('*')
        .eq('site_slug', currentSiteSlug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('遷移先設定が見つからない、デフォルト設定を作成:', currentSiteSlug);
          if (isAdminConfigured()) {
            await this.createDefaultRedirectSettings(currentSiteSlug);
          }
          return defaultSettings;
        } else {
          console.error('遷移先設定取得エラー:', error);
          return defaultSettings;
        }
      }

      console.log('遷移先設定取得成功:', data);

      return {
        id: data.id,
        redirectUrl: data.redirect_url,
        redirectDelay: data.redirect_delay,
        showCompletionMessage: data.show_completion_message,
        enableAutoRedirect: data.enable_auto_redirect,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (err) {
      console.error('遷移先設定取得処理エラー:', err);
      return defaultSettings;
    }
  }

  // 遷移先設定を保存
  static async saveRedirectSettings(settings: RedirectSettings): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabaseが設定されていません。環境変数を確認してください。' };
      }

      const currentSiteSlug = getSiteSlugFromUrl();
      
      console.log('遷移先設定保存開始:', {
        siteSlug: currentSiteSlug,
        settings: settings
      });

      const { data, error } = await supabase
        .from('redirect_settings')
        .upsert({
          site_slug: currentSiteSlug,
          redirect_url: settings.redirectUrl,
          redirect_delay: settings.redirectDelay,
          show_completion_message: settings.showCompletionMessage,
          enable_auto_redirect: settings.enableAutoRedirect,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'site_slug'
        })
        .select()
        .single();

      if (error) {
        console.error('遷移先設定保存エラー:', error);
        return { success: false, error: `設定の保存に失敗しました: ${error.message}` };
      }

      console.log('遷移先設定保存成功:', data);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `設定の保存に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  }

  // デフォルト遷移先設定を作成
  private static async createDefaultRedirectSettings(siteSlug: string): Promise<void> {
    try {
      if (!isSupabaseConfigured()) {
        console.error('Supabaseが設定されていません。環境変数を確認してください。');
        return;
      }

      const defaultSettings = {
        site_slug: siteSlug,
        redirect_url: 'https://remila.jp/',
        redirect_delay: 1000,
        show_completion_message: true,
        enable_auto_redirect: true
      };

      console.log('デフォルト遷移先設定作成中:', defaultSettings);

      const { data, error } = await supabase
        .from('redirect_settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (error) {
        console.error('デフォルト遷移先設定作成エラー:', error);
        return;
      }

      console.log('デフォルト遷移先設定作成成功:', data);
    } catch (err) {
      console.error('デフォルト遷移先設定作成処理エラー:', err);
    }
  }
}