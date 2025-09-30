import React from 'react';
import { Save, X, Crown, Medal, Award } from 'lucide-react';
import { getDepartmentDisplayName } from '../../../lib/utils';

interface MainPrize {
  id: string;
  rank: string;
  title: string;
  amount: string;
  description: string;
  icon: string;
  highlight: boolean;
  amount_value: number;
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

interface MainPrizeEditFormProps {
  editForm: MainPrize;
  isUploading: boolean;
  uploadError: string;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: keyof MainPrize, value: string | boolean | number) => void;
}

const MainPrizeEditForm: React.FC<MainPrizeEditFormProps> = ({
  editForm,
  isUploading,
  uploadError,
  onSave,
  onCancel,
  onInputChange
}) => {
  // アイコン取得関数
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'crown':
        return <Crown className="w-8 h-8 text-yellow-600" />;
      case 'medal':
        return <Medal className="w-8 h-8 text-gray-500" />;
      case 'award':
        return <Award className="w-8 h-8 text-amber-700" />;
      default:
        return <Award className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h4 className="text-lg sm:text-xl font-bold text-gray-900">メイン賞金編集</h4>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <button
            onClick={onSave}
            disabled={isUploading}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <X className="w-4 h-4" />
            <span>キャンセル</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* 左側：基本情報 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              順位 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editForm.rank}
              onChange={(e) => onInputChange('rank', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="グランプリ、第2位など"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              賞名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="年間グランプリなど"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              賞金額表示 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editForm.amount}
              onChange={(e) => onInputChange('amount', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="300万円など"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              金額換算（円） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={editForm.amount_value}
              onChange={(e) => onInputChange('amount_value', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="3000000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">アイコン</label>
            <select
              value={editForm.icon}
              onChange={(e) => onInputChange('icon', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
            >
              <option value="crown">王冠</option>
              <option value="medal">メダル</option>
              <option value="award">賞</option>
              <option value="trophy">トロフィー</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">対象部門</label>
            <select
              value={editForm.department}
              onChange={(e) => onInputChange('department', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
            >
              <option value="both">【クリエイティブ部門】【リアリティー部門】それぞれ</option>
              <option value="creative">【クリエイティブ部門】</option>
              <option value="reality">【リアリティー部門】</option>
              <option value="either">【クリエイティブ部門】【リアリティー部門】どちらか</option>
            </select>
          </div>
        </div>

        {/* 右側：説明とプレビュー */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="賞の詳細説明を入力"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              文字数: {editForm.description.length}文字
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={`highlight-${editForm.id}`}
              checked={editForm.highlight}
              onChange={(e) => onInputChange('highlight', e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor={`highlight-${editForm.id}`} className="text-sm font-medium text-gray-700">
              ハイライト表示（特別な装飾で表示）
            </label>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600 mb-3">プレビュー:</p>
            <div className="flex items-center space-x-3">
              {getIcon(editForm.icon)}
              <div>
                <h5 className="font-bold text-lg">{editForm.title}</h5>
                <p className="text-2xl font-bold text-gray-800">{editForm.amount}</p>
                <p className="text-sm text-gray-600 mt-1">{editForm.description}</p>
                <p className="text-xs text-green-600 mt-1">
                  金額換算: {editForm.amount_value.toLocaleString()}円
                </p>
                <p className="text-xs text-blue-600">
                  対象部門: {getDepartmentDisplayName(editForm.department, false)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アップロードエラー表示 */}
      {uploadError && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {uploadError}
        </div>
      )}

      {/* バリデーション警告 */}
      {(!editForm.rank || !editForm.title || !editForm.amount || !editForm.description) && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong> 必須項目（*）をすべて入力してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default MainPrizeEditForm;