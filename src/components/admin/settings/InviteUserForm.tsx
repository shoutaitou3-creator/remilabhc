import React, { useState } from 'react';
import { X, Mail, Lock, UserPlus, Shield, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  permissions: {
    dashboard: boolean;
    kpi: boolean;
    news: boolean;
    workExamples: boolean;
    faq: boolean;
    judges: boolean;
    sponsors: boolean;
    prizes: boolean;
    settings: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

interface InviteUserFormProps {
  onClose: () => void;
  onInvite: (userData: {
    email: string;
    password: string;
    role: 'admin' | 'editor';
    permissions: UserProfile['permissions'];
  }) => void;
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({ onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'editor',
    permissions: {
      dashboard: true,
      kpi: false,
      news: false,
      workExamples: false,
      faq: false,
      judges: false,
      sponsors: false,
      prizes: false,
      settings: false
    }
  });

  const menuItems = [
    { key: 'dashboard', label: 'ダッシュボード', description: '統計情報の閲覧' },
    { key: 'kpi', label: 'KPI管理', description: 'KPI目標設定・進捗管理' },
    { key: 'news', label: 'お知らせ管理', description: '新着情報・プレスリリースの管理' },
    { key: 'workExamples', label: '作品例管理', description: '作品例の追加・編集・公開管理' },
    { key: 'faq', label: 'FAQ管理', description: 'よくある質問の管理' },
    { key: 'judges', label: '審査員管理', description: '審査員情報の編集・管理' },
    { key: 'sponsors', label: '協賛企業管理', description: '協賛企業情報の編集・管理' },
    { key: 'prizes', label: '賞金賞品管理', description: '賞金・賞品情報の編集・管理' },
    { key: 'settings', label: '設定', description: 'システム設定・ユーザー管理' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
  };

  const handlePermissionChange = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: checked
      }
    }));
  };

  const handleRoleChange = (role: 'admin' | 'editor') => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: role === 'admin' ? {
        dashboard: true,
        kpi: true,
        news: true,
        workExamples: true,
        faq: true,
        judges: true,
        sponsors: true,
        prizes: true,
        settings: true
      } : {
        dashboard: true,
        kpi: false,
        news: false,
        workExamples: false,
        faq: false,
        judges: false,
        sponsors: false,
        prizes: false,
        settings: false
      }
    }));
  };

  const selectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: Object.keys(prev.permissions).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as typeof prev.permissions)
    }));
  };

  const clearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: Object.keys(prev.permissions).reduce((acc, key) => ({
        ...acc,
        [key]: key === 'dashboard' // ダッシュボードは常に有効
      }), {} as typeof prev.permissions)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">新しいユーザーを招待</h2>
              <p className="text-sm text-gray-600">システムへのアクセス権限を設定してユーザーを招待します</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 左側：基本情報 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  初期パスワード <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                    placeholder="初期パスワードを設定"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ユーザーは初回ログイン後にパスワード変更を求められます
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ユーザー権限 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={() => handleRoleChange('admin')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900">管理者</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="editor"
                        checked={formData.role === 'editor'}
                        onChange={() => handleRoleChange('editor')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900">編集者</span>
                    </label>
                  </div>
                  <div className="text-xs text-gray-500">
                    管理者：全機能へのアクセス権限 / 編集者：個別に権限を設定
                  </div>
                </div>
              </div>

              {/* パスワード変更に関する注意事項 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">パスワード変更について</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      ユーザーがパスワードを変更する際は、メールアドレス宛に認証メールが送信されます。
                      メール内のリンクをクリックして認証を完了する必要があります。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：メニュー権限設定 */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    アクセス可能メニュー
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      すべて選択
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPermissions}
                      className="text-xs text-gray-600 hover:text-gray-800 underline"
                    >
                      すべて解除
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {menuItems.map((item) => (
                    <div key={item.key} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`permission-${item.key}`}
                        checked={formData.permissions[item.key as keyof typeof formData.permissions]}
                        onChange={(e) => handlePermissionChange(item.key, e.target.checked)}
                        disabled={item.key === 'dashboard'} // ダッシュボードは常に有効
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`permission-${item.key}`}
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {item.label}
                          {item.key === 'dashboard' && (
                            <span className="text-xs text-gray-500 ml-2">(必須)</span>
                          )}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  選択されたメニュー: {Object.values(formData.permissions).filter(Boolean).length}個
                </div>
              </div>

              {/* 権限プレビュー */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">権限プレビュー</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      formData.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {formData.role === 'admin' ? '管理者' : '編集者'}
                    </span>
                    <span className="text-xs text-gray-600">
                      {Object.values(formData.permissions).filter(Boolean).length}個のメニューにアクセス可能
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    アクセス可能: {menuItems
                      .filter(item => formData.permissions[item.key as keyof typeof formData.permissions])
                      .map(item => item.label)
                      .join('、')
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* フォームアクション */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>ユーザーを招待</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserForm;