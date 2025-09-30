import React, { useState } from 'react';
import { Globe, Settings } from 'lucide-react';
import SiteSettingsForm from './settings/SiteSettingsForm';

const SiteSettingsManagement: React.FC = () => {
  const [showSiteSettings, setShowSiteSettings] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">サイト設定</h2>
        <p className="text-gray-600">メタデータ・SEO・連絡先情報の管理</p>
        
        {/* 設定を開くボタン */}
        <div className="mt-6">
          <button
            onClick={() => setShowSiteSettings(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Settings className="w-5 h-5" />
            <span>設定を開く</span>
          </button>
        </div>
      </div>

      {/* サイト設定カード */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">サイト設定</h3>
              <p className="text-gray-600">
                サイトの基本情報、SEO設定、連絡先情報、ソーシャルメディア、詳細設定を管理
              </p>
            </div>
          </div>
        </div>

        {/* 設定項目一覧 */}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">基本情報</h4>
            <p className="text-sm text-blue-700">サイトタイトル、説明、キーワード、ファビコン</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">SEO・メタデータ</h4>
            <p className="text-sm text-purple-700">検索エンジン最適化、SNSシェア設定</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">連絡先情報</h4>
            <p className="text-sm text-green-700">会社情報、サービスリンク、連絡先</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="font-medium text-pink-800 mb-2">ソーシャルメディア</h4>
            <p className="text-sm text-pink-700">Instagram、Twitter、Facebook、YouTube</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">詳細設定</h4>
            <p className="text-sm text-orange-700">Analytics、Metaピクセル、アニメーション</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">メンテナンス</h4>
            <p className="text-sm text-red-700">メンテナンスモードの切り替え</p>
          </div>
        </div>
      </div>

      {/* サイト設定フォーム（モーダル） */}
      {showSiteSettings && (
        <SiteSettingsForm
          onClose={() => setShowSiteSettings(false)}
        />
      )}
    </div>
  );
};

export default SiteSettingsManagement;