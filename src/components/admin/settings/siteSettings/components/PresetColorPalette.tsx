import React from 'react';
import { ThemeColors, ColorCategory } from '../../../../../types/theme';

interface PresetColorPaletteProps {
  presetColors: string[];
  currentCategory: ColorCategory | undefined;
  onColorSelect: (colorKey: keyof ThemeColors, color: string) => void;
}

const PresetColorPalette: React.FC<PresetColorPaletteProps> = ({
  presetColors,
  currentCategory,
  onColorSelect
}) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h5 className="text-sm font-medium text-gray-700 mb-3">よく使われる色</h5>
      <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
        {presetColors.map((color, index) => (
          <button
            key={index}
            className="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform shadow-sm"
            style={{ backgroundColor: color }}
            onClick={() => {
              if (currentCategory && currentCategory.colors.length > 0) {
                onColorSelect(currentCategory.colors[0] as keyof ThemeColors, color);
              }
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default PresetColorPalette;