import React, { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Phone, 
  Handshake, 
  FileCheck, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Award,
  Zap
} from 'lucide-react';

interface KpiItem {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  category: 'contest' | 'inquiry' | 'remila';
  department?: 'creative' | 'reality' | 'both';
}

const KpiManagement: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2025-q1');

  // サンプルKPIデータ（UIのみなので固定値）
  const [kpiData, setKpiData] = useState<KpiItem[]>([
    // コンテスト関連
    { id: '1', name: 'クリエイティブ部門エントリー数', current: 45, target: 100, unit: '件', category: 'contest', department: 'creative' },
    { id: '2', name: 'リアリティー部門エントリー数', current: 32, target: 80, unit: '件', category: 'contest', department: 'reality' },
    { id: '3', name: '総エントリー数', current: 77, target: 180, unit: '件', category: 'contest', department: 'both' },
    
    // 問い合わせ関連
    { id: '4', name: 'コンテスト問い合わせ数', current: 23, target: 50, unit: '件', category: 'inquiry' },
    { id: '5', name: 'サイト訪問者数', current: 1250, target: 3000, unit: '人', category: 'inquiry' },
    { id: '6', name: 'SNSフォロワー数', current: 890, target: 2000, unit: '人', category: 'inquiry' },
    
    // レミラ関連
    { id: '7', name: 'レミラ問い合わせ数', current: 18, target: 40, unit: '件', category: 'remila' },
    { id: '8', name: 'レミラ商談数', current: 12, target: 25, unit: '件', category: 'remila' },
    { id: '9', name: 'レミラ契約数', current: 5, target: 15, unit: '件', category: 'remila' },
    { id: '10', name: 'レミラ売上', current: 2500000, target: 6000000, unit: '円', category: 'remila' },
  ]);

  // 達成率を計算
  const getAchievementRate = (current: number, target: number): number => {
    return target > 0 ? Math.round((current / target) * 100) : 0;
  };

  // 達成率に応じた色を取得
  const getProgressColor = (rate: number): string => {
    if (rate >= 100) return 'bg-green-500';
    if (rate >= 75) return 'bg-blue-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // カテゴリーごとのアイコンを取得
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'contest':
        return <Award className="w-6 h-6 text-purple-600" />;
      case 'inquiry':
        return <MessageCircle className="w-6 h-6 text-blue-600" />;
      case 'remila':
        return <Zap className="w-6 h-6 text-orange-600" />;
      default:
        return <BarChart3 className="w-6 h-6 text-gray-600" />;
    }
  };

  // カテゴリー名を取得
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'contest':
        return 'コンテスト関連';
      case 'inquiry':
        return '問い合わせ・集客';
      case 'remila':
        return 'レミラ事業';
      default:
        return 'その他';
    }
  };

  // カテゴリーごとにKPIをグループ化
  const groupedKpis = kpiData.reduce((acc, kpi) => {
    if (!acc[kpi.category]) {
      acc[kpi.category] = [];
    }
    acc[kpi.category].push(kpi);
    return acc;
  }, {} as Record<string, KpiItem[]>);

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">KPI管理</h2>
            <p className="text-gray-600">コンテストとレミラ事業のKPI目標設定・進捗管理</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="2025-q1">2025年 第1四半期</option>
              <option value="2025-q2">2025年 第2四半期</option>
              <option value="2025-q3">2025年 第3四半期</option>
              <option value="2025-q4">2025年 第4四半期</option>
            </select>
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              <span>新しいKPI追加</span>
            </button>
          </div>
        </div>
      </div>

      {/* 全体サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">総エントリー数</p>
              <p className="text-2xl font-bold text-gray-900">77件</p>
              <p className="text-sm text-gray-500">目標: 180件</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>進捗</span>
              <span>43%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '43%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">問い合わせ数</p>
              <p className="text-2xl font-bold text-gray-900">23件</p>
              <p className="text-sm text-gray-500">目標: 50件</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>進捗</span>
              <span>46%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '46%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">レミラ契約数</p>
              <p className="text-2xl font-bold text-gray-900">5件</p>
              <p className="text-sm text-gray-500">目標: 15件</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>進捗</span>
              <span>33%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">レミラ売上</p>
              <p className="text-2xl font-bold text-gray-900">250万円</p>
              <p className="text-sm text-gray-500">目標: 600万円</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>進捗</span>
              <span>42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* カテゴリー別KPI詳細 */}
      {Object.entries(groupedKpis).map(([category, kpis]) => (
        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            {getCategoryIcon(category)}
            <h3 className="text-xl font-bold text-gray-900">{getCategoryName(category)}</h3>
          </div>

          <div className="grid gap-4">
            {kpis.map((kpi) => {
              const achievementRate = getAchievementRate(kpi.current, kpi.target);
              const progressColor = getProgressColor(achievementRate);

              return (
                <div key={kpi.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{kpi.name}</h4>
                      {kpi.department && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {kpi.department === 'creative' ? 'クリエイティブ部門' : 
                           kpi.department === 'reality' ? 'リアリティー部門' : '両部門'}
                        </span>
                      )}
                    </div>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                      <Edit className="w-4 h-4" />
                      <span>編集</span>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-600">現在値</p>
                      <p className="text-xl font-bold text-gray-900">
                        {kpi.unit === '円' ? `${(kpi.current / 10000).toFixed(0)}万` : kpi.current.toLocaleString()}
                        <span className="text-sm font-normal text-gray-600 ml-1">{kpi.unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">目標値</p>
                      <p className="text-xl font-bold text-gray-900">
                        {kpi.unit === '円' ? `${(kpi.target / 10000).toFixed(0)}万` : kpi.target.toLocaleString()}
                        <span className="text-sm font-normal text-gray-600 ml-1">{kpi.unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">達成率</p>
                      <p className={`text-xl font-bold ${
                        achievementRate >= 100 ? 'text-green-600' :
                        achievementRate >= 75 ? 'text-blue-600' :
                        achievementRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {achievementRate}%
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">進捗</span>
                        <span className="font-medium">{achievementRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${progressColor} h-3 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(achievementRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* アクションボタン */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          データエクスポート
        </button>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          レポート生成
        </button>
      </div>
    </div>
  );
};

export default KpiManagement;