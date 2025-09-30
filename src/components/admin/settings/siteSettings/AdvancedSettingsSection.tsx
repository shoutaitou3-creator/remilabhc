import React from 'react';
import { SiteSettings } from '../../../../hooks/useSiteSettings';

interface AdvancedSettingsSectionProps {
  formData: SiteSettings;
  onInputChange: (field: keyof SiteSettings, value: string | boolean | number) => void;
}

const AdvancedSettingsSection: React.FC<AdvancedSettingsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Analytics ID
        </label>
        <input
          type="text"
          value={formData.analytics_id}
          onChange={(e) => onInputChange('analytics_id', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="G-XXXXXXXXXX"
        />
        <p className="text-xs text-gray-500 mt-1">
          Google AnalyticsのトラッキングIDを入力してサイト訪問者の分析を行います
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta ピクセル ID
        </label>
        <input
          type="text"
          value={formData.meta_pixel_id}
          onChange={(e) => onInputChange('meta_pixel_id', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="123456789012345"
        />
        <p className="text-xs text-gray-500 mt-1">
          Facebook/Instagram広告の効果測定とコンバージョン追跡用のピクセルIDを入力
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メンテナンスモード</label>
            <p className="text-xs text-gray-500">
              サイトメンテナンス時に一般ユーザーのアクセスを制限します（管理者は引き続きアクセス可能）
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              formData.maintenance_mode 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {formData.maintenance_mode ? 'メンテナンス中' : '通常運用中'}
            </span>
            <button
              type="button"
              onClick={() => onInputChange('maintenance_mode', !formData.maintenance_mode)}
              className={`px-3 sm:px-4 py-3 rounded-lg text-sm transition-colors min-h-[44px] ${
                formData.maintenance_mode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {formData.maintenance_mode ? '通常運用に戻す' : 'メンテナンスモードにする'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">注意事項</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Google Analytics IDを設定すると、サイト訪問者数やページビューなどの詳細な分析データを取得できます</li>
          <li>• Meta ピクセル IDを設定すると、Facebook/Instagram広告のコンバージョン追跡と効果測定が可能になります</li>
          <li>• メンテナンスモードは重要なシステム更新時のみ使用し、作業完了後は必ず通常運用に戻してください</li>
          <li>• これらの設定は即座に反映されるため、慎重に設定してください</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedSettingsSection;