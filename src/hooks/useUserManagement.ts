import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  permissions: {
    dashboard: boolean;
    kpi: boolean;
    news: boolean;
    workExamples: boolean;
    faq: boolean;
    judges: boolean;
    sponsors: boolean;
    prizes: boolean;
    settings: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      console.log('ユーザー一覧取得開始');

      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('ユーザー一覧取得エラー:', error);
        setError(`ユーザーデータの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('ユーザー一覧取得成功:', {
        count: data?.length || 0,
        users: data?.map(u => ({ id: u.id, email: u.email, role: u.role })) || []
      });

      setUsers(data || []);
      setError('');
    } catch (err) {
      console.error('ユーザー一覧取得処理エラー:', err);
      setError(`ユーザーデータの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // ユーザーを招待（作成）
  const inviteUser = async (userData: {
    email: string;
    password: string;
    role: 'admin' | 'editor';
    permissions: UserProfile['permissions'];
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      console.log('ユーザー招待開始:', userData.email);

      // 既存のユーザーをチェック
      const { data: existingProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingProfile) {
        return { success: false, error: 'このメールアドレスは既に登録されています' };
      }

      // Supabase Authでユーザーを作成
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) {
        console.error('Supabase Auth ユーザー作成エラー:', authError);
        return { success: false, error: `ユーザー作成に失敗しました: ${authError.message}` };
      }

      if (!authData.user) {
        return { success: false, error: 'ユーザー作成に失敗しました' };
      }

      console.log('Supabase Auth ユーザー作成成功:', authData.user.id);

      // ユーザープロフィールを作成
      const { data: insertedProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          role: userData.role,
          permissions: userData.permissions,
          is_active: true
        })
        .select()
        .single();

      if (profileError) {
        console.error('ユーザープロフィール作成エラー:', profileError);
        // 重複エラーの場合は特別な処理
        if (profileError.code === '23505') {
          // 認証ユーザーの削除を試行
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          return { success: false, error: 'このメールアドレスは既に登録されています' };
        }
        // その他のエラーの場合も認証ユーザーを削除
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return { success: false, error: `プロフィール作成に失敗しました: ${profileError.message}` };
      }

      console.log('ユーザープロフィール作成成功');

      // ローカルステートを更新
      await fetchUsers();
      
      console.log('ユーザー招待完了:', userData.email);
      return { success: true };
    } catch (err) {
      console.error('ユーザー招待処理エラー:', err);
      return { 
        success: false, 
        error: `ユーザー招待に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // ユーザー情報を更新
  const updateUser = async (userData: UserProfile): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      console.log('ユーザー更新開始:', userData.email);

      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({
          role: userData.role,
          permissions: userData.permissions,
          is_active: userData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (error) {
        console.error('ユーザー更新エラー:', error);
        return { success: false, error: `ユーザー更新に失敗しました: ${error.message}` };
      }

      console.log('ユーザー更新成功');

      // ローカルステートを更新
      setUsers(users.map(user => 
        user.id === userData.id ? userData : user
      ));
      
      return { success: true };
    } catch (err) {
      console.error('ユーザー更新処理エラー:', err);
      return { 
        success: false, 
        error: `ユーザー更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // ユーザーを削除
  const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      if (!supabaseAdmin) {
        return { success: false, error: '管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。' };
      }

      // メイン管理者の削除を防止
      const user = users.find(u => u.id === userId);
      if (user?.email === 'admin@remilabhc.com' || user?.role === 'admin') {
        return { success: false, error: 'メイン管理者は削除できません' };
      }

      console.log('ユーザー削除開始:', user?.email);

      // Supabase Authからユーザーを削除（カスケードでプロフィールも削除される）
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Supabase Auth ユーザー削除エラー:', authError);
        return { success: false, error: `ユーザー削除に失敗しました: ${authError.message}` };
      }

      console.log('ユーザー削除成功');

      // ローカルステートを更新
      setUsers(users.filter(user => user.id !== userId));
      
      return { success: true };
    } catch (err) {
      console.error('ユーザー削除処理エラー:', err);
      return { 
        success: false, 
        error: `ユーザー削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // パスワードリセットメールを送信
  const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      console.log('パスワードリセットメール送信開始:', email);

      const { error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email
      });

      if (error) {
        console.error('パスワードリセットメール送信エラー:', error);
        return { success: false, error: `パスワードリセットメール送信に失敗しました: ${error.message}` };
      }

      console.log('パスワードリセットメール送信成功');
      return { success: true };
    } catch (err) {
      console.error('パスワードリセットメール送信処理エラー:', err);
      return { 
        success: false, 
        error: `パスワードリセットメール送信に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // パスワードリセット（代替方法）
  const sendPasswordResetFallback = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError('');

      console.log('パスワードリセットメール送信開始（代替方法）:', email);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('パスワードリセットメール送信エラー（代替方法）:', error);
        return { success: false, error: `パスワードリセットメール送信に失敗しました: ${error.message}` };
      }

      console.log('パスワードリセットメール送信成功（代替方法）');
      return { success: true };
    } catch (err) {
      console.error('パスワードリセットメール送信処理エラー（代替方法）:', err);
      return { 
        success: false, 
        error: `パスワードリセットメール送信に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}` 
      };
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    inviteUser,
    updateUser,
    deleteUser,
    sendPasswordReset,
    sendPasswordResetFallback
  };
};