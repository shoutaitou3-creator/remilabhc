import { useState } from 'react';
import { fetchDownloadFile, logDownloadDebugInfo } from '../../utils/downloadHelpers';

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
}

interface RedirectSettings {
  redirectUrl: string;
  redirectDelay: number;
  showCompletionMessage: boolean;
  enableAutoRedirect: boolean;
}

export const useDownloadLogic = (
  publishedResources: Resource[],
  redirectSettings: RedirectSettings,
  recordDownload: (resourceId: string) => Promise<{ success: boolean; error?: string }>
) => {
  const [downloadedResources, setDownloadedResources] = useState<string[]>([]);
  const [downloadingResources, setDownloadingResources] = useState<string[]>([]);
  const [downloadErrors, setDownloadErrors] = useState<{[key: string]: string}>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  // ダウンロード処理
  const handleDownload = async (resource: Resource) => {
    if (downloadingResources.includes(resource.id)) {
      console.log('ダウンロード処理が既に実行中です');
      return;
    }

    try {
      setDownloadErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[resource.id];
        return newErrors;
      });

      setDownloadingResources(prev => [...prev, resource.id]);
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      console.log('ダウンロード開始:', {
        resourceId: resource.id,
        fileName: resource.file_name,
        fileUrl: resource.file_url,
        isMobile
      });

      try {
        await recordDownload(resource.id);
      } catch (recordError) {
        console.warn('ダウンロード記録の保存に失敗しましたが、ダウンロードは続行します:', recordError);
      }
      
      if (isMobile) {
        setTimeout(() => {
          setDownloadingResources(prev => prev.filter(id => id !== resource.id));
          setDownloadedResources(prev => {
            const newDownloaded = [...prev, resource.id];
            if (newDownloaded.length >= publishedResources.length) {
              setIsCompleted(true);
              handleAllDownloadsCompleted();
            }
            return newDownloaded;
          });
        }, 1000);
      }
      
      const downloadResult = await fetchDownloadFile(
        resource.file_url,
        resource.file_name || 'download',
        {
          onStart: () => console.log('ダウンロード開始:', resource.file_name),
          onProgress: (progress) => console.log(`ダウンロード進捗: ${progress}%`),
          onComplete: () => {
            console.log('ダウンロード完了:', resource.file_name);
            if (!isMobile) {
              setDownloadingResources(prev => prev.filter(id => id !== resource.id));
              setDownloadedResources(prev => {
                const newDownloaded = [...prev, resource.id];
                if (newDownloaded.length >= publishedResources.length) {
                  setIsCompleted(true);
                  handleAllDownloadsCompleted();
                }
                return newDownloaded;
              });
            }
          },
          onError: (error) => {
            console.error('fetch APIダウンロードエラー:', error);
            setDownloadErrors(prev => ({
              ...prev,
              [resource.id]: error
            }));
            setDownloadingResources(prev => prev.filter(id => id !== resource.id));
          },
          maxSize: 100 * 1024 * 1024,
          timeout: 60000
        }
      );
      
      if (!downloadResult.success && downloadResult.error) {
        throw new Error(downloadResult.error);
      }
      
    } catch (err) {
      console.error('ダウンロードエラー:', err);
      logDownloadDebugInfo(resource, err instanceof Error ? err : undefined);
      
      setDownloadErrors(prev => ({
        ...prev,
        [resource.id]: err instanceof Error ? err.message : 'ダウンロードに失敗しました'
      }));
      
      setDownloadingResources(prev => prev.filter(id => id !== resource.id));
    }
  };

  // エラー状態をリセット
  const handleRetryDownload = (resource: Resource) => {
    setDownloadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[resource.id];
      return newErrors;
    });
    handleDownload(resource);
  };

  // 全ダウンロード完了時の処理
  const handleAllDownloadsCompleted = () => {
    console.log('全ダウンロード完了処理開始');
    
    if (redirectSettings.showCompletionMessage) {
      setShowCompletionDialog(true);
      
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
    setShowCompletionDialog(false);
    handleRedirect();
  };

  return {
    downloadedResources,
    downloadingResources,
    downloadErrors,
    isCompleted,
    showCompletionDialog,
    redirectCountdown,
    handleDownload,
    handleRetryDownload,
    handleManualRedirect
  };
};