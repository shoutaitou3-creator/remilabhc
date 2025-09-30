// 共有セクション用のカスタムフック
import { useState, useEffect } from 'react';
import SharedApiClient from '../api/SharedApiClient';
import { SharedThemeConfig } from '../types';

interface UseSharedSectionOptions {
  siteSlug: string;
  apiBaseUrl?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useSharedSection = (options: UseSharedSectionOptions) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [theme, setTheme] = useState<SharedThemeConfig | null>(null);
  
  const { siteSlug, apiBaseUrl, autoRefresh = false, refreshInterval = 300000 } = options;
  const apiClient = new SharedApiClient(siteSlug, apiBaseUrl);

  // サイト設定とテーマを取得
  const fetchSiteSettings = async () => {
    try {
      const result = await apiClient.getSiteSettings();
      
      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        // サイト設定からテーマ設定を構築
        const themeConfig: SharedThemeConfig = {
          colors: {
            primary: '#8b5cf6',
            secondary: '#ec4899',
            background: '#ffffff',
            text: '#1f2937',
            accent: '#f1f5f9'
          },
          typography: {
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: {
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem'
            }
          },
          spacing: {
            section: '3rem',
            container: '1rem'
          },
          animation: {
            duration: result.data.animation_duration || 560,
            easing: 'ease-out'
          }
        };

        setTheme(themeConfig);
      }
    } catch (err) {
      setError('設定の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();

    // 自動更新の設定
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchSiteSettings, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [siteSlug, autoRefresh, refreshInterval]);

  return {
    loading,
    error,
    theme,
    apiClient,
    refetch: fetchSiteSettings
  };
};