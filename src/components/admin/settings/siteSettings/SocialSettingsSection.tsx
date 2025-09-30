import React from 'react';
import { SiteSettings } from '../../../../hooks/useSiteSettings';

interface SocialSettingsSectionProps {
  formData: SiteSettings;
  onInputChange: (field: keyof SiteSettings, value: string | boolean) => void;
}

const SocialSettingsSection: React.FC<SocialSettingsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instagram URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={formData.instagram_url}
          onChange={(e) => onInputChange('instagram_url', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="https://www.instagram.com/remila_bhc/"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Twitter URL
        </label>
        <input
          type="url"
          value={formData.twitter_url}
          onChange={(e) => onInputChange('twitter_url', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="https://twitter.com/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facebook URL
        </label>
        <input
          type="url"
          value={formData.facebook_url}
          onChange={(e) => onInputChange('facebook_url', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="https://facebook.com/page"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          YouTube URL
        </label>
        <input
          type="url"
          value={formData.youtube_url}
          onChange={(e) => onInputChange('youtube_url', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="https://youtube.com/channel/..."
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">ソーシャルメディア連携について</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          設定されたURLは、サイトのフッターやヘッダーのソーシャルメディアリンクとして使用されます。
          Instagramは特にコンテストのエントリー用として重要です。
        </p>
      </div>
    </div>
  );
};

export default SocialSettingsSection;