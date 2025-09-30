import React from 'react';
import { Save, X, Trash2, Upload, Image } from 'lucide-react';
import { getDepartmentDisplayName } from '../../../lib/utils';

interface AdditionalPrize {
  id: string;
  name: string;
  description: string;
  value: string;
  amount: number;
  image?: string;
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

interface AdditionalPrizeEditFormProps {
  editForm: AdditionalPrize;
  selectedFile: File | null;
  previewUrl: string;
  isUploading: boolean;
  uploadError: string;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onInputChange: (field: keyof AdditionalPrize, value: string | number) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadToSupabase: () => void;
  onDeleteImage: () => void;
}

const AdditionalPrizeEditForm: React.FC<AdditionalPrizeEditFormProps> = ({
  editForm,
  selectedFile,
  previewUrl,
  isUploading,
  uploadError,
  onSave,
  onCancel,
  onDelete,
  onInputChange,
  onFileSelect,
  onUploadToSupabase,
  onDeleteImage
}) => {
  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h4 className="text-lg sm:text-xl font-bold text-gray-900">追加賞金編集</h4>
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
          <button
            onClick={() => onDelete(editForm.id)}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>削除</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左側：基本情報 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              賞名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="賞の名前を入力"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editForm.value}
              onChange={(e) => onInputChange('value', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="賞品の内容を入力"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              金額換算（円） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) => onInputChange('amount', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="50000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="賞の詳細説明を入力"
              required
            />
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

        {/* 右側：画像アップロード・プレビュー */}
        <div className="space-y-6">
          {/* 画像アップロードセクション */}
          <div className="bg-white p-6 rounded-lg border">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              賞品画像
            </label>
            
            {/* 画像プレビュー */}
            <div className="mb-4">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mx-auto">
                {previewUrl || editForm.image ? (
                  <img
                    src={previewUrl || editForm.image}
                    alt="プレビュー"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">画像なし</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {/* ファイル選択 */}
              <div>
                <input
                  id="additional-prize-file-input"
                  type="file"
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="additional-prize-file-input"
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm w-full min-h-[44px]"
                >
                  <Upload className="w-4 h-4" />
                  <span>ファイル選択</span>
                </label>
              </div>

              {/* 選択されたファイル名表示 */}
              {selectedFile && (
                <div className="text-sm text-green-600 text-center">
                  選択中: {selectedFile.name}
                </div>
              )}

              {/* アップロードエラー表示 */}
              {uploadError && (
                <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                  {uploadError}
                </div>
              )}

              {/* アップロードボタン */}
              <button
                onClick={onUploadToSupabase}
                disabled={!selectedFile || isUploading}
                type="button"
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm disabled:cursor-not-allowed w-full min-h-[44px]"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>アップロード中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Supabaseにアップロード</span>
                  </>
                )}
              </button>

              {/* 削除ボタン */}
              <button
                onClick={onDeleteImage}
                disabled={!editForm.image}
                type="button"
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm w-full disabled:cursor-not-allowed min-h-[44px]"
              >
                画像を削除
              </button>
            </div>
          </div>

          {/* プレビューセクション */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">表示プレビュー</h4>
            <div className="p-3 bg-white rounded border">
              <h5 className="font-bold text-lg text-gray-900">{editForm.name}</h5>
              <p className="text-sm font-medium text-purple-600 mt-1">内容: {editForm.value}</p>
              <p className="text-sm text-gray-600 mt-1">{editForm.description}</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-600">
                  金額換算: {editForm.amount.toLocaleString()}円
                </p>
                <p className="text-xs text-blue-600">
                  対象部門: {getDepartmentDisplayName(editForm.department)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* バリデーション警告 */}
      {(!editForm.name || !editForm.value || !editForm.description) && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong> 必須項目（*）をすべて入力してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default AdditionalPrizeEditForm;