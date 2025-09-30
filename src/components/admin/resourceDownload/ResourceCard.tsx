import React from 'react';
import { Eye, Edit, FileText } from 'lucide-react';
import { Resource } from '../../../types/resourceDownload';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onEdit }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-[100px] h-[100px] bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {resource.icon_url ? (
              <img 
                src={resource.icon_url} 
                alt="カスタムアイコン"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <FileText className="w-20 h-20 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-1">{resource.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>ファイル: {resource.file_name}</span>
              <span>サイズ: {formatFileSize(resource.file_size)}</span>
              <span>DL数: {resource.download_count}回</span>
              {resource.icon_url && (
                <span className="text-blue-600">カスタムアイコン</span>
              )}
              <span className={`px-2 py-1 rounded ${
                resource.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {resource.is_published ? '有効' : '無効'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onEdit(resource)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>編集</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;