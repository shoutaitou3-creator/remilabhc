import React from 'react';
import { Database, Bell, Shield, Key, Server, Cog } from 'lucide-react';

const OtherSettingsManagement: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">その他設定</h2>
        <p className="text-gray-600">システム全般の設定とメンテナンス機能</p>
      </div>

      {/* 設定カテゴリー */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* データベース設定 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">データベース設定</h4>
              <p className="text-sm text-gray-500">バックアップ・復元設定</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 自動バックアップ設定</p>
            <p>• データ復元機能</p>
            <p>• データベース最適化</p>
          </div>
          <button className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-2 px-4 rounded-lg transition-colors">
            設定を開く（未実装）
          </button>
        </div>

        {/* 通知設定 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">通知設定</h4>
              <p className="text-sm text-gray-500">メール通知・アラート設定</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• エントリー通知</p>
            <p>• システムアラート</p>
            <p>• 定期レポート配信</p>
          </div>
          <button className="mt-4 w-full text-sm text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 py-2 px-4 rounded-lg transition-colors">
            設定を開く（未実装）
          </button>
        </div>

        {/* セキュリティ設定 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">セキュリティ設定</h4>
              <p className="text-sm text-gray-500">アクセス制御・セキュリティ</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• ログイン試行制限</p>
            <p>• IPアドレス制限</p>
            <p>• セッション管理</p>
          </div>
          <button className="mt-4 w-full text-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 py-2 px-4 rounded-lg transition-colors">
            設定を開く（未実装）
          </button>
        </div>

        {/* API設定 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">API設定</h4>
              <p className="text-sm text-gray-500">外部API連携設定</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Instagram API設定</p>
            <p>• 外部サービス連携</p>
            <p>• Webhook設定</p>
          </div>
          <button className="mt-4 w-full text-sm text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 py-2 px-4 rounded-lg transition-colors">
            設定を開く（未実装）
          </button>
        </div>

        {/* システム設定 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">システム設定</h4>
              <p className="text-sm text-gray-500">パフォーマンス・ログ設定</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• キャッシュ設定</p>
            <p>• ログレベル設定</p>
            <p>• パフォーマンス監視</p>
          </div>
          <button className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors">
            設定を開く（未実装）
          </button>
        </div>

        {/* その他の設定 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Cog className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">その他</h4>
              <p className="text-sm text-gray-500">その他のシステム設定</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• ファイル管理設定</p>
            <p>• 言語・地域設定</p>
            <p>• 外観テーマ設定</p>
          </div>
          <button className="mt-4 w-full text-sm text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 py-2 px-4 rounded-lg transition-colors">
            設定を開く（未実装）
          </button>
        </div>
      </div>

      {/* システム情報 */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">システム情報</h4>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">バージョン情報</h5>
            <div className="space-y-1 text-gray-600">
              <p>• システムバージョン: v1.0.0</p>
              <p>• データベースバージョン: v1.2.1</p>
              <p>• 最終更新: 2025年1月15日</p>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">システム状態</h5>
            <div className="space-y-1 text-gray-600">
              <p>• ステータス: <span className="text-green-600 font-medium">正常稼働中</span></p>
              <p>• アップタイム: 99.9%</p>
              <p>• 最終バックアップ: 2025年1月15日 03:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherSettingsManagement;