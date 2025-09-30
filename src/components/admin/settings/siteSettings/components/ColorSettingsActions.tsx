import React from 'react';
import { RefreshCw, Eye, Check, AlertCircle } from 'lucide-react';

interface ColorSettingsActionsProps {
  hasUnsavedChanges: boolean;
  onResetChanges: () => void;
  onSavePreview: () => void;
  onApplyToProduction: () => void;
}

const ColorSettingsActions: React.FC<ColorSettingsActionsProps> = ({
  hasUnsavedChanges,
  onResetChanges,
  onSavePreview,
  onApplyToProduction
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
      <div className="flex flex-col space-y-4">
        {/* 上部：クイックアクション */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={onResetChanges}
              disabled={!hasUnsavedChanges}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>変更をリセット</span>
            </button>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white min-h-[44px]">
              <Eye className="w-4 h-4" />
              <span>フルスクリーンプレビュー</span>
            </button>
          </div>
          
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 text-amber-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>未保存の変更があります</span>
            </div>
          )}
        </div>

        {/* 下部：メインアクション */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onSavePreview}
            disabled={!hasUnsavedChanges}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:cursor-not-allowed min-h-[44px]"
          >
            <Eye className="w-4 h-4" />
            <span>プレビューのみ保存</span>
          </button>
          <button
            onClick={onApplyToProduction}
            disabled={!hasUnsavedChanges}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:cursor-not-allowed min-h-[44px]"
          >
            <Check className="w-4 h-4" />
            <span>本番環境に適用</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorSettingsActions;