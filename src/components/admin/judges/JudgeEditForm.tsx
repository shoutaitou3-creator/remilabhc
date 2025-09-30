import React from 'react';
import { Save, X, Trash2, Upload, Image } from 'lucide-react';

interface Judge {
  id: string;
  name: string;
  salon: string;
  instagram: string;
  image: string;
  profile: string;
  display_order: number;
}

interface JudgeEditFormProps {
  editForm: Judge;
  selectedFile: File | null;
  previewUrl: string;
  isUploading: boolean;
  uploadError: string;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onInputChange: (field: keyof Judge, value: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadToSupabase: () => void;
  onDeleteImage: () => void;
  validateInstagramUrl: (url: string) => boolean;
}

const JudgeEditForm: React.FC<JudgeEditFormProps> = ({
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
  onDeleteImage,
  validateInstagramUrl
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">審査員情報編集</h3>
        <div className="flex space-x-2">
          <button
            onClick={onSave}
            disabled={isUploading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>保存</span>
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>キャンセル</span>
          </button>
          <button
            onClick={() => onDelete(editForm.id)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>削除</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 左側：画像と基本情報 */}
        <div className="space-y-6">
          {/* 画像アップロードセクション */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              プロフィール画像
            </label>
            
            {/* 画像プレビュー */}
            <div className="mb-4">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white mx-auto">
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
                  id="judge-file-input"
                  type="file"
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="judge-file-input"
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm w-full"
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
                className={`flex items-center justify-center space-x-2 text-white px-4 py-2 rounded-lg transition-colors text-sm disabled:cursor-not-allowed w-full ${
                  editForm.image && !selectedFile 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>アップロード中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>
                      {editForm.image && !selectedFile ? '画像を更新' : 'Supabaseにアップロード'}
                    </span>
                  </>
                )}
              </button>

              {/* 削除ボタン */}
              <button
                onClick={onDeleteImage}
                disabled={!editForm.image}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full disabled:cursor-not-allowed"
              >
                画像を削除
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="審査員の名前を入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サロン名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.salon}
                onChange={(e) => onInputChange('salon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="所属サロン名を入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={editForm.instagram}
                onChange={(e) => onInputChange('instagram', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validateInstagramUrl(editForm.instagram) 
                    ? 'border-gray-300 focus:ring-purple-500' 
                    : 'border-red-300 focus:ring-red-500'
                }`}
                placeholder="https://www.instagram.com/username/"
                required
              />
              {!validateInstagramUrl(editForm.instagram) && editForm.instagram && (
                <p className="text-red-500 text-xs mt-1">
                  正しいInstagram URLを入力してください
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 右側：プロフィール */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プロフィール <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editForm.profile}
              onChange={(e) => onInputChange('profile', e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="審査員のプロフィールを入力してください"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              文字数: {editForm.profile.length}文字
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">表示プレビュー</h4>
            <p className="text-sm text-blue-700">
              <strong>表示について:</strong> 入力されたプロフィールの最初の70文字がプレビューとして表示され、「続きを読む」で全文が表示されます。
            </p>
            <div className="mt-3 p-3 bg-white rounded border">
              <p className="text-sm text-gray-700">
                {editForm.profile.length > 70 
                  ? editForm.profile.substring(0, 70) + '...' 
                  : editForm.profile
                }
              </p>
              {editForm.profile.length > 70 && (
                <button className="text-purple-600 text-sm mt-1">続きを読む</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* バリデーション警告 */}
      {(!editForm.name || !editForm.salon || !editForm.profile || !validateInstagramUrl(editForm.instagram)) && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong> 必須項目（*）をすべて正しく入力してください。
          </p>
        </div>
      )}

      {/* Supabase接続状態の表示 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Supabase接続:</strong> 画像はSupabaseストレージに保存されます。
          {!import.meta.env.VITE_SUPABASE_URL && (
            <span className="text-red-600 ml-2">
              環境変数が設定されていません。
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default JudgeEditForm;