import React from 'react';
import { Edit, Trash2, Shield, User, Mail, Calendar } from 'lucide-react';

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

interface UserListProps {
  users: UserProfile[];
  onEditUser: (user: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEditUser, onDeleteUser }) => {
  const getPermissionCount = (permissions: UserProfile['permissions']) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  const getPermissionsList = (permissions: UserProfile['permissions']) => {
    const menuLabels = {
      dashboard: 'ダッシュボード',
      kpi: 'KPI管理',
      news: 'お知らせ管理',
      workExamples: '作品例管理',
      faq: 'FAQ管理',
      judges: '審査員管理',
      sponsors: '協賛企業管理',
      prizes: '賞金賞品管理',
      settings: '設定'
    };

    return Object.entries(permissions)
      .filter(([_, hasPermission]) => hasPermission)
      .map(([key, _]) => menuLabels[key as keyof typeof menuLabels])
      .join('、');
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">登録ユーザー一覧</h3>
        <p className="text-sm text-gray-600 mt-1">システムにアクセス可能なユーザーの管理</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ユーザー
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                権限
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクセス可能メニュー
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終ログイン
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        登録: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">{getPermissionCount(user.permissions)}個のメニュー</span>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                      {getPermissionsList(user.permissions)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : '未ログイン'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>編集</span>
                    </button>
                    {user.email !== 'admin@remilabhc.com' && (
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>削除</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ユーザーが登録されていません</h3>
          <p className="text-gray-600">新しいユーザーを招待してください。</p>
        </div>
      )}
    </div>
  );
};

export default UserList;