import React from 'react';
import { PresetTheme } from '../../../../../types/theme';
import PresetThemeSelector from './PresetThemeSelector';

interface ThemeSelectionPanelProps {
  presetThemes: PresetTheme[];
  selectedPreset: string | null;
  onPresetSelect: (preset: PresetTheme) => void;
}

const ThemeSelectionPanel: React.FC<ThemeSelectionPanelProps> = ({
  presetThemes,
  selectedPreset,
  onPresetSelect
}) => {
  return (
    <div className="space-y-6">
      <PresetThemeSelector
        presetThemes={presetThemes}
        selectedPreset={selectedPreset}
        onPresetSelect={onPresetSelect}
      />
      
      {/* プリセットテーマの説明 */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-purple-800 mb-2">プリセットテーマについて</h4>
        <ul className="text-xs text-purple-700 space-y-1">
          <li>• クリックするとプレビューが即座に更新されます</li>
          <li>• プリセット選択後も個別の色調整が可能です</li>
          <li>• カスタム調整を行うとプリセット選択は解除されます</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeSelectionPanel;