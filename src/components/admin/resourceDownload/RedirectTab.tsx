import React from 'react';
import { ExternalLink } from 'lucide-react';
import { RedirectSettings } from '../../../types/resourceDownload';

interface RedirectTabProps {
  redirectSettings: RedirectSettings;
  onSettingsChange: (settings: RedirectSettings) => void;
  onSaveSettings: () => void;
}

const RedirectTab: React.FC<RedirectTabProps> = ({ redirectSettings, onSettingsChange, onSaveSettings }) => {
  const handleInputChange = (field: keyof RedirectSettings, value: string | number | boolean) => {
    onSettingsChange({
      ...redirectSettings,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">遷移先設定</h3>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              遷移先URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={redirectSettings.redirectUrl}
                onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/application"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              全ての資料ダウンロード完了後に遷移するページのURLを指定
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              遷移までの待機時間（ミリ秒）
            </label>
            <input
              type="number"
              value={redirectSettings.redirectDelay}
              onChange={(e) => handleInputChange('redirectDelay', parseInt(e.target.value) || 2000)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1000"
              max="15000"
              step="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              完了メッセージ表示から遷移までの時間（推奨: 3000-8000ms）
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={redirectSettings.enableAutoRedirect}
                onChange={(e) => handleInputChange('enableAutoRedirect', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">自動遷移を有効にする</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={redirectSettings.showCompletionMessage}
                onChange={(e) => handleInputChange('showCompletionMessage', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">完了メッセージを表示する</span>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">設定プレビュー</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• 遷移先: {redirectSettings.redirectUrl || '未設定'}</p>
              <p>• 待機時間: {redirectSettings.redirectDelay}ms</p>
              <p>• 自動遷移: {redirectSettings.enableAutoRedirect ? '有効' : '無効'}</p>
              <p>• 完了メッセージ: {redirectSettings.showCompletionMessage ? '表示' : '非表示'}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={onSaveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              設定を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectTab;