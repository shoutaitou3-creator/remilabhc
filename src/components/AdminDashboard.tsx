import React, { useState, useEffect } from 'react';
import { Users, Building, Award, Trophy, Settings, BarChart3, Target, Menu, X } from 'lucide-react';
import { Camera } from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import { FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardOverview from './admin/DashboardOverview';
import KpiManagement from './admin/KpiManagement';
import JudgesManagement from './admin/JudgesManagement';
import SponsorsManagement from './admin/SponsorsManagement';
import PrizesManagement from './admin/PrizesManagement';
import NewsManagement from './admin/NewsManagement';
import FaqManagement from './admin/FaqManagement';
import WorkExamplesManagement from './admin/WorkExamplesManagement';
import UserManagement from './admin/UserManagement';
import SiteSettingsManagement from './admin/SiteSettingsManagement';
import EntryWorksManagement from './admin/EntryWorksManagement';
import OtherSettingsManagement from './admin/OtherSettingsManagement';
import SharedComponentsManagement from './admin/SharedComponentsManagement';
import ResourceDownloadManagement from './admin/ResourceDownloadManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleMenuItemClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'kpi', label: 'KPI管理', icon: <Target className="w-5 h-5" />, adminOnly: true },
    { id: 'news', label: 'お知らせ管理', icon: <FileText className="w-5 h-5" /> },
    { id: 'entry-works', label: 'エントリー作品管理', icon: <Camera className="w-5 h-5" /> },
    { id: 'work-examples', label: '作品例管理', icon: <FileText className="w-5 h-5" /> },
    { id: 'faq', label: 'よくある質問管理', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'judges', label: '審査員管理', icon: <Users className="w-5 h-5" />, adminOnly: true },
    { id: 'sponsors', label: '協賛企業管理', icon: <Building className="w-5 h-5" />, adminOnly: true },
    { id: 'prizes', label: '賞金賞品管理', icon: <Trophy className="w-5 h-5" />, adminOnly: true },
    { id: 'resource-download', label: '資料DL管理', icon: <FileText className="w-5 h-5" />, adminOnly: true },
    { id: 'shared-components', label: '共有コンポーネント', icon: <Settings className="w-5 h-5" />, adminOnly: true },
    { id: 'user-management', label: 'ユーザー管理', icon: <Users className="w-5 h-5" />, adminOnly: true },
    { id: 'site-settings', label: 'サイト設定', icon: <Settings className="w-5 h-5" />, adminOnly: true },
    { id: 'other-settings', label: 'その他設定', icon: <Settings className="w-5 h-5" />, unimplemented: true, adminOnly: true },
  ];

  // 編集者権限でアクセス可能なメニューをフィルタリング
  const getPermissionKey = (menuId: string): keyof typeof userProfile.permissions | null => {
    // userProfileが存在しない場合の安全チェック
    if (!userProfile || !userProfile.permissions) return null;
    
    const mapping: Record<string, keyof typeof userProfile.permissions> = {
      'dashboard': 'dashboard',
      'kpi': 'kpi',
      'news': 'news',
      'entry-works': 'workExamples',
      'work-examples': 'workExamples',
      'faq': 'faq',
      'judges': 'judges',
      'sponsors': 'sponsors',
      'prizes': 'prizes',
      'shared-components': 'settings',
      'user-management': 'settings',
      'site-settings': 'settings',
      'other-settings': 'settings',
    };
    return mapping[menuId] || null;
  };

  const getAccessibleMenuItems = () => {
    if (!userProfile) return menuItems; // 認証情報がない場合は全メニュー表示
    if (!userProfile.permissions) return menuItems; // 権限情報がない場合は全メニュー表示
    
    if (userProfile.role === 'admin') return menuItems;
    
    // 編集者の場合は権限に基づいてフィルタリング
    return menuItems.filter(item => {
      if (item.adminOnly && userProfile.role !== 'admin') return false;
      const permissionKey = getPermissionKey(item.id);
      if (!permissionKey) return true; // マッピングがない場合はアクセス許可
      return userProfile.permissions[permissionKey] === true;
    });
  };

  const accessibleMenuItems = getAccessibleMenuItems();

  const renderContent = () => {
    // 編集者権限チェック
    const currentUser = userProfile;
    if (currentUser && currentUser.role === 'editor') {
      const permissionKey = getPermissionKey(activeTab);
      const hasPermission = permissionKey ? currentUser.permissions?.[permissionKey] : false;
      if (!hasPermission) {
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">アクセス権限がありません</h3>
            <p className="text-gray-600 mb-4">
              この機能にアクセスする権限がありません。<br />
              管理者にお問い合わせください。
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              ダッシュボードに戻る
            </button>
          </div>
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview currentUser={currentUser} />;
      case 'kpi':
        return <KpiManagement />;
      case 'news':
        return <NewsManagement />;
      case 'entry-works':
        return <EntryWorksManagement />;
      case 'work-examples':
        return <WorkExamplesManagement />;
      case 'faq':
        return <FaqManagement />;
      case 'judges':
        return <JudgesManagement />;
      case 'sponsors':
        return <SponsorsManagement />;
      case 'prizes':
        return <PrizesManagement />;
      case 'resource-download':
        return <ResourceDownloadManagement />;
      case 'shared-components':
        return <SharedComponentsManagement />;
      case 'user-management':
        return <UserManagement />;
      case 'site-settings':
        return <SiteSettingsManagement />;
      case 'other-settings':
        return <OtherSettingsManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* ハンバーガーメニューボタン（モバイル・タブレット用） */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="text-xl font-bold text-gray-900">REMILA BHC</h1>
              <span className="ml-2 text-sm text-gray-500">管理システム</span>
              {userProfile && (
                <span className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${
                  userProfile?.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userProfile?.role === 'admin' ? '管理者' : '編集者'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {userProfile && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {userProfile?.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* モバイル・タブレット用オーバーレイ */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* サイドバー・ハンバーガーメニュー */}
        <nav className={`
          fixed lg:static lg:translate-x-0 top-16 left-0 z-40
          w-64 bg-white shadow-lg lg:shadow-sm min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:block
        `}>
          <div className="p-4">
            {/* モバイル用ヘッダー */}
            <div className="lg:hidden mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">メニュー</h2>
            </div>
            
            <ul className="space-y-2">
              {accessibleMenuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : item.unimplemented 
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    disabled={item.unimplemented}
                  >
                    {item.icon}
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      {item.unimplemented && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          未実装
                        </span>
                      )}
                      {item.adminOnly && userProfile?.role === 'editor' && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">管理者限定</span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* メインコンテンツ */}
        <main className="flex-1 p-4 lg:p-8 lg:ml-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};


export default AdminDashboard;