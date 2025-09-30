import React from 'react';
import { Camera, Eye, EyeOff, Crown, Calendar } from 'lucide-react';

interface EntryWork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instagram_url: string;
  instagram_account: string;
  department: 'creative' | 'reality';
  hashtag: string;
  period: string;
  is_nominated: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface EntryWorkStatsProps {
  entryWorks: EntryWork[];
}

const EntryWorkStats: React.FC<EntryWorkStatsProps> = ({ entryWorks }) => {
  const getLatestUpdate = () => {
    if (entryWorks.length === 0) return '未更新';
    const latestUpdate = entryWorks.reduce((latest, work) => {
      return new Date(work.updated_at) > new Date(latest) ? work.updated_at : latest;
    }, entryWorks[0]?.updated_at || new Date().toISOString());
    return new Date(latestUpdate).toLocaleDateString();
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">総エントリー数</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{entryWorks.length}件</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">公開中</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {entryWorks.filter(w => w.is_published).length}件
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">ノミネート</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {entryWorks.filter(w => w.is_nominated).length}件
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <Crown className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">クリエイティブ</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {entryWorks.filter(w => w.department === 'creative').length}件
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">最終更新</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {getLatestUpdate()}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryWorkStats;