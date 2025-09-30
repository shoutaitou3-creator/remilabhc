// サイト識別子関連のヘルパー関数

/**
 * URLパラメータからサイトスラッグを取得
 * @returns サイトスラッグ（デフォルト: 'remila-bhc'）
 */
export const getSiteSlugFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('app') || 'remila-bhc';
};

/**
 * 管理ページへのURLを生成
 * @param siteSlug サイトスラッグ（省略時は現在のサイトスラッグを使用）
 * @returns 管理ページのURL
 */
export const getAdminUrl = (siteSlug?: string): string => {
  const currentSiteSlug = siteSlug || getSiteSlugFromUrl();
  
  // 常に現在のオリジンを使用（開発・本番共通）
  const adminBaseUrl = window.location.origin;
  
  console.log('管理URL生成:', { 
    currentOrigin: window.location.origin, 
    siteSlug: currentSiteSlug,
    environment: import.meta.env.DEV ? '開発' : '本番'
  });
    
  return `${adminBaseUrl}?app=${currentSiteSlug}`;
};

/**
 * サイトスラッグからサイト名を生成
 * @param siteSlug サイトスラッグ
 * @returns 表示用のサイト名
 */
export const getSiteDisplayName = (siteSlug: string): string => {
  const siteNames: { [key: string]: string } = {
    'remila-bhc': 'REMILA BHC 2026',
    'remila-lp': 'REMILA LP',
    'resusty-corporate': 'RESUSTY コーポレート',
    'another-contest': 'Another Contest'
  };
  
  return siteNames[siteSlug] || siteSlug.toUpperCase();
};

/**
 * 現在のサイトが管理対象かどうかを判定
 * @param siteSlug サイトスラッグ
 * @returns 管理対象の場合true
 */
export const isManageableSite = (siteSlug: string): boolean => {
  const manageableSites = [
    'remila-bhc',
    'remila-lp', 
    'resusty-corporate',
    'another-contest'
  ];
  
  return manageableSites.includes(siteSlug);
};

/**
 * サイトスラッグのバリデーション
 * @param siteSlug サイトスラッグ
 * @returns バリデーション結果
 */
export const validateSiteSlug = (siteSlug: string): { isValid: boolean; error?: string } => {
  if (!siteSlug || siteSlug.trim() === '') {
    return { isValid: false, error: 'サイトスラッグは必須です' };
  }
  
  if (!/^[a-z0-9-]+$/.test(siteSlug)) {
    return { isValid: false, error: 'サイトスラッグは英小文字、数字、ハイフンのみ使用可能です' };
  }
  
  if (siteSlug.length < 3 || siteSlug.length > 50) {
    return { isValid: false, error: 'サイトスラッグは3文字以上50文字以下で入力してください' };
  }
  
  return { isValid: true };
};