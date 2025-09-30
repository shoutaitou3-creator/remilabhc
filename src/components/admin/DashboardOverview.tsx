import React, { useState, useEffect } from 'react';
import { Users, Building, Award, Trophy, FileText } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { getSiteSlugFromUrl, getSiteDisplayName } from '../../utils/siteHelpers';

interface DashboardOverviewProps {
  currentUser?: {
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
  };
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ currentUser }) => {
  const [stats, setStats] = useState({
    judgesCount: 0,
    sponsorsCount: 0,
    totalPrizeAmount: '計算中...',
    prizesCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const currentSiteSlug = getSiteSlugFromUrl();
  const siteDisplayName = getSiteDisplayName(currentSiteSlug);

  // ダッシュボード統計データを取得する関数
  const fetchDashboardStats = async () => {
    try {
      // Supabase設定チェック
      if (!isSupabaseConfigured()) {
        setError('Supabaseが正しく設定されていません。「Connect to Supabase」ボタンをクリックしてSupabaseを接続してください。');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      // 審査員数を取得
      const { count: judgesCount, error: judgesError } = await supabase
        .from('judges')
        .select('*', { count: 'exact', head: true });

      if (judgesError) {
        throw new Error(`審査員数の取得に失敗: ${judgesError.message}`);
      }

      // 協賛企業数を取得
      const { count: sponsorsCount, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('*', { count: 'exact', head: true });

      if (sponsorsError) {
        throw new Error(`協賛企業数の取得に失敗: ${sponsorsError.message}`);
      }

      // メイン賞金を取得
      const { data: mainData, error: mainError } = await supabase
        .from('main_prizes')
        .select('amount_value');

      if (mainError) {
        throw new Error(`メイン賞金データの取得に失敗: ${mainError.message}`);
      }

      // 追加賞金を取得
      const { data: additionalData, error: additionalError } = await supabase
        .from('additional_prizes')
        .select('amount');

      if (additionalError) {
        throw new Error(`追加賞金データの取得に失敗: ${additionalError.message}`);
      }

      // 賞金総額を計算
      const mainTotal = (mainData || []).reduce((sum, prize) => {
        return sum + (prize.amount_value || 0);
      }, 0);
      
      const additionalTotal = (additionalData || []).reduce((sum, prize) => {
        return sum + (prize.amount || 0);
      }, 0);
      
      const total = mainTotal + additionalTotal;
      const totalPrizeAmount = `${total.toLocaleString()}円`;

      // 賞金賞品数を計算
      const prizesCount = (mainData?.length || 0) + (additionalData?.length || 0);

      // 統計データを更新
      setStats({
        judgesCount: judgesCount || 0,
        sponsorsCount: sponsorsCount || 0,
        totalPrizeAmount,
        prizesCount
      });

    } catch (error) {
      console.error('ダッシュボード統計データの取得エラー:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setError('Supabaseに接続できません。環境変数を確認するか、「Connect to Supabase」ボタンをクリックしてSupabaseを接続してください。');
      } else {
        setError(error instanceof Error ? error.message : 'データの取得に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時に統計データを取得
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statsData = [
    { label: '審査員数', value: loading ? '読み込み中...' : `${stats.judgesCount}人`, icon: <Users className="w-8 h-8 text-blue-600" /> },
    { label: '協賛企業数', value: loading ? '読み込み中...' : `${stats.sponsorsCount}社`, icon: <Building className="w-8 h-8 text-green-600" /> },
    { label: '総賞金額', value: loading ? '計算中...' : stats.totalPrizeAmount, icon: <Award className="w-8 h-8 text-yellow-600" /> },
    { label: '賞金賞品数', value: loading ? '集計中...' : `${stats.prizesCount}個`, icon: <Trophy className="w-8 h-8 text-purple-600" /> },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ダッシュボード - {siteDisplayName}
        </h2>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">{siteDisplayName} 管理システム</p>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
            {currentSiteSlug}
          </span>
          {currentUser && (
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                currentUser.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {currentUser.role === 'admin' ? '管理者権限' : '編集者権限'}
              </span>
              <span className="text-xs text-gray-500">
                ({currentUser.email})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-2">接続エラー</h3>
              <p className="text-red-700 text-sm mb-3">{error}</p>
              <div className="flex space-x-3">
                <button
                  onClick={fetchDashboardStats}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  再読み込み
                </button>
                {!isSupabaseConfigured() && (
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Supabaseダッシュボードを開く
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 最近の活動 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">システム概要</h3>
        
        {currentUser && currentUser.role === 'editor' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">編集者権限でログイン中</h4>
            <p className="text-xs text-blue-700">
              編集者権限では、一部の管理機能にアクセスできません。
              アクセス可能な機能のみがサイドバーに表示されています。
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">審査員管理</p>
              <p className="text-sm text-gray-600">
                審査員の情報を編集・管理できます
                {currentUser?.role === 'editor' && (
                  <span className="text-red-600 ml-2">(管理者限定)</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <Building className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">協賛企業管理</p>
              <p className="text-sm text-gray-600">
                協賛企業の情報を編集・管理できます
                {currentUser?.role === 'editor' && (
                  <span className="text-red-600 ml-2">(管理者限定)</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-900">賞金賞品管理</p>
              <p className="text-sm text-gray-600">
                コンテストの賞金・賞品情報を編集・管理できます
                {currentUser?.role === 'editor' && (
                  <span className="text-red-600 ml-2">(管理者限定)</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <FileText className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">作品例・FAQ管理</p>
              <p className="text-sm text-gray-600">
                作品例とよくある質問の管理
                {currentUser?.role === 'editor' && (
                  <span className="text-green-600 ml-2">(編集者アクセス可能)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;