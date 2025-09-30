import React from 'react';
import { Save, X, Trash2, Upload, Image, Crown, Gem, Award, Medal, Zap, Shield } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  description: string;
  award: string;
  image: string;
  rank: string;
  url: string;
  display_order: number;
}

interface SponsorEditFormProps {
  editForm: Sponsor;
  selectedFile: File | null;
  previewUrl: string;
  isUploading: boolean;
  uploadError: string;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onInputChange: (field: keyof Sponsor, value: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadToSupabase: () => void;
  onDeleteImage: () => void;
}

const SponsorEditForm: React.FC<SponsorEditFormProps> = ({
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
  // ランクに応じた色を取得する関数
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'スペシャル':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg border-2 border-purple-300';
      case 'ダイヤモンド':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border-2 border-blue-300';
      case 'ゴールド':
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg border-2 border-yellow-300';
      case 'シルバー':
        return 'bg-gradient-to-r from-gray-400 to-slate-400 text-white shadow-md border-2 border-gray-300';
      case 'ブロンズ':
        return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md border-2 border-orange-300';
      case 'チタン':
        return 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-md border-2 border-slate-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // ランクに応じたアイコンを取得する関数
  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'スペシャル':
        return <Crown className="w-5 h-5 mr-2" />;
      case 'ダイヤモンド':
        return <Gem className="w-5 h-5 mr-2" />;
      case 'ゴールド':
        return <Award className="w-5 h-5 mr-2" />;
      case 'シルバー':
        return <Medal className="w-4 h-4 mr-2" />;
      case 'ブロンズ':
        return <Shield className="w-4 h-4 mr-2" />;
      case 'チタン':
        return <Zap className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">協賛企業情報編集</h3>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <button
            onClick={onSave}
            disabled={isUploading}
            type="button"
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

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* 左側：画像と基本情報 */}
        <div className="space-y-6">
          {/* 画像アップロードセクション */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              企業画像
            </label>
            
            {/* 画像プレビュー */}
            <div className="mb-4">
              <div className="w-full max-w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white mx-auto">
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
                  id="sponsor-file-input"
                  type="file"
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="sponsor-file-input"
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
                className={`flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-colors text-sm disabled:cursor-not-allowed w-full min-h-[44px] ${
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
                type="button"
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
                企業名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                placeholder="企業名を入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                賞・賞品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.award}
                onChange={(e) => onInputChange('award', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                placeholder="【企業名賞】賞品名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                協賛ランク
              </label>
              <div className="space-y-3">
                <select
                  value={editForm.rank}
                  onChange={(e) => onInputChange('rank', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                >
                  <option value="スペシャル">👑 スペシャル</option>
                  <option value="ダイヤモンド">💎 ダイヤモンド</option>
                  <option value="ゴールド">🏆 ゴールド</option>
                  <option value="シルバー">🥈 シルバー</option>
                  <option value="ブロンズ">🥉 ブロンズ</option>
                  <option value="チタン">⚡ チタン</option>
                </select>
                
                {/* ランクプレビュー */}
                <div className="flex items-center justify-center">
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg ${getRankColor(editForm.rank)}`}>
                    {getRankIcon(editForm.rank)}
                    {editForm.rank}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                企業URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={editForm.url}
                onChange={(e) => onInputChange('url', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
        </div>

        {/* 右側：企業説明とプレビュー */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              企業説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              rows={8}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="企業の事業内容や特徴を入力"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              文字数: {editForm.description.length}文字
            </div>
          </div>

          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">表示プレビュー</h4>
            <p className="text-xs sm:text-sm text-blue-700 mb-3">
              <strong>表示について:</strong> 入力された企業説明の最初の60文字がプレビューとして表示され、「続きを読む」で全文が表示されます。
            </p>
            <div className="p-2 sm:p-3 bg-white rounded border">
              <p className="text-sm text-gray-700">
                {editForm.description.length > 60 
                  ? editForm.description.substring(0, 60) + '...' 
                  : editForm.description
                }
              </p>
              {editForm.description.length > 60 && (
                <button className="text-purple-600 text-sm mt-1">続きを読む</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* バリデーション警告 */}
      {(!editForm.name || !editForm.description || !editForm.award || !editForm.url) && (
        <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong> 必須項目（*）をすべて入力してください。
          </p>
        </div>
      )}

      {/* Supabase接続状態の表示 */}
      <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
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

export default SponsorEditForm;