import React, { useState } from 'react';
import { UserPlus, Users, Shield, Key, AlertCircle, Calendar } from 'lucide-react';
import UserList from './settings/UserList';
import InviteUserForm from './settings/InviteUserForm';
import EditUserForm from './settings/EditUserForm';
import { useUserManagement, UserProfile } from '../../hooks/useUserManagement';

const UserManagement: React.FC = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  // 実際のユーザー管理フックを使用
  const {
    users,
    loading,
    error,
    inviteUser,
    updateUser,
    deleteUser,
    sendPasswordReset
  } = useUserManagement();

  const handleInviteUser = (userData: {
    email: string;
    password: string;
    role: 'admin' | 'editor';
    permissions: UserProfile['permissions'];
  }) => {
    inviteUser(userData).then(result => {
      if (result.success) {
        setShowInviteForm(false);
        alert(`${userData.email} のユーザーアカウントを作成しました`);
      } else {
        alert(`ユーザー作成に失敗しました: ${result.error}`);
      }
    });
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
  };

  const handleSaveUser = (userData: UserProfile) => {
    updateUser(userData).then(result => {
      if (result.success) {
        setEditingUser(null);
        alert(`${userData.email} の権限を更新しました`);
      } else {
        alert(`権限更新に失敗しました: ${result.error}`);
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId).then(result => {
      if (result.success) {
        alert('ユーザーが削除されました');
      } else {
        alert(`ユーザー削除に失敗しました: ${result.error}`);
      }
    });
  };

  const handleSendPasswordReset = (email: string) => {
    sendPasswordReset(email).then(result => {
      if (result.success) {
        alert(`${email} にパスワードリセットメールを送信しました`);
      } else {
        alert(`パスワードリセットメール送信に失敗しました: ${result.error}`);
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ユーザー管理</h2>
        <p className="text-gray-600">システムにアクセス可能なユーザーの招待・編集・削除</p>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ユーザーデータを読み込み中...</p>
        </div>
      )}

      {/* ユーザー管理セクション */}
      {!loading && (
        <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">登録ユーザー一覧</h3>
              <p className="text-gray-600">システムにアクセス可能なユーザーの管理</p>
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

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}人</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">管理者</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => u.role === 'admin').length}人
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">編集者</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => u.role === 'editor').length}人
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">アクティブ</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => u.is_active).length}人
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
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
                <p>• <strong>メイン管理者</strong>: admin@remilabhc.com（権限変更・削除不可）</p>
                <p>• <strong>管理者</strong>: 全機能へのアクセス権限を持ちます</p>
                <p>• <strong>編集者</strong>: 個別に設定されたメニューのみアクセス可能</p>
                <p>• <strong>パスワード変更</strong>: メールアドレス宛の認証メールが必要です</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

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
    </div>
  );
};

export default UserManagement;