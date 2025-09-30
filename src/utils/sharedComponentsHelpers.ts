// 共有コンポーネント用のヘルパー関数

/**
 * 共有コンポーネントで使用するSupabaseクライアントを取得
 * 他のサイトでも同じデータベースにアクセスできるように設定
 */
export const getSharedSupabaseClient = () => {
  // 環境変数から設定を取得
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase環境変数が設定されていません。共有コンポーネントが正常に動作しない可能性があります。');
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
};

/**
 * 共有コンポーネント用のテーマを正規化
 */
export const normalizeSharedTheme = (customTheme?: any) => {
  const defaultTheme = {
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f1f5f9'
    },
    typography: {
      fontFamily: 'Noto Sans JP, sans-serif'
    }
  };

  if (!customTheme) return defaultTheme;

  return {
    colors: {
      ...defaultTheme.colors,
      ...customTheme.colors
    },
    typography: {
      ...defaultTheme.typography,
      ...customTheme.typography
    }
  };
};

/**
 * 共有コンポーネントのバージョン情報
 */
export const SHARED_COMPONENTS_VERSION = '1.0.0';

/**
 * 共有コンポーネントの設定を検証
 */
export const validateSharedComponentConfig = (config: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.siteSlug || typeof config.siteSlug !== 'string') {
    errors.push('siteSlugは必須です');
  }

  if (config.maxItems && (typeof config.maxItems !== 'number' || config.maxItems < 1 || config.maxItems > 50)) {
    errors.push('maxItemsは1-50の範囲で指定してください');
  }

  if (config.customTheme?.colors) {
    const colorKeys = ['primary', 'secondary', 'background', 'text', 'accent'];
    for (const key of colorKeys) {
      const color = config.customTheme.colors[key];
      if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        errors.push(`${key}の色は有効なHEXカラーコード（#rrggbb）で指定してください`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 共有コンポーネントのパフォーマンス監視
 */
export const trackSharedComponentUsage = (componentType: string, siteSlug: string) => {
  if (typeof window !== 'undefined') {
    console.log(`共有コンポーネント使用: ${componentType} on ${siteSlug}`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
};

/**
 * 共有コンポーネントのエラーレポート
 */
export const reportSharedComponentError = (error: Error, context: any) => {
  console.error('共有コンポーネントエラー:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
  
  // 本番環境では外部のエラー追跡サービスに送信することも可能
  // 例: Sentry, LogRocket, Bugsnag など
};