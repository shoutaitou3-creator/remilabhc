import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DownloadStats } from '../types/resourceDownload';

export class DownloadStatsService {
  // ダウンロード記録を追加
  static async recordDownload(resourceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase未設定のため、ダウンロード記録をスキップします');
        return { success: true };
      }

      const { error } = await supabase
        .from('resource_downloads')
        .insert({
          resource_id: resourceId,
          ip_address: 'unknown',
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('ダウンロード記録エラー:', error);
        console.warn('ダウンロード記録に失敗しましたが、ダウンロードは続行します:', error.message);
        return { success: true };
      }

      return { success: true };
    } catch (err) {
      console.warn('ダウンロード記録処理エラー:', err);
      return { success: true };
    }
  }

  // ダウンロード統計を取得
  static async fetchDownloadStats(): Promise<DownloadStats> {
    try {
      if (!isSupabaseConfigured()) {
        console.log('Supabaseが設定されていません。統計データは利用できません。');
        return {
          totalDownloads: 0,
          todayDownloads: 0,
          conversionRate: 0,
          popularResource: '設定が必要',
          recentActivity: []
        };
      }

      // 総ダウンロード数
      const { count: totalCount, error: totalError } = await supabase
        .from('resource_downloads')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.warn('総ダウンロード数取得エラー:', totalError);
      }

      // 今日のダウンロード数
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount, error: todayError } = await supabase
        .from('resource_downloads')
        .select('*', { count: 'exact', head: true })
        .gte('downloaded_at', today);

      if (todayError) {
        console.warn('今日のダウンロード数取得エラー:', todayError);
      }

      // 人気資料を取得
      const { data: popularData, error: popularError } = await supabase
        .from('resources')
        .select('title, download_count')
        .eq('is_published', true)
        .order('download_count', { ascending: false })
        .limit(1);

      if (popularError) {
        console.warn('人気資料取得エラー:', popularError);
      }

      // 最近のダウンロード活動を取得
      const { data: recentData, error: recentError } = await supabase
        .from('resource_downloads')
        .select(`
          id,
          downloaded_at,
          resource:resources!resource_id(
            title
          )
        `)
        .order('downloaded_at', { ascending: false })
        .limit(10);

      if (recentError) {
        console.warn('最近のダウンロード活動取得エラー:', recentError);
      }

      // 統計データを構築
      const stats: DownloadStats = {
        totalDownloads: totalCount || 0,
        todayDownloads: todayCount || 0,
        conversionRate: totalCount && totalCount > 0 ? Math.round((todayCount || 0) / totalCount * 100 * 10) / 10 : 0,
        popularResource: popularData?.[0]?.title || '未設定',
        recentActivity: recentData || []
      };

      console.log('ダウンロード統計更新:', stats);
      return stats;
    } catch (err) {
      console.error('ダウンロード統計取得処理エラー:', err);
      return {
        totalDownloads: 0,
        todayDownloads: 0,
        conversionRate: 0,
        popularResource: 'データ取得エラー',
        recentActivity: []
      };
    }
  }

  // ダウンロード数を増加
  static async incrementDownloadCount(resourceId: string, currentCount: number): Promise<void> {
    try {
      if (!isSupabaseConfigured()) return;

      const { error } = await supabase
        .from('resources')
        .update({ 
          download_count: currentCount + 1
        })
        .eq('id', resourceId);

      if (error) {
        console.warn('ダウンロード数更新エラー:', error);
      }
    } catch (err) {
      console.warn('ダウンロード数更新処理エラー:', err);
    }
  }
}