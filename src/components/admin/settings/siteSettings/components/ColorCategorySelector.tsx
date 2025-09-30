import React from 'react';
import { ColorCategory } from '../../../../../types/theme';

interface ColorCategorySelectorProps {
  categories: ColorCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const ColorCategorySelector: React.FC<ColorCategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="lg:w-64 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">カラーカテゴリ</h4>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-colors text-sm min-h-[44px] ${
                selectedCategory === category.id
                  ? 'bg-purple-100 text-purple-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{category.label}</div>
              <div className="text-xs text-gray-500 mt-1">{category.description}</div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ColorCategorySelector;