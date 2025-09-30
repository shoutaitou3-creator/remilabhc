import React from 'react';
import { X, Plus, Save, AlertCircle, FileText } from 'lucide-react';
import { ResourceFormData } from '../../../types/resourceDownload';
import FileUploadSection from './FileUploadSection';
import IconUploadSection from './IconUploadSection';
import PublishStatusSection from './PublishStatusSection';

interface AddResourceModalProps {
  isOpen: boolean;
  formData: ResourceFormData;
  onClose: () => void;
  onSave: () => void;
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

const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  formData,
  onClose,
  onSave,
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">新しい資料を追加</h2>
              <p className="text-sm text-gray-600">ダウンロード可能な資料を追加します</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
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
              <FileUploadSection onFileSelect={onFileSelect} />
              <PublishStatusSection 
                isActive={formData.is_published}
                onToggle={() => onInputChange('is_published', !formData.is_published)}
              />
            </div>

            {/* 右側：アイコン設定・プレビュー */}
            <div className="space-y-6">
              <FileUploadSection 
                onFileSelect={onFileSelect}
                inputId="add-file-upload"
              />
              <IconUploadSection
                iconFile={formData.iconFile}
                iconUrl={formData.iconUrl}
                isUploading={isIconUploading}
                uploadError={iconUploadError}
                onIconSelect={onIconSelect}
                onIconDelete={onIconDelete}
                onUploadToSupabase={onIconUpload}
              />
            </div>
          </div>

          {/* バリデーション警告 */}
          {(!formData.title || !formData.description) && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800 text-sm">
                  <strong>注意:</strong> 必須項目（*）をすべて入力してください。
                </p>
              </div>
            </div>
          )}

          {/* フォームアクション */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={onSave}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              <span>資料を追加</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddResourceModal;