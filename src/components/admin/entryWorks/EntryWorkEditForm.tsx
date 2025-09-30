import React from 'react';
import { useEffect } from 'react';
import { Save, X, Trash2, Upload, Image, Eye, EyeOff, Instagram, Crown } from 'lucide-react';

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

interface EntryWorkEditFormProps {
  editForm: EntryWork;
  selectedFile: File | null;
  previewUrl: string;
  isUploading: boolean;
  uploadError: string;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onInputChange: (field: keyof EntryWork, value: string | boolean) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadToSupabase: () => void;
  onDeleteImage: () => void;
}

const EntryWorkEditForm: React.FC<EntryWorkEditFormProps> = ({
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
  // デバッグ: コンポーネントレンダリング時の状態をログ出力
  console.log('EntryWorkEditForm レンダリング:', {
    editFormId: editForm.id,
    department: editForm.department,
    hashtag: editForm.hashtag,
    timestamp: new Date().toISOString()
  });

  // 部門変更時にハッシュタグを自動更新（useEffectで分離）
  useEffect(() => {
    console.log('useEffect - 部門変更検知:', {
      department: editForm.department,
      currentHashtag: editForm.hashtag
    });
    
    const expectedHashtag = editForm.department === 'creative' ? '#レミラバックスタイルC' : '#レミラバックスタイルR';
    
    if (editForm.hashtag !== expectedHashtag) {
      console.log('ハッシュタグを自動更新:', {
        from: editForm.hashtag,
        to: expectedHashtag,
        department: editForm.department
      });
      onInputChange('hashtag', expectedHashtag);
    }
  }, [editForm.department]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">エントリー作品編集</h3>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <button
            onClick={onSave}
            disabled={isUploading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors disabled:cursor-not-allowed text-sm min-h-[44px]"
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
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <X className="w-4 h-4" />
            <span>キャンセル</span>
          </button>
          <button
            onClick={() => onDelete(editForm.id)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>削除</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* 左側：画像と基本情報 */}
        <div className="space-y-6">
          {/* 画像アップロードセクション */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              作品画像
            </label>
            
            {/* 画像プレビュー */}
            <div className="mb-4">
              <div className="w-48 h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white mx-auto">
                {previewUrl || editForm.image_url ? (
                  <img
                    src={previewUrl || editForm.image_url}
                    alt="プレビュー"
                    className="w-full h-full object-cover rounded-lg"
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
                  id="entry-work-file-input"
                  type="file"
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="entry-work-file-input"
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
                className={`flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-colors text-sm disabled:cursor-not-allowed w-full min-h-[44px] ${
                  editForm.image_url && !selectedFile 
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
                      {editForm.image_url && !selectedFile ? '画像を更新' : 'Supabaseにアップロード'}
                    </span>
                  </>
                )}
              </button>

              {/* 削除ボタン */}
              <button
                onClick={onDeleteImage}
                disabled={!editForm.image_url}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm w-full disabled:cursor-not-allowed min-h-[44px]"
              >
                画像を削除
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作品タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => onInputChange('title', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
                placeholder="作品のタイトルを入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagramアカウント <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-600" />
                <input
                  type="text"
                  value={editForm.instagram_account}
                  onChange={(e) => onInputChange('instagram_account', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
                  placeholder="@username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram投稿URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={editForm.instagram_url}
                onChange={(e) => onInputChange('instagram_url', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
                placeholder="https://www.instagram.com/p/..."
                required
              />
            </div>
          </div>
        </div>

        {/* 右側：詳細設定 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作品説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base resize-none"
              placeholder="作品の詳細説明を入力してください"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              文字数: {editForm.description.length}文字
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">部門</label>
              <select
                value={editForm.department}
                onClick={() => {
                  console.log('部門選択 - クリックイベント発火:', {
                    currentValue: editForm.department,
                    timestamp: new Date().toISOString()
                  });
                }}
                onChange={(e) => {
                  const newDepartment = e.target.value as 'creative' | 'reality';
                  console.log('部門選択 - 変更イベント発火:', {
                    selectedValue: newDepartment,
                    currentDepartment: editForm.department,
                    eventTarget: e.target.value,
                    timestamp: new Date().toISOString()
                  });
                  
                  // 部門のみを更新（ハッシュタグはuseEffectで自動更新）
                  onInputChange('department', newDepartment);
                }}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
              >
                <option value="creative">A クリエイティブ部門</option>
                <option value="reality">B リアリティー部門</option>
              </select>
              <div className="mt-2 text-xs text-gray-500">
                現在の値: {editForm.department} | ハッシュタグ: {editForm.hashtag}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">開催期</label>
              <select
                value={editForm.period}
                onChange={(e) => onInputChange('period', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
              >
                <option value="第1期">第1期</option>
                <option value="第2期">第2期</option>
                <option value="第3期">第3期</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ハッシュタグ</label>
            <input
              type="text"
              value={editForm.hashtag}
              onChange={(e) => onInputChange('hashtag', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
              placeholder="#レミラバックスタイルC"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              部門選択に応じて自動設定されます
            </p>
          </div>

          {/* ノミネート・公開状態管理 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ノミネート状態 */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ノミネート状態</label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      editForm.is_nominated 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {editForm.is_nominated ? '🏆 ノミネート' : '通常作品'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onInputChange('is_nominated', !editForm.is_nominated)}
                  type="button"
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px] ${
                    editForm.is_nominated
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  {editForm.is_nominated ? (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>解除</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>ノミネート</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 公開状態 */}
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
                      {editForm.is_published ? '✓ 公開中' : '✕ 非公開'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onInputChange('is_published', !editForm.is_published)}
                  type="button"
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px] ${
                    editForm.is_published
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {editForm.is_published ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>非公開</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>公開</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* プレビューセクション */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-3">表示プレビュー</h4>
            <div className="bg-white p-4 rounded border">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  editForm.department === 'creative' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {editForm.department === 'creative' ? 'クリエイティブ' : 'リアリティー'}
                </span>
                {editForm.is_nominated && (
                  <span className="text-xs px-2 py-1 rounded font-bold text-white bg-gradient-to-r from-yellow-500 to-amber-500">
                    🏆 ノミネート
                  </span>
                )}
              </div>
              <h5 className="font-bold text-gray-900 mb-1">{editForm.title}</h5>
              <p className="text-sm text-gray-600 mb-2">{editForm.description}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Instagram className="w-3 h-3 text-pink-600" />
                <span>{editForm.instagram_account}</span>
                <span>•</span>
                <span>{editForm.period} {editForm.hashtag}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* バリデーション警告 */}
      {(!editForm.title || !editForm.description || !editForm.instagram_account) && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong> 必須項目（*）をすべて入力してください。
          </p>
        </div>
      )}

      {/* ノミネート機能の説明 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">ノミネート機能について</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• ノミネート作品には金色の「🏆 ノミネート」バッジが表示されます</li>
          <li>• 審査員によって選出された特別な作品であることを示します</li>
          <li>• ノミネート状態は管理者・編集者が設定できます</li>
          <li>• フロントエンドでは目立つ位置にバッジが表示されます</li>
        </ul>
      </div>
    </div>
  );
};

export default EntryWorkEditForm;