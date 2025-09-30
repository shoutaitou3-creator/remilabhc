export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  secondaryDark: string;
  bgPrimary: string;
  bgSecondary: string;
  bgAccent: string;
  bgDark: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  textLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ColorCategory {
  id: string;
  label: string;
  description: string;
  colors: string[];
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
}

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';