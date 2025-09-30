import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { SiteSettings } from '../../../../hooks/useSiteSettings';

interface ContactSettingsSectionProps {
  formData: SiteSettings;
  onInputChange: (field: keyof SiteSettings, value: string | boolean) => void;
}

const ContactSettingsSection: React.FC<ContactSettingsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          会社名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.company_name}
          onChange={(e) => onInputChange('company_name', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="株式会社○○"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          会社URL
        </label>
        <input
          type="url"
          value={formData.company_url}
          onChange={(e) => onInputChange('company_url', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="https://example.com"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">サービスサイトリンク設定</h4>
        <p className="text-sm text-gray-600 mb-4">
          フッターに表示される追加のサービスサイトリンクを設定できます
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サービス名
            </label>
            <input
              type="text"
              value={formData.service_name}
              onChange={(e) => onInputChange('service_name', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
              placeholder="レミラ"
            />
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              フッターに表示されるリンクテキストになります
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サービスURL
            </label>
            <input
              type="url"
              value={formData.service_url}
              onChange={(e) => onInputChange('service_url', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
              placeholder="https://remila.jp/"
            />
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              サービスサイトのURLを入力してください
            </p>
          </div>

          {/* プレビュー */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-2">フッター表示プレビュー</h5>
            <div className="bg-gray-800 text-gray-400 p-2 sm:p-3 rounded text-xs sm:text-sm">
              <div className="space-y-1">
                <div>
                  主催：
                  <span className="text-purple-400 ml-1">
                    {formData.company_name || '株式会社○○'}
                  </span>
                </div>
                {formData.service_name && formData.service_url && (
                  <div>
                    サービス：
                    <span className="text-purple-400 ml-1">
                      {formData.service_name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {(!formData.service_name || !formData.service_url) && (
              <p className="text-xs text-gray-500 mt-2">
                サービス名とURLの両方を入力すると、フッターにサービスリンクが表示されます
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          電話番号 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => onInputChange('contact_phone', e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
            placeholder="03-0000-0000"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => onInputChange('contact_email', e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
            placeholder="info@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          住所 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            value={formData.contact_address}
            onChange={(e) => onInputChange('contact_address', e.target.value)}
            rows={2}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base resize-none"
            placeholder="〒000-0000 都道府県市区町村..."
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSettingsSection;