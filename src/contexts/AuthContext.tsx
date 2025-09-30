import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface User {
  id: string;
  email: string;
}

interface UserProfile {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態を確認
    const checkAuthState = async () => {
      try {
        // Supabaseクライアントの確認
        if (!supabase) {
          console.error('AuthContext - Supabaseクライアントが初期化されていません');
          setLoading(false);
          return;
        }

        console.log('AuthContext - 認証状態確認開始');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('認証状態確認エラー:', error);
          // 無効なリフレッシュトークンエラーの場合はセッションをクリア
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('AuthContext - 既存セッション検出:', {
            email: session.user.email,
            userId: session.user.id
          });
          
          // ユーザープロフィールを取得
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('AuthContext - プロフィール取得エラー:', {
              error: profileError,
              userId: session.user.id,
              email: session.user.email
            });
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }

          if (!profile) {
            console.error('AuthContext - ユーザープロフィールが見つかりません:', session.user.email);
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
          if (!profile.is_active) {
            console.log('AuthContext - 非アクティブユーザー:', session.user.email);
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }

          // 最終ログイン時刻を更新
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', session.user.id);
          
          if (updateError) {
            console.warn('AuthContext - 最終ログイン時刻更新エラー:', updateError);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          setUserProfile(profile);
          setIsAuthenticated(true);
          
          console.log('AuthContext - 認証完了:', {
            email: profile.email,
            role: profile.role,
            isActive: profile.is_active
          });
        } else {
          console.log('AuthContext - セッションなし');
        }
      } catch (error) {
        console.error('AuthContext - 認証状態確認処理エラー:', error);
        // エラーが発生した場合はセッションをクリア
        await supabase.auth.signOut();
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext - 認証状態変更:', {
        event,
        userEmail: session?.user?.email,
        hasSession: !!session
      });
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log('AuthContext - ログアウト処理');
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      console.log('ログイン試行:', email);

      // Supabase接続確認
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase環境変数が設定されていません');
        return { 
          success: false, 
          error: 'Supabase環境変数が設定されていません。管理者にお問い合わせください。' 
        };
      }

      // Supabase認証でログイン
      console.log('Supabase認証開始:', { email });
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('認証エラー:', authError.message);
        console.error('認証エラー詳細:', {
          code: authError.code,
          status: authError.status,
          message: authError.message
        });
        
        // より詳細なエラーメッセージを提供
        let errorMessage = authError.message;
        if (authError.message === 'Invalid login credentials') {
          errorMessage = '認証に失敗しました。メールアドレスまたはパスワードが正しくありません。\n\n※ 管理者ユーザーが存在しない場合は「管理者ユーザーを作成」ボタンをクリックしてください。';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'メールアドレスが確認されていません。';
        } else if (authError.message.includes('Too many requests')) {
          errorMessage = 'ログイン試行回数が上限に達しました。しばらく待ってから再試行してください。';
        }
        
        return { 
          success: false, 
          error: errorMessage
        };
      }

      if (!authData.user) {
        console.error('認証データが取得できませんでした');
        return { 
          success: false, 
          error: 'ログインに失敗しました' 
        };
      }

      console.log('認証成功:', authData.user.email);

      console.log('ユーザープロフィール取得開始...');
      // 認証されたユーザーIDでプロフィールを取得（RLSポリシー: uid() = id に準拠）
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('プロフィール取得エラー:', profileError);
        console.error('プロフィール取得エラー詳細:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          userId: authData.user.id,
          userEmail: authData.user.email
        });
        await supabase.auth.signOut();
        
        if (profileError.code === 'PGRST116') {
          return { 
            success: false, 
            error: `このユーザー（${authData.user.email}）のプロフィールが見つかりません。管理者にお問い合わせください。` 
          };
        } else {
          return { 
            success: false, 
            error: `ユーザープロフィールの取得に失敗しました: ${profileError.message} (コード: ${profileError.code})` 
          };
        }
      }

      if (!profile) {
        console.error('ユーザープロフィールが見つかりません');
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: `ユーザープロフィールが見つかりません。管理者にお問い合わせください。` 
        };
      }

      if (!profile.is_active) {
        console.log('非アクティブユーザー:', authData.user.email);
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'このアカウントは無効化されています。管理者にお問い合わせください。'
        };
      }

      console.log('プロフィール取得成功:', { id: profile.id, email: profile.email, role: profile.role });

      // 最終ログイン時刻を更新
      console.log('最終ログイン時刻更新中...');
      console.log('プロフィール更新前のユーザーID:', authData.user.id);
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', authData.user.id);
      
      if (updateError) {
        console.warn('最終ログイン時刻の更新に失敗:', {
          message: updateError.message,
          code: updateError.code,
          details: updateError.details,
          userId: authData.user.id
        });
        // エラーがあっても認証は続行
      }

      const userData: User = {
        id: authData.user.id,
        email: authData.user.email || ''
      };

      setUser(userData);
      setUserProfile(profile);
      setIsAuthenticated(true);
      
      console.log('ログイン成功:', email);
      return { success: true };
    } catch (error) {
      console.error('ログイン処理エラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ログインに失敗しました' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);

      console.log('ログアウト開始');

      // 現在のセッションを確認
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // セッションが存在する場合のみSupabaseからログアウト
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          // session_not_foundエラーは警告として扱う（目的は達成されているため）
          if (error.message.includes('session_not_found') || error.message.includes('Session from session_id claim in JWT does not exist') || error.message.includes('Auth session missing')) {
            console.warn('ログアウト警告（セッション既に無効）:', error.message);
          } else {
            console.error('ログアウトエラー:', error);
          }
        }
      } else {
        console.log('セッションが存在しないため、ローカル状態のみクリア');
      }

      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      
      console.log('ログアウト完了');
    } catch (error) {
      // session_not_foundエラーは警告として扱う（目的は達成されているため）
      if (error instanceof Error && (error.message.includes('session_not_found') || error.message.includes('Auth session missing') || error.message.includes('Session from session_id claim in JWT does not exist'))) {
        console.warn('ログアウト警告（セッション既に無効）:', error.message);
      } else {
        console.error('ログアウト処理エラー:', error);
      }
      // エラーが発生してもローカル状態はクリア
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      userProfile,
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};