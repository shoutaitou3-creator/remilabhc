import React from 'react';
import { FileText } from 'lucide-react';

interface SharedEmptyResourcesStateProps {
  customTheme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
  };
}

const SharedEmptyResourcesState: React.FC<SharedEmptyResourcesStateProps> = ({
  customTheme
}) => {
  const themeStyles = {
    color: customTheme?.colors?.text || '#1f2937'
  };

  return (
    <div className="text-center py-12" style={themeStyles}>
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        現在ダウンロード可能な資料はありません
      </h3>
      <p className="text-gray-600">
        資料が追加されるまでお待ちください。
      </p>
    </div>
  );
};

export default SharedEmptyResourcesState;