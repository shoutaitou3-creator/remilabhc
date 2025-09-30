import React from 'react';
import { Image } from 'lucide-react';
import { SiteSettings } from '../../../../hooks/useSiteSettings';

interface SeoSettingsSectionProps {
  formData: SiteSettings;
  onInputChange: (field: keyof SiteSettings, value: string | boolean) => void;
}

const SeoSettingsSection: React.FC<SeoSettingsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メタタイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => onInputChange('meta_title', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="検索結果に表示されるタイトル"
          required
        />
        <div className="mt-2 text-sm text-gray-500">
          文字数: {formData.meta_title.length}文字（推奨: 50-60文字）
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メタディスクリプション <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => onInputChange('meta_description', e.target.value)}
          rows={2}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base resize-none"
          placeholder="検索結果に表示される説明文"
          required
        />
        <div className="mt-2 text-sm text-gray-500">
          文字数: {formData.meta_description.length}文字（推奨: 150-160文字）
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Open Graph設定（SNSシェア用）</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OGタイトル
            </label>
            <input
              type="text"
              value={formData.og_title}
              onChange={(e) => onInputChange('og_title', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
              placeholder="SNSでシェアされる際のタイトル"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG説明文
            </label>
            <textarea
              value={formData.og_description}
              onChange={(e) => onInputChange('og_description', e.target.value)}
              rows={2}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base resize-none"
              placeholder="SNSでシェアされる際の説明文"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG画像
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 flex-shrink-0">
                {formData.og_image ? (
                  <img src={formData.og_image} alt="OG画像" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Image className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.og_image}
                  onChange={(e) => onInputChange('og_image', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
                  placeholder="/og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                  SNSでシェアされる際の画像（推奨サイズ: 1200x630px）
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEOプレビュー */}
      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-4">検索結果プレビュー</h4>
        <div className="bg-white p-3 sm:p-4 rounded border">
          <h5 className="text-base sm:text-lg text-blue-600 hover:underline cursor-pointer break-words">
            {formData.meta_title || 'タイトルが入力されていません'}
          </h5>
          <p className="text-green-600 text-sm mt-1">
            https://remilabhc.com
          </p>
          <p className="text-gray-700 text-sm mt-2 break-words">
            {formData.meta_description || '説明文が入力されていません'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeoSettingsSection;