import React, { useState } from 'react';
import { UserPlus, Users, Shield, Key, Database, Globe, Bell } from 'lucide-react';
import UserList from './settings/UserList';
import InviteUserForm from './settings/InviteUserForm';
import EditUserForm from './settings/EditUserForm';
import SiteSettingsForm from './settings/SiteSettingsForm';

interface UserData {
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
  lastLogin: string;
  createdAt: string;
}

const SettingsPanel: React.FC = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showSiteSettings, setShowSiteSettings] = useState(false);
  
  // ダミーユーザーデータ（UIのみなので固定値）
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      email: 'admin@resusty.com',
      role: 'admin',
      permissions: {
        dashboard: true,
        kpi: true,
        news: true,
        workExamples: true,
        faq: true,
        judges: true,
        sponsors: true,
        prizes: true,
        settings: true
      },
      lastLogin: '2025-01-15T10:30:00Z',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'editor@remilabhc.com',
      role: 'editor',
      permissions: {
        dashboard: true,
        kpi: false,
        news: true,
        workExamples: true,
        faq: true,
        judges: false,
        sponsors: false,
        prizes: false,
        settings: false
      },
      lastLogin: '2025-01-14T15:20:00Z',
      createdAt: '2025-01-10T09:00:00Z'
    },
    {
      id: '3',
      email: 'content@remilabhc.com',
      role: 'editor',
      permissions: {
        dashboard: true,
        kpi: false,
        news: false,
        workExamples: true,
        faq: true,
        judges: true,
        sponsors: true,
        prizes: false,
        settings: false
      },
      lastLogin: '2025-01-13T11:45:00Z',
      createdAt: '2025-01-12T14:30:00Z'
    }
  ]);

  const handleInviteUser = (userData: {
    email: string;
    password: string;
    role: 'admin' | 'editor';
    permissions: UserData['permissions'];
  }) => {
    // UIのみなので、ダミーデータを追加
    const newUser: UserData = {
      id: Date.now().toString(),
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    setShowInviteForm(false);
    
    // UIフィードバック
    alert(`${userData.email} にユーザー招待メールを送信しました（UIのみ）`);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
  };

  const handleSaveUser = (userData: UserData) => {
    setUsers(prev => prev.map(user => 
      user.id === userData.id ? userData : user
    ));
    setEditingUser(null);
    
    // UIフィードバック
    alert(`${userData.email} の権限を更新しました（UIのみ）`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.email === 'admin@resusty.com') {
      alert('メイン管理者は削除できません');
      return;
    }
    
    if (confirm('このユーザーを削除しますか？')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('ユーザーが削除されました（UIのみ）');
    }
  };

  const handleSendPasswordReset = (email: string) => {
    alert(`${email} にパスワードリセットメールを送信しました（UIのみ）`);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">設定</h2>
        <p className="text-gray-600">システム設定とユーザー管理</p>
      </div>

      {/* ユーザー管理セクション */}
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ユーザー管理</h3>
              <p className="text-gray-600">システムにアクセス可能なユーザーの招待・編集・削除</p>
            </div>
            <button
              onClick={() => setShowInviteForm(true)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <UserPlus className="w-5 h-5" />
              <span>新しいユーザーを招待</span>
            </button>
          </div>

          <UserList
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>

        {/* その他の設定セクション（将来の拡張用） */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <button className="text-sm text-blue-600 hover:text-blue-800 underline">
              設定を開く（未実装）
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">サイト設定</h4>
                <p className="text-sm text-gray-500">メタデータ・SEO設定</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSiteSettings(true)}
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              設定を開く
            </button>
          </div>

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
            <button className="text-sm text-purple-600 hover:text-purple-800 underline">
              設定を開く（未実装）
            </button>
          </div>
        </div>

        {/* 管理者情報 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">管理者権限について</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>メイン管理者</strong>: admin@resusty.com（権限変更・削除不可）</p>
                <p>• <strong>管理者</strong>: 全機能へのアクセス権限を持ちます</p>
                <p>• <strong>編集者</strong>: 個別に設定されたメニューのみアクセス可能</p>
                <p>• <strong>パスワード変更</strong>: メールアドレス宛の認証メールが必要です</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ユーザー招待フォーム（モーダル） */}
      {showInviteForm && (
        <InviteUserForm
          onClose={() => setShowInviteForm(false)}
          onInvite={handleInviteUser}
        />
      )}

      {/* ユーザー編集フォーム（モーダル） */}
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
          onSendPasswordReset={handleSendPasswordReset}
        />
      )}

      {/* サイト設定フォーム（モーダル） */}
      {showSiteSettings && (
        <SiteSettingsForm
          onClose={() => setShowSiteSettings(false)}
        />
      )}
    </div>
  );
};

export default SettingsPanel;