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
}

interface ResourceCardProps {
  resource: Resource;
  isDownloaded: boolean;
  isDownloading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onDownload: (resource: Resource) => void;
  onRetry: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isDownloaded,
  isDownloading,
  hasError,
  errorMessage,
  onDownload,
  onRetry
}) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

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
                resource.icon_url ? (
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
                        fallbackIcon.innerHTML = '<FileText className="w-6 h-6 text-blue-600" />';
                        parent.appendChild(fallbackIcon);
                      }
                    }}
                  />
                ) : (
                  <FileText className="w-6 h-6 text-blue-600" />
                )
              )}
            </div>
            <div className="flex-1 min-w-0">
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
              {/* モバイル用の追加説明 */}
              {isMobile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-blue-800 text-xs">
                    📱 モバイル端末では、ダウンロードボタンを押すと新しいタブでファイルが開きます。
                    {isIOS 
                      ? 'ファイルを長押しして「ダウンロード」を選択してください。'
                      : 'ダウンロードフォルダに保存されます。'}
                  </p>
                </div>
              )}
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
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 md:px-6 py-3 rounded-lg transition-all duration-300 font-medium disabled:cursor-not-allowed"
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

export default ResourceCard;