import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<string>('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const { login } = useAuth();

  // デバッグ情報を表示する関数
  const showDebugInfo = () => {
    const info = {
      timestamp: new Date().toISOString(),
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (' + import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...)' : 'Not set',
      supabaseServiceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'Set (' + import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...)' : 'Not set',
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
      environment: import.meta.env.MODE,
      isSupabaseConnected: !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
    };
    setDebugInfo(info);
    setShowDebugDetails(true);
    console.log('Debug Info:', info);
  };

  // Supabase接続テスト
  const testSupabaseConnection = async () => {
    try {
      if (!supabase) {
        setConnectionTestResult('Supabaseクライアントが初期化されていません。環境変数を確認してください。');
        return;
      }

      setConnectionTestResult('テスト中...');
      
      console.log('Supabase接続テスト開始');
      
      // 基本的な接続テスト
      const { data: siteData, error: siteError } = await supabase
        .from('site_settings')
        .select('id, site_slug')
        .limit(1);
      
      console.log('site_settings テスト結果:', { data: siteData, error: siteError });
      
      // user_profilesテーブルテスト（RLS制限あり）
      const { count: userProfilesCount, error: userError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      
      console.log('user_profiles テスト結果:', { count: userProfilesCount, error: userError });
      
      // Supabase Auth状態確認
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('認証状態テスト結果:', { session: session?.user?.email || 'なし', error: sessionError });
      
      if (siteError || userError) {
        const errors = [siteError, userError].filter(Boolean);
        console.error('接続テストエラー:', errors);
        setConnectionTestResult(`接続エラー: ${errors.map(e => `${e!.message} (${e!.code})`).join(', ')}`);
        return;
      }
      
      const testResults = {
        siteSettings: siteData?.length || 0,
        userProfiles: userProfilesCount || 0,
        rlsNote: '※ user_profilesは認証前はRLSにより0件表示（正常）',
        currentSession: session ? `ログイン中: ${session.user?.email}` : 'ログアウト状態'
      };
      
      setConnectionTestResult(`接続成功！\n\nサイト設定: ${testResults.siteSettings}件\nユーザープロフィール: ${testResults.userProfiles}件\n${testResults.rlsNote}\n現在の状態: ${testResults.currentSession}\n\n※ ログイン後はプロフィールが正常に取得されます\n\nデバッグ: コンソールで詳細ログを確認してください`);
      
    } catch (err) {
      console.error('Supabase接続テストエラー:', err);
      setConnectionTestResult(`接続テストエラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  // デバッグ用：直接認証テスト
  const testDirectAuth = async (testEmail: string = 'admin@remilabhc.com', testPassword: string = 'admin123') => {
    try {
      console.log('直接認証テスト開始:', testEmail);
      setConnectionTestResult(`直接認証テスト中... (${testEmail})`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      console.log('直接認証結果:', { data, error });
      
      if (error) {
        const errorDetails = {
          message: error.message,
          status: error.status || 'No status',
          code: error.code || 'No code'
        };
        setConnectionTestResult(`認証エラー: ${error.message} (${errorDetails.status})\n\nエラー詳細:\n${JSON.stringify(errorDetails, null, 2)}`);
        return;
      }
      
      if (data.user) {
        console.log('認証成功、プロフィール取得開始:', data.user.id);
        
        // プロフィール取得テスト
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        console.log('プロフィール取得結果:', { profile, profileError });
        
        if (profileError) {
          // 安全なエラー情報のみを抽出
          const safeProfileErrorDetails = {
            message: profileError.message || 'Unknown error',
            code: profileError.code || 'No code',
            details: profileError.details || 'No details',
            hint: profileError.hint || 'No hint'
          };
          setConnectionTestResult(`認証成功、プロフィール取得エラー: ${profileError.message}\n\nプロフィールエラー詳細:\nメッセージ: ${safeProfileErrorDetails.message}\nコード: ${safeProfileErrorDetails.code}\n詳細: ${safeProfileErrorDetails.details}\nヒント: ${safeProfileErrorDetails.hint}`);
        } else {
          setConnectionTestResult(`認証・プロフィール取得成功！\nユーザー: ${profile.email}\nロール: ${profile.role}\nアクティブ: ${profile.is_active}\n権限数: ${Object.values(profile.permissions).filter(Boolean).length}個`);
        }
        
        // テスト後はログアウト
        console.log('テスト完了、ログアウト中...');
        await supabase.auth.signOut();
        console.log('ログアウト完了');
      }
    } catch (err) {
      console.error('直接認証テストエラー:', err);
      // 安全なエラー情報のみを抽出（循環参照を避ける）
      const safeErrorInfo = {
        message: err instanceof Error ? err.message : 'Unknown error',
        name: err instanceof Error ? err.name : 'Unknown',
        type: typeof err
      };
      setConnectionTestResult(`直接認証テストエラー: ${safeErrorInfo.message}\n\nエラータイプ: ${safeErrorInfo.name} (${safeErrorInfo.type})`);
    }
  };
  
  // 管理者ユーザーを直接作成する関数
  const createAdminUser = async () => {
    try {
      setIsCreatingAdmin(true);
      setConnectionTestResult('管理者ユーザー作成中...');
      
      console.log('管理者ユーザー作成開始');
      
      // 環境変数の確認
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setConnectionTestResult('Supabase環境変数が設定されていません。\n\n「Connect to Supabase」ボタンをクリックしてSupabaseを接続してください。');
        return;
      }
      
      const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseServiceRoleKey) {
        setConnectionTestResult('Service Role Keyが設定されていません。\n\n.envファイルにVITE_SUPABASE_SERVICE_ROLE_KEYを設定してください。');
        return;
      }

      // 動的にSupabaseクライアントを作成
      const { createClient } = await import('@supabase/supabase-js');
      const adminClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            storageKey: 'temp-admin-creation'
          }
        }
      );
      
      // 既存ユーザーをチェック
      console.log('既存ユーザーをチェック中...');
      const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers();
      
      if (listError) {
        console.error('ユーザーリスト取得エラー:', listError);
        setConnectionTestResult(`ユーザーリスト取得エラー: ${listError.message}\n\nService Role Keyが正しく設定されているか確認してください。`);
        return;
      }
      
      const adminExists = existingUsers.users.find(u => u.email === 'admin@remilabhc.com');
      
      if (adminExists) {
        console.log('管理者ユーザーは既に存在します:', adminExists.id);
        setConnectionTestResult('管理者ユーザーは既に存在します。\n\nパスワードが正しいか確認してください。\n\nデフォルトパスワード: admin123');
        return;
      }
      
      console.log('管理者ユーザーを作成中...');
      // 管理者ユーザーを作成
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: 'admin@remilabhc.com',
        password: 'admin123',
        email_confirm: true,
        user_metadata: {
          role: 'admin'
        }
      });
      
      if (authError) {
        console.error('管理者ユーザー作成エラー:', authError);
        setConnectionTestResult(`管理者ユーザー作成エラー: ${authError.message}\n\nコード: ${authError.code || 'Unknown'}\n\nSupabaseプロジェクトの設定を確認してください。`);
        return;
      }
      
      if (!authData.user) {
        setConnectionTestResult('ユーザー作成に失敗しました（データが返されませんでした）');
        return;
      }
      
      console.log('管理者ユーザー作成成功:', authData.user.id);
      
      console.log('プロフィールを作成中...');
      // プロフィールを作成
      const { error: profileError } = await adminClient
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: 'admin@remilabhc.com',
          role: 'admin',
          permissions: {
            dashboard: true,
            kpi: true,
            news: true,
            workExamples: true,
            faq: true,
            judges: true,
            sponsors: true,
            prizes: true,
            settings: true
          },
          is_active: true
        });
      
      if (profileError) {
        console.error('プロフィール作成エラー:', profileError);
        setConnectionTestResult(`プロフィール作成エラー: ${profileError.message}\n\nコード: ${profileError.code || 'Unknown'}\n\nuser_profilesテーブルが存在するか確認してください。`);
        return;
      }
      
      console.log('管理者プロフィール作成成功');
      setConnectionTestResult('✅ 管理者ユーザー作成完了！\n\nメール: admin@remilabhc.com\nパスワード: admin123\n\n上記の認証情報でログインしてください。');
      
      // 作成後、自動的にログインフォームに値を設定
      setEmail('admin@remilabhc.com');
      setPassword('admin123');
      
    } catch (err) {
      console.error('管理者ユーザー作成処理エラー:', err);
      setConnectionTestResult(`管理者ユーザー作成エラー: ${err instanceof Error ? err.message : 'Unknown error'}\n\n環境変数とSupabase設定を確認してください。`);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setConnectionTestResult('');

    // デバッグ情報を追加
    console.log('AdminLogin - ログイン試行開始:', {
      email,
      currentUrl: window.location.href,
      environment: import.meta.env.MODE,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '設定済み' : '未設定',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '設定済み' : '未設定',
      timestamp: new Date().toISOString()
    });

    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('AdminLogin - ログイン成功、管理画面に遷移');
        onLoginSuccess();
      } else {
        console.error('AdminLogin - ログイン失敗:', result.error);
        setError(result.error || 'ログインに失敗しました');
        
        // 認証エラーの場合は管理者作成を提案
        if (result.error && (
          result.error.includes('Invalid login credentials') || 
          result.error.includes('認証に失敗しました')
        )) {
          console.log('認証失敗 - 管理者ユーザーの自動作成を提案');
          
          const shouldCreateAdmin = window.confirm(
            '認証に失敗しました。管理者ユーザーが存在しない可能性があります。\n\n管理者ユーザー（admin@remilabhc.com）を自動作成しますか？\n\n※ この操作にはService Role Keyが必要です。'
          );
          
          if (shouldCreateAdmin) {
            await createAdminUser();
          }
        }
      }
    } catch (err) {
      console.error('AdminLogin - ログイン処理エラー:', err);
      setError('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-2xl overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-purple-600 to-rose-600 px-8 py-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">管理者ログイン</h2>
              <p className="text-purple-100 mt-2">REMILA BHC 2026 管理システム</p>
            </div>
          </div>

          {/* フォーム */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* メールアドレス */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="メールアドレスを入力"
                    required
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="パスワードを入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-50 border border-red-200 p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* ログインボタン */}
              <div className="space-y-3">
                <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold py-3 px-4 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ログイン中...
                  </div>
                ) : (
                  'ログイン'
                )}
                </button>
              
              {/* デバッグボタン */}
              <button
                type="button"
                onClick={showDebugInfo}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 transition-colors text-sm"
              >
                デバッグ情報を表示
              </button>
              
              {/* Supabase接続テストボタン */}
              <button
                type="button"
                onClick={testSupabaseConnection}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 transition-colors text-sm"
              >
                Supabase接続テスト
              </button>
              
              {/* 直接認証テストボタン */}
              <button
                type="button"
                onClick={() => testDirectAuth()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 transition-colors text-sm"
              >
                詳細認証テスト (admin@remilabhc.com)
              </button>
              
              {/* 管理者ユーザー作成ボタン */}
              <button
                type="button"
                onClick={createAdminUser}
                disabled={isCreatingAdmin}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 px-4 transition-colors text-sm disabled:cursor-not-allowed shadow-lg"
              >
                {isCreatingAdmin ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    作成中...
                  </div>
                ) : (
                  '🔧 管理者ユーザーを作成'
                )}
              </button>
              
              {/* 編集者テストボタン */}
              <button
                type="button"
                onClick={() => testDirectAuth('editor@resusty.com', 'editor123')}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 transition-colors text-sm"
              >
                編集者認証テスト (editor@resusty.com)
              </button>
              
              {/* 接続テスト結果表示 */}
              {connectionTestResult && (
                <div className={`text-xs p-3 whitespace-pre-line ${
                  connectionTestResult.includes('成功') || connectionTestResult.includes('Success') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : connectionTestResult.includes('エラー') || connectionTestResult.includes('Error')
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  <strong>接続テスト結果:</strong> {connectionTestResult}
                </div>
              )}
              
              </div>
              
              {/* デバッグ情報表示 */}
              {debugInfo && (
                <div className="mt-4 bg-gray-100 p-3 rounded-lg text-xs">
                  <h4 className="font-bold mb-2">デバッグ情報:</h4>
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              {/* テスト用認証情報 */}
              <div className="mt-4 bg-blue-50 border border-blue-200 p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">テスト用認証情報</h4>
                <div className="space-y-2 text-xs text-blue-700">
                  <div>
                    <strong>管理者:</strong><br/>
                    メール: admin@remilabhc.com<br/>
                    パスワード: admin123
                  </div>
                  <div>
                    <strong>編集者:</strong><br/>
                    メール: editor@remilabhc.com<br/>
                    パスワード: editor123
                  </div>
                </div>
              </div>
              
              {/* 詳細デバッグ情報 */}
              {showDebugDetails && (
                <div className="mt-4 bg-gray-100 border border-gray-300 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-800">詳細デバッグ情報</h4>
                    <button
                      type="button"
                      onClick={() => setShowDebugDetails(false)}
                      className="text-gray-500 hover:text-gray-700 text-xs"
                    >
                      閉じる
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-white p-2 rounded border max-h-40 overflow-y-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2026 REMILA Back Style Hair Contest. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;