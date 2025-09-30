import React from 'react';
import { Upload, FileText, Image, Trash2, CheckCircle } from 'lucide-react';

interface IconUploadSectionProps {
  iconFile: File | null;
  iconUrl: string;
  isUploading?: boolean;
  uploadError?: string;
  onIconSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIconDelete: () => void;
  onUploadToSupabase?: () => void;
}

const IconUploadSection: React.FC<IconUploadSectionProps> = ({
  iconFile,
  iconUrl,
  isUploading = false,
  uploadError = '',
  onIconSelect,
  onIconDelete,
  onUploadToSupabase
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        カスタムアイコン
      </label>
      
      {/* アイコンプレビュー */}
      <div className="mb-4">
        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white mx-auto">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt="アイコンプレビュー"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center">
              <FileText className="w-8 h-8 mx-auto mb-1 text-gray-400" />
              <span className="text-xs text-gray-500">デフォルト</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* ファイル選択 */}
        <div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={onIconSelect}
            className="hidden"
            id="icon-file-input"
          />
          <label
            htmlFor="icon-file-input"
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm w-full"
          >
            <Upload className="w-4 h-4" />
            <span>アイコン選択</span>
          </label>
        </div>

        {/* 選択されたファイル名表示 */}
        {iconFile && (
          <div className="text-sm text-green-600 text-center">
            選択中: {iconFile.name}
          </div>
        )}

        {/* アップロードエラー表示 */}
        {uploadError && (
          <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
            {uploadError}
          </div>
        )}

        {/* Supabaseアップロードボタン */}
        {onUploadToSupabase && (
          <button
            onClick={onUploadToSupabase}
            disabled={!iconFile || isUploading}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>アップロード中...</span>
              </>
            ) : iconUrl && !iconFile ? (
              <>
                <Upload className="w-4 h-4" />
                <span>アイコンを更新</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Supabaseにアップロード</span>
              </>
            )}
          </button>
        )}

        {/* 削除ボタン */}
        {iconUrl && (
          <button
            onClick={onIconDelete}
            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full"
          >
            <Trash2 className="w-4 h-4" />
            <span>アイコンを削除</span>
          </button>
        )}

        {/* ファイル要件 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-800 mb-2">アイコン要件</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 対応形式: JPG, PNG, GIF</li>
            <li>• 最大サイズ: 1MB</li>
            <li>• 推奨サイズ: 64x64px</li>
            <li>• 正方形の画像を推奨</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IconUploadSection;