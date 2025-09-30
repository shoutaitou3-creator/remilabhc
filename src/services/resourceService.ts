import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Resource } from '../types/resourceDownload';

export class ResourceService {
  // 資料データを取得
  static async fetchResources(): Promise<{ data: Resource[]; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabaseが設定されていません。デフォルトデータを使用します。');
        return { data: [] };
      }

      console.log('資料データ取得開始 - 環境変数確認:', {
        supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      });

      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('資料データ取得エラー:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (err) {
      console.error('資料データ取得処理エラー:', err);
      return { data: [], error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }

  // 資料を作成
  static async createResource(resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'download_count' | 'category'>): Promise<{ success: boolean; error?: string; data?: Resource }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabaseが設定されていません。環境変数を確認してください。' };
      }

      const { data, error } = await supabase
        .from('resources')
        .insert(resourceData)
        .select(`
          *,
          category:resource_categories(*)
        `)
        .single();

      if (error) {
        console.error('資料作成エラー:', error);
        return { success: false, error: `資料の作成に失敗しました: ${error.message}` };
      }

      return { success: true, data: data as Resource };
    } catch (err) {
      return { 
        success: false, 
        error: `資料の作成に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  }

  // 資料を更新
  static async updateResource(id: string, resourceData: Partial<Resource>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabaseが設定されていません。環境変数を確認してください。' };
      }

      const { error } = await supabase
        .from('resources')
        .update({
          ...resourceData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('資料更新エラー:', error);
        return { success: false, error: `資料の更新に失敗しました: ${error.message}` };
      }

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `資料の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  }

  // 資料を削除
  static async deleteResource(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabaseが設定されていません。環境変数を確認してください。' };
      }

      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('資料削除エラー:', error);
        return { success: false, error: `資料の削除に失敗しました: ${error.message}` };
      }

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `資料の削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  }

  // アイコンをアップロード
  static async uploadIcon(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabaseが設定されていません。環境変数を確認してください。' };
      }

      // ファイルバリデーション
      const validation = this.validateIconFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // ユニークなファイル名を生成
      const fileExtension = file.name.split('.').pop();
      const fileName = `icon-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `resource-icons/${fileName}`;

      console.log('アイコンアップロード開始:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadPath: filePath
      });

      // Supabaseストレージにアップロード
      const { data, error } = await supabase.storage
        .from('resource-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('アイコンアップロードエラー:', error);
        return { success: false, error: `アイコンのアップロードに失敗しました: ${error.message}` };
      }

      // 公開URLを取得
      const { data: { publicUrl } } = supabase.storage
        .from('resource-files')
        .getPublicUrl(data.path);

      console.log('アイコンアップロード成功:', {
        path: data.path,
        publicUrl
      });

      return { success: true, url: publicUrl };
    } catch (err) {
      console.error('アイコンアップロード処理エラー:', err);
      return { 
        success: false, 
        error: `アイコンのアップロードに失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  }

  // アイコンファイルのバリデーション
  static validateIconFile(file: File): { isValid: boolean; error?: string } {
    // サイズチェック（1MB制限）
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'アイコンファイルのサイズは1MB以下にしてください。' };
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'アイコンファイルはJPG、PNG、GIFのみ対応しています。' };
    }

    return { isValid: true };
  }
}