import React from 'react';
import { FileText } from 'lucide-react';
import { ResourceFormData } from '../../../types/resourceDownload';

interface ResourcePreviewProps {
  formData: ResourceFormData;
  formatFileSize: (bytes: number) => string;
}

const ResourcePreview: React.FC<ResourcePreviewProps> = ({ formData, formatFileSize }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h5 className="text-sm font-medium text-blue-800 mb-3">表示プレビュー</h5>
      <div className="bg-white p-4 rounded border">
        <div className="flex items-center space-x-3 mb-2">
          {formData.iconUrl ? (
            <img
              src={formData.iconUrl}
              alt="カスタムアイコン"
              className="w-5 h-5 object-contain"
            />
          ) : (
            <FileText className="w-5 h-5 text-blue-600" />
          )}
          <h6 className="font-bold text-gray-900">{formData.title}</h6>
        </div>
        <p className="text-sm text-gray-600 mb-2">{formData.description}</p>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          {formData.uploadedFile && (
            <>
              <span>ファイル: {formData.uploadedFile.name}</span>
              <span>サイズ: {formatFileSize(formData.uploadedFile.size)}</span>
            </>
          )}
          {formData.iconUrl && (
            <span className="text-blue-600">カスタムアイコン</span>
          )}
          <span className={`px-2 py-1 rounded ${
            formData.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {formData.is_published ? '有効' : '無効'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreview;