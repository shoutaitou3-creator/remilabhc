import React from 'react';

interface PublishStatusSectionProps {
  isActive: boolean;
  onToggle: () => void;
}

const PublishStatusSection: React.FC<PublishStatusSectionProps> = ({ isActive, onToggle }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        公開状態
      </label>
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? '有効' : '無効'}
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
            isActive
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isActive ? '無効にする' : '有効にする'}
        </button>
      </div>
    </div>
  );
};

export default PublishStatusSection;