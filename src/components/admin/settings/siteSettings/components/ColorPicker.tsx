import React from 'react';
import { ThemeColors } from '../../../../../types/theme';
import { getColorLabel, getColorUsageExample } from '../../../../../utils/colorHelpers';

interface ColorPickerProps {
  colorKey: string;
  currentColors: ThemeColors;
  onColorChange: (colorKey: keyof ThemeColors, value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colorKey,
  currentColors,
  onColorChange
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {getColorLabel(colorKey)}
      </label>
      
      {/* カラーピッカーとプレビュー */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="color"
            value={currentColors[colorKey as keyof ThemeColors]}
            onChange={(e) => onColorChange(colorKey as keyof ThemeColors, e.target.value)}
            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer hover:border-purple-400 transition-colors"
            title={`${getColorLabel(colorKey)}の色を選択`}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={currentColors[colorKey as keyof ThemeColors]}
            onChange={(e) => onColorChange(colorKey as keyof ThemeColors, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono hover:border-purple-400 transition-colors"
            placeholder="#000000"
            title="HEXカラーコードを直接入力"
          />
        </div>
      </div>

      {/* 使用例の説明 */}
      <div className="text-xs text-gray-500 flex items-center min-h-[32px]">
        {getColorUsageExample(colorKey)}
      </div>
    </div>
  );
};

export default ColorPicker;