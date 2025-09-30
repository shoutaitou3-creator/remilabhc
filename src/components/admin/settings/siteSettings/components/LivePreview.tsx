import React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { ThemeColors, PreviewDevice } from '../../../../../types/theme';

interface LivePreviewProps {
  currentColors: ThemeColors;
  previewDevice: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  currentColors,
  previewDevice,
  onDeviceChange
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">ライブプレビュー</h3>
            <p className="text-sm text-gray-600">変更内容をリアルタイムで確認</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden sm:block">表示:</span>
            <button
              onClick={() => onDeviceChange('desktop')}
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                previewDevice === 'desktop' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="デスクトップ表示"
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDeviceChange('tablet')}
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                previewDevice === 'tablet' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="タブレット表示"
            >
              <Tablet className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDeviceChange('mobile')}
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                previewDevice === 'mobile' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="モバイル表示"
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className={`mx-auto border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 ${
          previewDevice === 'desktop' ? 'max-w-4xl' :
          previewDevice === 'tablet' ? 'max-w-2xl' :
          'max-w-sm'
        }`}>
          {/* プレビューコンテンツ */}
          <div style={{ backgroundColor: currentColors.bgPrimary }}>
            {/* ヘッダープレビュー */}
            <div className="border-b border-gray-200 p-4" style={{ backgroundColor: currentColors.bgPrimary }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: currentColors.primary }}
                  ></div>
                  <span className="font-bold" style={{ color: currentColors.textPrimary }}>
                    REMILA BHC
                  </span>
                </div>
                <button 
                  className="px-4 py-2 rounded-full text-sm font-medium text-white"
                  style={{ 
                    background: `linear-gradient(to right, ${currentColors.secondary}, ${currentColors.primary})`
                  }}
                >
                  エントリー受付中
                </button>
              </div>
            </div>

            {/* ヒーローセクションプレビュー */}
            <div 
              className="p-8 text-center"
              style={{ 
                background: `linear-gradient(to bottom right, ${currentColors.bgSecondary}, ${currentColors.bgAccent})`
              }}
            >
              <h1 className="text-2xl font-bold mb-2" style={{ color: currentColors.textPrimary }}>
                REMILA Back Style Hair Contest 2026
              </h1>
              <p className="mb-4" style={{ color: currentColors.textSecondary }}>
                業界初のバックスタイル特化ヘアコンテスト
              </p>
              <button 
                className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
                style={{ 
                  background: `linear-gradient(to right, ${currentColors.secondary}, ${currentColors.primary})`
                }}
              >
                エントリーする
              </button>
            </div>

            {/* コンテンツセクションプレビュー */}
            <div className="p-6 space-y-4">
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: `${currentColors.info}15`,
                  borderLeft: `4px solid ${currentColors.info}`
                }}
              >
                <h3 className="font-bold mb-2" style={{ color: currentColors.info }}>
                  コンテスト概要
                </h3>
                <p className="text-sm" style={{ color: currentColors.textSecondary }}>
                  総額1000万円超の賞金・賞品
                </p>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: `${currentColors.primary}15`,
                  borderLeft: `4px solid ${currentColors.primary}`
                }}
              >
                <h3 className="font-bold mb-2" style={{ color: currentColors.primary }}>
                  審査員
                </h3>
                <p className="text-sm" style={{ color: currentColors.textSecondary }}>
                  業界トップスタイリストが厳正審査
                </p>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: `${currentColors.success}15`,
                  borderLeft: `4px solid ${currentColors.success}`
                }}
              >
                <h3 className="font-bold mb-2" style={{ color: currentColors.success }}>
                  応募方法
                </h3>
                <p className="text-sm" style={{ color: currentColors.textSecondary }}>
                  Instagramで簡単エントリー
                </p>
              </div>

              {/* ステータス表示例 */}
              <div className="grid grid-cols-2 gap-2">
                <div 
                  className="p-2 rounded text-xs text-center font-medium"
                  style={{ 
                    backgroundColor: `${currentColors.success}20`,
                    color: currentColors.success
                  }}
                >
                  成功メッセージ
                </div>
                <div 
                  className="p-2 rounded text-xs text-center font-medium"
                  style={{ 
                    backgroundColor: `${currentColors.warning}20`,
                    color: currentColors.warning
                  }}
                >
                  警告メッセージ
                </div>
              </div>
            </div>

            {/* フッタープレビュー */}
            <div 
              className="p-4 text-center"
              style={{ backgroundColor: currentColors.bgDark }}
            >
              <p className="text-sm" style={{ color: currentColors.textLight }}>
                © 2026 REMILA BHC. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;