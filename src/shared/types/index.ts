// 共有コンポーネント用の型定義

export interface SharedSectionProps {
  siteSlug: string;
  apiBaseUrl?: string;
  theme?: SharedThemeConfig;
  className?: string;
  showTitle?: boolean;
  maxItems?: number;
  enableAnimation?: boolean;
}

export interface SharedThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      base: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    section: string;
    container: string;
  };
  animation: {
    duration: number;
    easing: string;
  };
}

export interface SharedApiConfig {
  baseUrl: string;
  apiKey?: string;
  siteSlug: string;
}