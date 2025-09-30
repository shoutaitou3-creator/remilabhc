import React from 'react';
import { Upload, CheckCircle, X } from 'lucide-react';

interface UploadProgressDialogProps {
  isOpen: boolean;
  progress: number;
  fileName: string;
}

const UploadProgressDialog: React.FC<UploadProgressDialogProps> = ({
  isOpen,
  progress,
  fileName
}) => {
  if (!isOpen) return null;

  const isCompleted = progress >= 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          {/* アイコン */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {isCompleted ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>

          {/* タイトル */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isCompleted ? 'アップロード完了' : 'ファイルアップロード中'}
          </h3>

          {/* ファイル名 */}
          <p className="text-sm text-gray-600 mb-4 break-words">
            {fileName}
          </p>

          {/* 進捗バー */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* 進捗テキスト */}
          <p className="text-sm text-gray-600 mb-4">
            {isCompleted ? (
              '✅ アップロードが完了しました'
            ) : (
              `${progress}% 完了`
            )}
          </p>

          {/* 完了時のメッセージ */}
          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                資料が正常にアップロードされ、保存されました。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProgressDialog;