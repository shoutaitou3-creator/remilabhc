import { supabase, isSupabaseConfigured } from '../lib/supabase';

export class FileStorageService {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  // ファイルバリデーション
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'ファイルサイズが50MBを超えています。' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: '対応していないファイル形式です。PDF、JPG、PNGのみアップロード可能です。' };
    }

    return { isValid: true };
  }

  // ファイルをSupabaseストレージにアップロード
  static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabaseが設定されていません。環境変数を確認してください。' };
      }

      // ファイルバリデーション
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // ユニークなファイル名を生成
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `resources/${fileName}`;

      console.log('ファイルアップロード開始:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadPath: filePath
      });

      if (onProgress) onProgress(10);

      // Supabaseストレージにアップロード
      const { data, error } = await supabase.storage
        .from('resource-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentDisposition: 'attachment' // ダウンロードを強制
        });

      if (error) {
        console.error('ファイルアップロードエラー:', error);
        return { success: false, error: `ファイルのアップロードに失敗しました: ${error.message}` };
      }

      if (onProgress) onProgress(80);

      // 公開URLを取得
      const { data: { publicUrl } } = supabase.storage
        .from('resource-files')
        .getPublicUrl(data.path);

      console.log('ファイルアップロード成功:', {
        path: data.path,
        publicUrl
      });

      if (onProgress) onProgress(100);

      return { success: true, url: publicUrl };
    } catch (err) {
      console.error('ファイルアップロード処理エラー:', err);
      return { 
        success: false, 
        error: `ファイルのアップロードに失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  }

  // ファイルをSupabaseストレージから削除
  static async deleteFile(fileUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabaseが設定されていません。環境変数を確認してください。' };
      }

      // URLからファイルパスを抽出
      const urlParts = fileUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'resource-files');
      if (bucketIndex === -1 || bucketIndex >= urlParts.length - 1) {
        return { success: false, error: 'ファイルパスの抽出に失敗しました。' };
      }

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from('resource-files')
        .remove([filePath]);

      if (error) {
        console.error('ファイル削除エラー:', error);
        return { success: false, error: `ファイルの削除に失敗しました: ${error.message}` };
      }

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: `ファイルの削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  }
}