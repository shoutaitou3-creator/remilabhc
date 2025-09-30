import { PresetTheme, ThemeColors } from '../types/theme';

export const defaultColors: ThemeColors = {
  primary: '#8b5cf6',
  primaryHover: '#7c3aed',
  primaryLight: '#a78bfa',
  primaryDark: '#6d28d9',
  secondary: '#ec4899',
  secondaryHover: '#db2777',
  secondaryLight: '#f472b6',
  secondaryDark: '#be185d',
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  bgAccent: '#f1f5f9',
  bgDark: '#1e293b',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textAccent: '#8b5cf6',
  textLight: '#9ca3af',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

export const presetThemes: PresetTheme[] = [
  {
    id: 'default',
    name: 'デフォルト',
    description: '現在のテーマ',
    colors: defaultColors
  },
  {
    id: 'elegant',
    name: 'エレガント',
    description: '上品で洗練された印象',
    colors: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      primaryLight: '#818cf8',
      primaryDark: '#3730a3',
      secondary: '#8b5cf6',
      secondaryHover: '#7c3aed',
      secondaryLight: '#a78bfa',
      secondaryDark: '#5b21b6',
      bgPrimary: '#fafafa',
      bgSecondary: '#f4f4f5',
      bgAccent: '#e4e4e7',
      bgDark: '#18181b',
      textPrimary: '#09090b',
      textSecondary: '#52525b',
      textAccent: '#6366f1',
      textLight: '#a1a1aa',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#6366f1'
    }
  },
  {
    id: 'modern',
    name: 'モダン',
    description: 'スタイリッシュで現代的',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      primaryLight: '#38bdf8',
      primaryDark: '#0369a1',
      secondary: '#06b6d4',
      secondaryHover: '#0891b2',
      secondaryLight: '#22d3ee',
      secondaryDark: '#0e7490',
      bgPrimary: '#f8fafc',
      bgSecondary: '#f1f5f9',
      bgAccent: '#e2e8f0',
      bgDark: '#0f172a',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textAccent: '#0ea5e9',
      textLight: '#94a3b8',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9'
    }
  },
  {
    id: 'warm',
    name: 'ウォーム',
    description: '温かみのある印象',
    colors: {
      primary: '#f59e0b',
      primaryHover: '#d97706',
      primaryLight: '#fbbf24',
      primaryDark: '#b45309',
      secondary: '#f97316',
      secondaryHover: '#ea580c',
      secondaryLight: '#fb923c',
      secondaryDark: '#c2410c',
      bgPrimary: '#fffbeb',
      bgSecondary: '#fef3c7',
      bgAccent: '#fed7aa',
      bgDark: '#451a03',
      textPrimary: '#451a03',
      textSecondary: '#92400e',
      textAccent: '#f59e0b',
      textLight: '#d97706',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  {
    id: 'dark',
    name: 'ダーク',
    description: 'ダークモード風',
    colors: {
      primary: '#a78bfa',
      primaryHover: '#8b5cf6',
      primaryLight: '#c4b5fd',
      primaryDark: '#7c3aed',
      secondary: '#c084fc',
      secondaryHover: '#a855f7',
      secondaryLight: '#d8b4fe',
      secondaryDark: '#9333ea',
      bgPrimary: '#1e293b',
      bgSecondary: '#334155',
      bgAccent: '#475569',
      bgDark: '#0f172a',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textAccent: '#a78bfa',
      textLight: '#94a3b8',
      success: '#22c55e',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  }
];

export const presetColors: string[] = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#c084fc', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#475569',
  '#374151', '#1f2937', '#111827', '#000000'
];