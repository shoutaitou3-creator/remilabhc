// 共有APIクライアント
import { supabase } from '../../lib/supabase';

export class SharedApiClient {
  private siteSlug: string;
  private baseUrl: string;

  constructor(siteSlug: string, baseUrl?: string) {
    this.siteSlug = siteSlug;
    this.baseUrl = baseUrl || import.meta.env.VITE_SUPABASE_URL;
  }

  // お知らせデータを取得
  async getNews(limit?: number) {
    try {
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

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('お知らせデータ取得エラー:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('お知らせデータ取得処理エラー:', err);
      return { 
        data: [], 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }

  // 審査員データを取得
  async getJudges(limit?: number) {
    try {
      let query = supabase
        .from('judges')
        .select('*')
        .order('display_order', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('審査員データ取得エラー:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('審査員データ取得処理エラー:', err);
      return { 
        data: [], 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }

  // 賞金データを取得
  async getPrizes() {
    try {
      const [mainResult, additionalResult] = await Promise.all([
        supabase
          .from('main_prizes')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase
          .from('additional_prizes')
          .select('*')
          .order('display_order', { ascending: true })
      ]);

      if (mainResult.error) {
        console.error('メイン賞金データ取得エラー:', mainResult.error);
        return { data: { main: [], additional: [] }, error: mainResult.error.message };
      }

      if (additionalResult.error) {
        console.error('追加賞金データ取得エラー:', additionalResult.error);
        return { data: { main: [], additional: [] }, error: additionalResult.error.message };
      }

      return { 
        data: { 
          main: mainResult.data || [], 
          additional: additionalResult.data || [] 
        }, 
        error: null 
      };
    } catch (err) {
      console.error('賞金データ取得処理エラー:', err);
      return { 
        data: { main: [], additional: [] }, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }

  // FAQデータを取得
  async getFaqs(limit?: number) {
    try {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('FAQデータ取得エラー:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('FAQデータ取得処理エラー:', err);
      return { 
        data: [], 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }

  // 作品例データを取得
  async getWorkExamples(limit?: number) {
    try {
      let query = supabase
        .from('work_examples')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('作品例データ取得エラー:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('作品例データ取得処理エラー:', err);
      return { 
        data: [], 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }

  // 協賛企業データを取得
  async getSponsors(limit?: number) {
    try {
      let query = supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('協賛企業データ取得エラー:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('協賛企業データ取得処理エラー:', err);
      return { 
        data: [], 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }

  // 資料データを取得
  async getResources(limit?: number, categoryFilter?: string) {
    try {
      let query = supabase
        .from('resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      if (categoryFilter) {
        query = query.eq('category.slug', categoryFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('資料データ取得エラー:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('資料データ取得処理エラー:', err);
      return { 
        data: [], 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }

  // サイト設定を取得
  async getSiteSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('site_slug', this.siteSlug)
        .single();

      if (error) {
        console.error('サイト設定取得エラー:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('サイト設定取得処理エラー:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  }
}

export default SharedApiClient;