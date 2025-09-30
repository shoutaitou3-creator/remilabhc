import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { fetchDownloadFile } from '../../utils/downloadHelpers';

interface Resource {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_size: number;
  file_url: string;
  file_type: string;
  is_published: boolean;
  download_count: number;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

interface RedirectSettings {
  redirectUrl: string;
  redirectDelay: number;
  showCompletionMessage: boolean;
  enableAutoRedirect: boolean;
}

interface UseSharedResourceDownloadOptions {
  siteSlug: string;
  maxItems?: number;
  categoryFilter?: string;
  customRedirectUrl?: string;
  redirectAfterDownload?: boolean;
  showCompletionDialog?: boolean;
}

export const useSharedResourceDownload = (options: UseSharedResourceDownloadOptions) => {
  const {
    siteSlug,
    maxItems,
    categoryFilter,
    customRedirectUrl,
    redirectAfterDownload = false,
    showCompletionDialog = true
  } = options;

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [downloadedResources, setDownloadedResources] = useState<string[]>([]);
  const [downloadingResources, setDownloadingResources] = useState<string[]>([]);
  const [downloadErrors, setDownloadErrors] = useState<{[key: string]: string}>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  const [redirectSettings] = useState<RedirectSettings>({
    redirectUrl: customRedirectUrl || 'https://remila.jp/',
    redirectDelay: 3000,
    showCompletionMessage: showCompletionDialog,
    enableAutoRedirect: redirectAfterDownload
  });

  // 資料データを取得
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError('');

      let query = supabase
        .from('resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (maxItems) {
        query = query.limit(maxItems);
      }

      if (categoryFilter) {
        query = query.eq('category.slug', categoryFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('共有資料データ取得エラー:', error);
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      console.log('共有資料データ取得成功:', {
        count: data?.length || 0,
        siteSlug,
        categoryFilter
      });

      setResources(data || []);
    } catch (err) {
      console.error('共有資料データ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // ダウンロード記録
  const recordDownload = async (resourceId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('resource_downloads')
        .insert({
          resource_id: resourceId,
          ip_address: 'unknown',
          user_agent: navigator.userAgent
        });

      if (error) {
        console.warn('ダウンロード記録エラー:', error);
        return { success: true }; // エラーでもダウンロードは続行
      }

      return { success: true };
    } catch (err) {
      console.warn('ダウンロード記録処理エラー:', err);
      return { success: true }; // エラーでもダウンロードは続行
    }
  };

  // ダウンロード処理
  const handleDownload = async (resource: Resource) => {
    if (downloadingResources.includes(resource.id)) return;

    try {
      setDownloadErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[resource.id];
        return newErrors;
      });

      setDownloadingResources(prev => [...prev, resource.id]);
      
      console.log('共有コンポーネント - ダウンロード開始:', {
        resourceId: resource.id,
        fileName: resource.file_name,
        siteSlug
      });

      await recordDownload(resource.id);
      
      const downloadResult = await fetchDownloadFile(
        resource.file_url,
        resource.file_name || 'download',
        {
          onComplete: () => {
            setDownloadingResources(prev => prev.filter(id => id !== resource.id));
            setDownloadedResources(prev => {
              const newDownloaded = [...prev, resource.id];
              if (newDownloaded.length >= resources.length) {
                setIsCompleted(true);
                handleAllDownloadsCompleted();
              }
              return newDownloaded;
            });
          },
          onError: (error) => {
            setDownloadErrors(prev => ({
              ...prev,
              [resource.id]: error
            }));
            setDownloadingResources(prev => prev.filter(id => id !== resource.id));
          }
        }
      );
      
      if (!downloadResult.success && downloadResult.error) {
        throw new Error(downloadResult.error);
      }
      
    } catch (err) {
      console.error('共有コンポーネント - ダウンロードエラー:', err);
      setDownloadErrors(prev => ({
        ...prev,
        [resource.id]: err instanceof Error ? err.message : 'ダウンロードに失敗しました'
      }));
      setDownloadingResources(prev => prev.filter(id => id !== resource.id));
    }
  };

  // 全ダウンロード完了処理
  const handleAllDownloadsCompleted = () => {
    if (redirectSettings.showCompletionMessage) {
      setShowDialog(true);
      
      if (redirectSettings.enableAutoRedirect) {
        const countdownSeconds = Math.ceil(redirectSettings.redirectDelay / 1000);
        setRedirectCountdown(countdownSeconds);
        
        const countdownInterval = setInterval(() => {
          setRedirectCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              handleRedirect();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else if (redirectSettings.enableAutoRedirect) {
      setTimeout(() => {
        handleRedirect();
      }, redirectSettings.redirectDelay);
    }
  };

  // 遷移処理
  const handleRedirect = () => {
    if (redirectSettings.redirectUrl) {
      window.location.href = redirectSettings.redirectUrl;
    }
  };

  // 手動遷移
  const handleManualRedirect = () => {
    setShowDialog(false);
    handleRedirect();
  };

  // エラー再試行
  const handleRetryDownload = (resource: Resource) => {
    setDownloadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[resource.id];
      return newErrors;
    });
    handleDownload(resource);
  };

  useEffect(() => {
    fetchResources();

    // リアルタイム更新の設定
    const subscription = supabase
      .channel('shared-resources-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'resources' 
        }, 
        () => {
          console.log('資料データが更新されました。再取得します。');
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [siteSlug, maxItems, categoryFilter]);

  return {
    resources,
    loading,
    error,
    downloadedResources,
    downloadingResources,
    downloadErrors,
    isCompleted,
    showDialog,
    redirectCountdown,
    redirectSettings,
    handleDownload,
    handleRetryDownload,
    handleManualRedirect
  };
};