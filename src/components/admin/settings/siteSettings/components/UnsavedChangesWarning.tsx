import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
}

const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({ hasUnsavedChanges }) => {
  if (!hasUnsavedChanges) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-amber-800">未保存の変更があります</h4>
          <p className="text-xs text-amber-700 mt-1">
            変更内容はプレビューに反映されていますが、まだ保存されていません。
            画面下部のボタンで保存してください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesWarning;