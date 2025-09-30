import React, { useState } from 'react';
import { X, Mail, Shield, Save, AlertCircle, Key } from 'lucide-react';

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

interface EditUserFormProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (userData: UserProfile) => void;
  onSendPasswordReset: (email: string) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose, onSave, onSendPasswordReset }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });

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
    onSave(formData);
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
      } : prev.permissions
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理者';
      case 'editor':
        return '編集者';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isMainAdmin = user.email === 'admin@remilabhc.com';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">ユーザー権限編集</h2>
              <p className="text-sm text-gray-600">{user.email} の権限を編集します</p>
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
            {/* 左側：ユーザー情報 */}
            <div className="space-y-6">
              {/* ユーザー基本情報 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">ユーザー情報</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 font-medium">{user.email}</span>
                    {isMainAdmin && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        メイン管理者
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    登録日: {new Date(user.createdAt).toLocaleDateString()}
                    登録日: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    最終ログイン: {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : '未ログイン'}
                  </div>
                </div>
              </div>

              {/* 権限レベル設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ユーザー権限
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
                        disabled={isMainAdmin}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 disabled:opacity-50"
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
                        disabled={isMainAdmin}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 disabled:opacity-50"
                      />
                      <span className="text-sm font-medium text-gray-900">編集者</span>
                    </label>
                  </div>
                  {isMainAdmin && (
                    <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                      メイン管理者の権限は変更できません
                    </div>
                  )}
                </div>
              </div>

              {/* パスワードリセット */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Key className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">パスワードリセット</h4>
                    <p className="text-xs text-yellow-700 mb-3">
                      ユーザーのパスワードをリセットする場合は、メール認証が必要です。
                      リセットメールがユーザーのメールアドレスに送信されます。
                    </p>
                    <button
                      type="button"
                      onClick={() => onSendPasswordReset(user.email)}
                      className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded transition-colors"
                    >
                      パスワードリセットメールを送信
                    </button>
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
                  {!isMainAdmin && (
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
                  )}
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {menuItems.map((item) => (
                    <div key={item.key} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`edit-permission-${item.key}`}
                        checked={formData.permissions[item.key as keyof typeof formData.permissions]}
                        onChange={(e) => handlePermissionChange(item.key, e.target.checked)}
                        disabled={item.key === 'dashboard' || isMainAdmin}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1 disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`edit-permission-${item.key}`}
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

                {isMainAdmin && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-3">
                    メイン管理者は全メニューへのアクセス権限が必要です
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  選択されたメニュー: {Object.values(formData.permissions).filter(Boolean).length}個
                </div>
              </div>

              {/* 権限変更プレビュー */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">変更プレビュー</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(formData.role)}`}>
                      {getRoleLabel(formData.role)}
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
              disabled={isMainAdmin}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>変更を保存</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;