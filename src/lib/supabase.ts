import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// 必要な環境変数があるかチェック
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase環境変数が不足しています。.envファイルを確認してください。');
}

// プレースホルダー値かどうかをチェック
const isPlaceholder = (value: string) => {
  return !value || 
         value === 'your-supabase-url' || 
         value === 'your-supabase-anon-key' || 
         value === 'your-supabase-service-role-key' ||
         value.includes('placeholder') ||
         value.includes('example');
};

if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  console.warn('Supabaseにプレースホルダー値が使用されています。実際のSupabase認証情報で環境変数を更新してください。');
}

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 管理者クライアントを作成（サービスロールキーが利用可能な場合のみ）
export const supabaseAdmin = supabaseServiceRoleKey && !isPlaceholder(supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Supabaseが適切に設定されているかチェックするヘルパー関数
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         !isPlaceholder(supabaseUrl) && 
         !isPlaceholder(supabaseAnonKey);
};

// 管理者が設定されているかチェックするヘルパー関数
export const isAdminConfigured = () => {
  return supabaseServiceRoleKey && 
         !isPlaceholder(supabaseServiceRoleKey) && 
         supabaseAdmin !== null;
};

// ストレージヘルパー関数
export const uploadFile = async (bucket: string, path: string, file: File) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabaseが適切に設定されていません');
  }
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  
  if (error) throw error;
  return data;
};

export const deleteFile = async (bucket: string, path: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabaseが適切に設定されていません');
  }
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
};

export const getPublicUrl = (bucket: string, path: string) => {
  if (!isSupabaseConfigured()) {
    return '';
  }
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

// 画像アップロード用のヘルパー関数
export const uploadImage = async (file: File, bucket: string, path: string): Promise<{ url?: string; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabaseが適切に設定されていません' };
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      if (error.message.includes('Bucket not found')) {
        return { error: `ストレージバケット「${bucket}」が見つかりません。Supabaseダッシュボードでバケットを作成してください。` };
      }
      return { error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (errorMessage.includes('Bucket not found')) {
      return { error: `ストレージバケット「${bucket}」が見つかりません。Supabaseダッシュボードでバケットを作成してください。` };
    }
    return { error: errorMessage };
  }
};

// 画像削除用のヘルパー関数
export const deleteImage = async (bucket: string, path: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabaseが適切に設定されていません' };
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      if (error.message.includes('Bucket not found')) {
        return { success: false, error: `ストレージバケット「${bucket}」が見つかりません。Supabaseダッシュボードでバケットを作成してください。` };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (errorMessage.includes('Bucket not found')) {
      return { success: false, error: `ストレージバケット「${bucket}」が見つかりません。Supabaseダッシュボードでバケットを作成してください。` };
    }
    return { success: false, error: errorMessage };
  }
};

// URLからファイルパスを抽出するヘルパー関数
export const extractPathFromUrl = (url: string, bucket: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.indexOf(bucket);
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    
    return null;
  } catch {
    return null;
  }
};