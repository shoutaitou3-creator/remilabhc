// 部門表示名を取得するヘルパー関数
export const getDepartmentDisplayName = (
  department: string, 
  allowEither: boolean = true
): string => {
  switch (department) {
    case 'both':
      return '【クリエイティブ部門】【リアリティー部門】それぞれ';
    case 'creative':
      return '【クリエイティブ部門】';
    case 'reality':
      return '【リアリティー部門】';
    case 'either':
      return allowEither ? '【クリエイティブ部門】【リアリティー部門】どちらか' : '';
    default:
      return '';
  }
};