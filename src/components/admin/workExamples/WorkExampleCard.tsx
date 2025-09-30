import React from 'react';
import { Edit, ChevronUp, ChevronDown, Image } from 'lucide-react';

interface WorkExample {
  id: string;
  title: string;
  description: string;
  image: string;
  department: 'creative' | 'reality';
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface WorkExampleCardProps {
  work: WorkExample;
  index: number;
  totalWorkExamples: number;
  onEdit: (work: WorkExample) => void;
  onMoveUp: (workId: string) => void;
  onMoveDown: (workId: string) => void;
}

const WorkExampleCard: React.FC<WorkExampleCardProps> = ({
  work,
  index,
  totalWorkExamples,
  onEdit,
  onMoveUp,
  onMoveDown
}) => {
  const getDepartmentLabel = (department: string) => {
    switch (department) {
      case 'creative':
        return 'クリエイティブ';
      case 'reality':
        return 'リアリティー';
      default:
        return department;
    }
  };

  // 公開状態に応じたスタイリングクラスを取得
  const getCardStyling = () => {
    if (!work.is_published) {
      return {
        container: 'bg-gray-100 border-gray-300 opacity-75',
        content: 'text-gray-600',
        title: 'text-gray-700',
        meta: 'text-gray-500',
        hover: 'hover:bg-gray-200 hover:shadow-md'
      };
    }
    return {
      container: 'bg-white border-gray-200',
      content: 'text-gray-600',
      title: 'text-gray-900',
      meta: 'text-gray-500',
      hover: 'hover:shadow-lg'
    };
  };

  const styling = getCardStyling();
  return (
    <div className={`p-4 sm:p-6 transition-all duration-300 ${styling.container} ${styling.hover}`}>
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
          <div className="hidden sm:flex flex-col space-y-1">
            <button
              onClick={() => onMoveUp(work.id)}
              disabled={index === 0}
              className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                work.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
              }`}
              title="上に移動"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onMoveDown(work.id)}
              disabled={index === totalWorkExamples - 1}
              className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                work.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
              }`}
              title="下に移動"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {work.image ? (
            <img
              src={work.image}
              alt={work.title}
              className={`w-20 h-20 object-cover rounded-lg border transition-all duration-300 ${
                work.is_published 
                  ? 'border-gray-200' 
                  : 'border-gray-300 opacity-60'
              }`}
            />
          ) : (
            <div className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center ${
              work.is_published 
                ? 'border-gray-300 bg-gray-50' 
                : 'border-gray-400 bg-gray-200'
            }`}>
              <Image className={`w-8 h-8 ${work.is_published ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          )}
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                #{work.display_order}
              </span>
              <span className={`text-xs px-2 py-1 rounded font-medium border transition-all duration-300 ${
                work.is_published 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}>
                {work.is_published ? '✓ 公開中' : '✕ 非公開'}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                work.is_published 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {getDepartmentLabel(work.department)}
              </span>
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${styling.title}`}>
              {work.title}
            </h3>
            <p className={`text-sm leading-relaxed line-clamp-3 mb-3 transition-colors duration-300 ${styling.content}`}>
              {work.description.length > 150 
                ? work.description.substring(0, 150) + '...' 
                : work.description
              }
            </p>
            <div className={`text-xs transition-colors duration-300 ${styling.meta}`}>
              更新: {new Date(work.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => onMoveUp(work.id)}
              disabled={index === 0}
              className={`flex items-center justify-center w-10 h-10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                work.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
              }`}
              title="上に移動"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onMoveDown(work.id)}
              disabled={index === totalWorkExamples - 1}
              className={`flex items-center justify-center w-10 h-10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                work.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
              }`}
              title="下に移動"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <button
            onClick={() => onEdit(work)}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-all duration-300 text-sm min-h-[44px] ${
              work.is_published 
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105' 
                : 'bg-gray-500 hover:bg-gray-600 hover:shadow-md'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>編集</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkExampleCard;