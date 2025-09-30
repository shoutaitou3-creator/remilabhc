import React from 'react';
import { User } from 'lucide-react';

interface EmptyJudgesStateProps {
  onAddJudge: () => void;
}

const EmptyJudgesState: React.FC<EmptyJudgesStateProps> = ({ onAddJudge }) => {
  return (
    <div className="text-center py-12">
      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">審査員が登録されていません</h3>
      <p className="text-gray-600 mb-6">新しい審査員を追加してください。</p>
      <button
        onClick={onAddJudge}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
      >
        最初の審査員を追加
      </button>
    </div>
  );
};

export default EmptyJudgesState;