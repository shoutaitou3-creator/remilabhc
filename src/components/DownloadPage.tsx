import React from 'react';
import { useResourceDownload } from '../hooks/useResourceDownload';
import DownloadHeader from './download/DownloadHeader';
import ResourceCard from './download/ResourceCard';
import ContactLink from './download/ContactLink';
import CompletionDialog from './download/CompletionDialog';
import DownloadFooter from './download/DownloadFooter';
import DownloadDebugInfo from './DownloadDebugInfo';
import { useDownloadLogic } from './download/useDownloadLogic';

const DownloadPage = () => {
  const { resources, loading, error, recordDownload, redirectSettings } = useResourceDownload();
  
  // 公開されている資料のみをフィルタリング
  const publishedResources = resources.filter(resource => resource.is_published);

  const {
    downloadedResources,
    downloadingResources,
    downloadErrors,
    isCompleted,
    showCompletionDialog,
    redirectCountdown,
    handleDownload,
    handleRetryDownload,
    handleManualRedirect
  } = useDownloadLogic(publishedResources, redirectSettings, recordDownload);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">資料を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
      {/* メインコンテンツ */}
      <main className="flex-1">
        {/* 上部セクション：ヘッダーと資料ダウンロード */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <DownloadHeader />

            {/* 資料一覧 */}
            <div className="space-y-4 md:space-y-6">
              {publishedResources.map((resource) => {
                const isDownloaded = downloadedResources.includes(resource.id);
                const isDownloading = downloadingResources.includes(resource.id);
                const hasError = !!downloadErrors[resource.id];
                
                return (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isDownloaded={isDownloaded}
                    isDownloading={isDownloading}
                    hasError={hasError}
                    errorMessage={downloadErrors[resource.id]}
                    onDownload={handleDownload}
                    onRetry={handleRetryDownload}
                  />
                );
              })}
            </div>

            {/* 資料がない場合 */}
            {publishedResources.length === 0 && <EmptyResourcesState />}

            <ContactLink />
          </div>
        </section>

      </main>

      <DownloadFooter />

      {/* ダウンロード完了メッセージ */}
      <CompletionDialog
        isVisible={isCompleted && redirectSettings.showCompletionMessage}
        redirectCountdown={redirectCountdown}
        enableAutoRedirect={redirectSettings.enableAutoRedirect}
        onManualRedirect={handleManualRedirect}
      />

      {/* 完了ダイアログ */}
      {showCompletionDialog && (
        <CompletionDialog
          isVisible={showCompletionDialog}
          redirectCountdown={redirectCountdown}
          enableAutoRedirect={redirectSettings.enableAutoRedirect}
          onManualRedirect={handleManualRedirect}
        />
      )}
    </div>
  );
};

export default DownloadPage;