import React from 'react';
import { ColorCategory, ThemeColors } from '../../../../../types/theme';
import ColorPicker from './ColorPicker';
import PresetColorPalette from './PresetColorPalette';

interface CustomColorSettingsProps {
  categories: ColorCategory[];
  selectedColorCategory: string;
  currentColors: ThemeColors;
  presetColors: string[];
  onCategorySelect: (categoryId: string) => void;
  onColorChange: (colorKey: keyof ThemeColors, value: string) => void;
}

const CustomColorSettings: React.FC<CustomColorSettingsProps> = ({
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
        {/* カテゴリ選択サイドバー */}
        <div className="lg:w-64 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">カラーカテゴリ</h4>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors text-sm min-h-[44px] ${
                    selectedColorCategory === category.id
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

        {/* カラー設定エリア */}
        <div className="flex-1 p-6">
          {currentCategory && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{currentCategory.label}</h4>
                <p className="text-sm text-gray-600 mb-6">{currentCategory.description}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {currentCategory.colors.map((colorKey) => (
                  <ColorPicker
                    key={colorKey}
                    colorKey={colorKey}
                    currentColors={currentColors}
                    onColorChange={onColorChange}
                  />
                ))}
              </div>
              
              {/* カスタム変更の説明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <h6 className="text-sm font-medium text-blue-800 mb-1">カスタム変更について</h6>
                <p className="text-xs text-blue-700">
                  色を変更すると即座にプレビューに反映されます。
                  変更内容は画面下部のボタンで保存してください。
                </p>
              </div>

              <PresetColorPalette
                presetColors={presetColors}
                currentCategory={currentCategory}
                onColorSelect={onColorChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomColorSettings;