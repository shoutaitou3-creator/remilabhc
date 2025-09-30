import React from 'react';
import { Palette, Check } from 'lucide-react';
import { PresetTheme } from '../../../../../types/theme';

interface PresetThemeSelectorProps {
  presetThemes: PresetTheme[];
  selectedPreset: string | null;
  onPresetSelect: (preset: PresetTheme) => void;
}

const PresetThemeSelector: React.FC<PresetThemeSelectorProps> = ({
  presetThemes,
  selectedPreset,
  onPresetSelect
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Palette className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">プリセットテーマ</h3>
          <p className="text-sm text-gray-600">事前に用意されたテーマから選択（クリックでプレビュー）</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {presetThemes.map((theme) => (
          <div
            key={theme.id}
            className={`bg-white p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer group relative ${
              selectedPreset === theme.id 
                ? 'border-purple-500 shadow-lg ring-2 ring-purple-200' 
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
            }`}
            onClick={() => onPresetSelect(theme)}
          >
            {/* 選択インジケーター */}
            {selectedPreset === theme.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="flex space-x-2 mb-3">
              <div 
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: theme.colors.primary }}
              ></div>
              <div 
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: theme.colors.secondary }}
              ></div>
              <div 
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: theme.colors.bgSecondary }}
              ></div>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{theme.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{theme.description}</p>
            
            <div className={`w-full py-2 px-3 rounded text-xs font-medium transition-all duration-200 text-center ${
              selectedPreset === theme.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 group-hover:bg-purple-100 text-gray-700 group-hover:text-purple-700'
            }`}>
              {selectedPreset === theme.id ? '選択中' : 'プレビュー'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresetThemeSelector;