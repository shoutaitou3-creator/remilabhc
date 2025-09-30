import { ColorCategory } from '../types/theme';

export const colorCategories: ColorCategory[] = [
  {
    id: 'primary',
    label: 'プライマリカラー',
    description: 'メインブランドカラー（ボタン、リンクなど）',
    colors: ['primary', 'primaryHover', 'primaryLight', 'primaryDark']
  },
  {
    id: 'secondary',
    label: 'セカンダリカラー',
    description: 'サブカラー（アクセント、装飾など）',
    colors: ['secondary', 'secondaryHover', 'secondaryLight', 'secondaryDark']
  },
  {
    id: 'background',
    label: '背景色',
    description: 'ページ背景、セクション背景',
    colors: ['bgPrimary', 'bgSecondary', 'bgAccent', 'bgDark']
  },
  {
    id: 'text',
    label: 'テキストカラー',
    description: '見出し、本文、キャプションなど',
    colors: ['textPrimary', 'textSecondary', 'textAccent', 'textLight']
  },
  {
    id: 'status',
    label: 'ステータスカラー',
    description: '成功、警告、エラー表示',
    colors: ['success', 'warning', 'error', 'info']
  }
];