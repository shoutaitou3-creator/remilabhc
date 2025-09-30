export const getColorLabel = (colorKey: string): string => {
  const labels: { [key: string]: string } = {
    primary: 'プライマリ',
    primaryHover: 'プライマリ（ホバー）',
    primaryLight: 'プライマリ（明）',
    primaryDark: 'プライマリ（暗）',
    secondary: 'セカンダリ',
    secondaryHover: 'セカンダリ（ホバー）',
    secondaryLight: 'セカンダリ（明）',
    secondaryDark: 'セカンダリ（暗）',
    bgPrimary: 'メイン背景',
    bgSecondary: 'サブ背景',
    bgAccent: 'アクセント背景',
    bgDark: 'ダーク背景',
    textPrimary: 'メインテキスト',
    textSecondary: 'サブテキスト',
    textAccent: 'アクセントテキスト',
    textLight: 'ライトテキスト',
    success: '成功',
    warning: '警告',
    error: 'エラー',
    info: '情報'
  };
  return labels[colorKey] || colorKey;
};

export const getColorUsageExample = (colorKey: string): string => {
  const examples: { [key: string]: string } = {
    primary: 'メインボタン、リンク',
    primaryHover: 'ボタンホバー時',
    primaryLight: 'ライトボタン',
    primaryDark: 'ダークボタン',
    secondary: 'アクセントボタン',
    secondaryHover: 'アクセントホバー',
    bgPrimary: 'ページ背景',
    bgSecondary: 'セクション背景',
    bgAccent: 'カード背景',
    bgDark: 'フッター背景',
    textPrimary: '見出し、重要テキスト',
    textSecondary: '本文、説明文',
    textAccent: 'リンクテキスト',
    textLight: 'キャプション',
    success: '成功メッセージ',
    warning: '注意メッセージ',
    error: 'エラーメッセージ',
    info: '情報メッセージ'
  };
  return examples[colorKey] || '装飾要素';
};

export const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
};