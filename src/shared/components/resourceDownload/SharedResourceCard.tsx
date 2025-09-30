import React from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';

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

interface SharedResourceCardProps {
  resource: Resource;
  isDownloaded: boolean;
  isDownloading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onDownload: (resource: Resource) => void;
  onRetry: (resource: Resource) => void;
  customTheme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
  };
}

const SharedResourceCard: React.FC<SharedResourceCardProps> = ({
  resource,
  isDownloaded,
  isDownloading,
  hasError,
  errorMessage,
  onDownload,
  onRetry,
  customTheme
}) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
        hasError
          ? 'border-red-200 bg-red-50'
          : isDownloaded 
          ? 'border-green-200 bg-green-50' 
          : isDownloading
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
              hasError 
                ? 'bg-red-100' 
                : isDownloaded 
                ? 'bg-green-100' 
                : isDownloading 
                ? 'bg-blue-100' 
                : 'bg-blue-50'
            }`}>
              {hasError ? (
                <div className="text-red-600 text-xs font-bold">!</div>
              ) : isDownloaded ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : isDownloading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                resource.icon_url && resource.icon_url.trim() !== '' ? (
                  <img
                    src={resource.icon_url}
                    alt="カスタムアイコン"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallbackIcon = document.createElement('div');
                        fallbackIcon.innerHTML = '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
                        parent.appendChild(fallbackIcon);
                      }
                    }}
                  />
                ) : (
                  <FileText className="w-6 h-6 text-blue-600" />
                )
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-3">
                {resource.description}
              </p>
              {hasError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <p className="text-red-800 text-sm font-medium mb-2">ダウンロードエラー</p>
                  <p className="text-red-700 text-xs">{errorMessage}</p>
                </div>
              )}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>ファイル: {resource.file_name}</span>
                <span>サイズ: {formatFileSize(resource.file_size)}</span>
                {resource.icon_url && resource.icon_url.trim() !== '' && (
                  <span className="text-blue-600">カスタムアイコン</span>
                )}
                {resource.category && (
                  <span 
                    className="px-2 py-1 rounded text-white"
                    style={{ backgroundColor: resource.category.color }}
                  >
                    {resource.category.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {hasError ? (
              <button
                onClick={() => onRetry(resource)}
                disabled={isDownloading}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 md:px-6 py-3 rounded-lg transition-all duration-300 font-medium disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>再試行</span>
              </button>
            ) : isDownloaded ? (
              <div className="w-full md:w-auto flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">ダウンロード済み</span>
              </div>
            ) : isDownloading ? (
              <div className="w-full md:w-auto flex items-center justify-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="font-medium">ダウンロード中...</span>
              </div>
            ) : (
              <button
                onClick={() => onDownload(resource)}
                disabled={isDownloading}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 disabled:bg-gray-400 text-white px-4 md:px-6 py-3 rounded-lg transition-all duration-300 font-medium disabled:cursor-not-allowed"
                style={{
                  background: customTheme?.colors?.primary 
                    ? `linear-gradient(to right, ${customTheme.colors.primary}, ${customTheme.colors.secondary || customTheme.colors.primary})`
                    : undefined
                }}
              >
                <Download className="w-4 h-4" />
                <span>ダウンロード</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedResourceCard;