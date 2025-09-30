import React from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadSectionProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputId?: string;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ 
  onFileSelect, 
  inputId = 'file-upload' 
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        ファイルアップロード
      </label>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-4">
            ファイルをドラッグ&ドロップまたはクリックして選択
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileSelect}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>ファイル選択</span>
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-800 mb-2">ファイル要件</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 対応形式: PDF, JPG, PNG</li>
            <li>• 最大サイズ: 50MB</li>
            <li>• 推奨サイズ: 30MB以下</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;