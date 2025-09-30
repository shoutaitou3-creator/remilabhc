import React from 'react';
import { ColorCategory, ThemeColors } from '../../../../../types/theme';
import ColorPicker from './ColorPicker';
import PresetColorPalette from './PresetColorPalette';

interface ColorCategoryEditorProps {
  currentCategory: ColorCategory | undefined;
  currentColors: ThemeColors;
  presetColors: string[];
  onColorChange: (colorKey: keyof ThemeColors, value: string) => void;
}

const ColorCategoryEditor: React.FC<ColorCategoryEditorProps> = ({
  currentCategory,
  currentColors,
  presetColors,
  onColorChange
}) => {
  if (!currentCategory) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-gray-500">カテゴリを選択してください</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
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
    </div>
  );
};

export default ColorCategoryEditor;