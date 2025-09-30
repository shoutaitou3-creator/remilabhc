import React from 'react';
import { FileText } from 'lucide-react';

const EmptyResourcesState: React.FC = () => {
  return (
    <div className="text-center py-12">
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

export default EmptyResourcesState;