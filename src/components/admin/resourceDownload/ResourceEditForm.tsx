import React from 'react';
import { Save, X, Trash2, AlertCircle, FileText, Image, Upload } from 'lucide-react';
import { ResourceFormData } from '../../../types/resourceDownload';
import FileUploadSection from './FileUploadSection';
import IconUploadSection from './IconUploadSection';
import PublishStatusSection from './PublishStatusSection';
import ResourcePreview from './ResourcePreview';

interface ResourceEditFormProps {
  formData: ResourceFormData;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onInputChange: (field: keyof ResourceFormData, value: string | boolean | File | null) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIconSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDelete: () => void;
  onIconDelete: () => void;
  onIconUpload: () => void;
  isIconUploading: boolean;
  iconUploadError: string;
  formatFileSize: (bytes: number) => string;
}

const ResourceEditForm: React.FC<ResourceEditFormProps> = ({
  formData,
  onSave,
  onCancel,
  onDelete,
  onInputChange,
  onFileSelect,
  onIconSelect,
  onFileDelete,
  onIconDelete,
  onIconUpload,
  isIconUploading,
  iconUploadError,
  formatFileSize
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold text-gray-900">資料編集</h4>
        <div className="flex space-x-2">
          <button
            onClick={onSave}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>キャンセル</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>削除</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左側：基本情報 */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              資料タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="資料のタイトルを入力"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明文 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
              placeholder="資料の詳細説明を入力"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              文字数: {formData.description.length}文字
            </div>
          </div>

          {/* アップロード済みファイル情報 */}
          {(formData.uploadedFile || formData.uploadedFileUrl) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-green-800 mb-2">アップロード済みファイル</h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    {formData.uploadedFile?.name || 'アップロード済みファイル'}
                  </span>
                </div>
                {formData.uploadedFile && (
                  <div className="text-xs text-green-600">
                    サイズ: {formatFileSize(formData.uploadedFile.size)}
                  </div>
                )}
                <button
                  onClick={onFileDelete}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  ファイルを削除
                </button>
              </div>
            </div>
          )}
        </div>
          <FileUploadSection onFileSelect={onFileSelect} />
          <PublishStatusSection 
            isActive={formData.is_published}
            onToggle={() => onInputChange('is_published', !formData.is_published)}
          />

        {/* 右側：アイコン設定・プレビュー */}
        <div className="space-y-6">
          <IconUploadSection
            iconFile={formData.iconFile}
            iconUrl={formData.iconUrl}
            isUploading={isIconUploading}
            uploadError={iconUploadError}
            onIconSelect={onIconSelect}
            onIconDelete={onIconDelete}
            onUploadToSupabase={onIconUpload}
          />
          <ResourcePreview 
            formData={formData}
            formatFileSize={formatFileSize}
          />
        </div>
      </div>

      {/* バリデーション警告 */}
      {(!formData.title || !formData.description) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800 text-sm">
              <strong>注意:</strong> 必須項目（*）をすべて入力してください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceEditForm;