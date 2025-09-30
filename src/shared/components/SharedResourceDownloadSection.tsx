import React from 'react';
import SharedDownloadHeader from './resourceDownload/SharedDownloadHeader';
import SharedResourceCard from './resourceDownload/SharedResourceCard';
import SharedLoadingState from './resourceDownload/SharedLoadingState';
import SharedErrorState from './resourceDownload/SharedErrorState';
import SharedEmptyResourcesState from './resourceDownload/SharedEmptyResourcesState';
import SharedCompletionDialog from './resourceDownload/SharedCompletionDialog';
import { useSharedResourceDownload } from '../hooks/useSharedResourceDownload';

interface SharedResourceDownloadSectionProps {
  siteSlug?: string;
  maxItems?: number;
  showTitle?: boolean;
  enableAnimation?: boolean;
  className?: string;
  categoryFilter?: string;
  showCompletionDialog?: boolean;
  redirectAfterDownload?: boolean;
  customRedirectUrl?: string;
  customTheme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
    typography?: {
      fontFamily?: string;
    };
  };
}

const SharedResourceDownloadSection: React.FC<SharedResourceDownloadSectionProps> = ({
  siteSlug = 'remila-bhc',
  maxItems,
  showTitle = true,
  enableAnimation = true,
  className = '',
  categoryFilter,
  showCompletionDialog = true,
  redirectAfterDownload = false,
  customRedirectUrl,
  customTheme
}) => {
  const {
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
  } = useSharedResourceDownload({
    siteSlug,
    maxItems,
    categoryFilter,
    customRedirectUrl,
    redirectAfterDownload,
    showCompletionDialog
  });

  // テーマスタイルの適用
  const themeStyles = {
    backgroundColor: customTheme?.colors?.background || '#f8fafc',
    color: customTheme?.colors?.text || '#1f2937',
    fontFamily: customTheme?.typography?.fontFamily || 'Noto Sans JP, sans-serif'
  };

  const animationClass = enableAnimation ? 'transition-all duration-300 ease-out' : '';

  return (
    <section 
      className={`py-12 md:py-20 ${className} ${animationClass}`}
      style={themeStyles}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <SharedDownloadHeader 
            customTheme={customTheme}
          />
        )}

        {/* ローディング表示 */}
        {loading && (
          <SharedLoadingState customTheme={customTheme} />
        )}

        {/* エラー表示 */}
        {error && (
          <SharedErrorState error={error} customTheme={customTheme} />
        )}

        {/* 資料一覧 */}
        <div className="space-y-4 md:space-y-6">
          {resources.map((resource, index) => {
            const isDownloaded = downloadedResources.includes(resource.id);
            const isDownloading = downloadingResources.includes(resource.id);
            const hasError = !!downloadErrors[resource.id];
            
            return (
              <div
                key={resource.id}
                className={`${enableAnimation ? `opacity-0 animate-fadeIn` : ''}`}
                style={{ 
                  animationDelay: enableAnimation ? `${index * 100}ms` : '0ms',
                  animationFillMode: 'forwards'
                }}
              >
                <SharedResourceCard
                  resource={resource}
                  isDownloaded={isDownloaded}
                  isDownloading={isDownloading}
                  hasError={hasError}
                  errorMessage={downloadErrors[resource.id]}
                  onDownload={handleDownload}
                  onRetry={handleRetryDownload}
                  customTheme={customTheme}
                />
              </div>
            );
          })}
        </div>

        {/* 資料がない場合 */}
        {!loading && resources.length === 0 && !error && (
          <SharedEmptyResourcesState customTheme={customTheme} />
        )}

        {/* 完了ダイアログ */}
        <SharedCompletionDialog
          isVisible={showDialog}
          redirectCountdown={redirectCountdown}
          enableAutoRedirect={redirectSettings.enableAutoRedirect}
          onManualRedirect={handleManualRedirect}
          customTheme={customTheme}
        />
      </div>
    </section>
  );
};

export default SharedResourceDownloadSection;