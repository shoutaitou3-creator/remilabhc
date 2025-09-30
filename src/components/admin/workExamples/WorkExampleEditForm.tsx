import React from 'react';
import { Save, X, Upload, Image, Eye, EyeOff } from 'lucide-react';

interface WorkExample {
  id: string;
  title: string;
  description: string;
  image: string;
  department: 'creative' | 'reality';
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface WorkExampleEditFormProps {
  editForm: WorkExample;
  selectedFile: File | null;
  previewUrl: string;
  isUploading: boolean;
  uploadError: string;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: keyof WorkExample, value: string | boolean) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadToSupabase: () => void;
  onDeleteImage: () => void;
}

const WorkExampleEditForm: React.FC<WorkExampleEditFormProps> = ({
  editForm,
  selectedFile,
  previewUrl,
  isUploading,
  uploadError,
  onSave,
  onCancel,
  onInputChange,
  onFileSelect,
  onUploadToSupabase,
  onDeleteImage
}) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">作品例編集</h3>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <button
            onClick={onSave}
            disabled={isUploading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <X className="w-4 h-4" />
            <span>キャンセル</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左側：画像と基本情報 */}
        <div className="space-y-6">
          {/* 画像アップロードセクション */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              作品画像
            </label>
            
            <div className="mb-4">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white mx-auto">
                {previewUrl || editForm.image ? (
                  <img
                    src={previewUrl || editForm.image}
                    alt="プレビュー"
                    className="w-full h-full object-contain rounded-lg border border-gray-200"
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
              <div>
                <input
                  id="work-example-file-input"
                  type="file"
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="work-example-file-input"
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm w-full"
                >
                  <Upload className="w-4 h-4" />
                  <span>ファイル選択</span>
                </label>
              </div>

              {selectedFile && (
                <div className="text-sm text-green-600 text-center">
                  選択中: {selectedFile.name}
                </div>
              )}

              {uploadError && (
                <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                  {uploadError}
                </div>
              )}

              <button
                onClick={onUploadToSupabase}
                disabled={!selectedFile || isUploading}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm disabled:cursor-not-allowed w-full"
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
                作者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => onInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="作者名を入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部門
              </label>
              <select
                value={editForm.department}
                onChange={(e) => onInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="creative">クリエイティブ部門</option>
                <option value="reality">リアリティー部門</option>
              </select>
            </div>

            {/* 公開状態管理 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公開状態</label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      editForm.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {editForm.is_published ? '公開中' : '非公開'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onInputChange('is_published', !editForm.is_published)}
                  type="button"
                  className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                    editForm.is_published
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {editForm.is_published ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>非公開にする</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>公開する</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右側：作品名・説明 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作品名・作品説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="作品名と作品の説明を入力してください"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              文字数: {editForm.description.length}文字
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">表示プレビュー</h4>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-700">
                {editForm.description.length > 100 
                  ? editForm.description.substring(0, 100) + '...' 
                  : editForm.description
                }
              </p>
              {editForm.description.length > 100 && (
                <button className="text-purple-600 text-sm mt-1">続きを読む</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExampleEditForm;