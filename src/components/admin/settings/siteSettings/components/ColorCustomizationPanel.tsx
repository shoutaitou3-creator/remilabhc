import React from 'react';
import { ColorCategory, ThemeColors } from '../../../../../types/theme';
import ColorCategorySelector from './ColorCategorySelector';
import ColorCategoryEditor from './ColorCategoryEditor';

interface ColorCustomizationPanelProps {
  categories: ColorCategory[];
  selectedColorCategory: string;
  currentColors: ThemeColors;
  presetColors: string[];
  onCategorySelect: (categoryId: string) => void;
  onColorChange: (colorKey: keyof ThemeColors, value: string) => void;
}

const ColorCustomizationPanel: React.FC<ColorCustomizationPanelProps> = ({
  categories,
  selectedColorCategory,
  currentColors,
  presetColors,
  onCategorySelect,
  onColorChange
}) => {
  const currentCategory = categories.find(cat => cat.id === selectedColorCategory);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">カスタムカラー設定</h3>
        <p className="text-sm text-gray-600">個別に色を調整してオリジナルテーマを作成</p>
      </div>

      <div className="flex flex-col lg:flex-row">
        <ColorCategorySelector
          categories={categories}
          selectedCategory={selectedColorCategory}
          onCategorySelect={onCategorySelect}
        />
        
        <ColorCategoryEditor
          currentCategory={currentCategory}
          currentColors={currentColors}
          presetColors={presetColors}
          onColorChange={onColorChange}
        />
      </div>
    </div>
  );
};

export default ColorCustomizationPanel;