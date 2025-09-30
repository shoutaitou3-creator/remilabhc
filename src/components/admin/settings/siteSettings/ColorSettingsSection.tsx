import React, { useState } from 'react';
import { SiteSettings } from '../../../../hooks/useSiteSettings';
import { ThemeColors, PreviewDevice } from '../../../../types/theme';
import { presetThemes, defaultColors, presetColors } from '../../../../constants/themePresets';
import { colorCategories } from '../../../../constants/colorCategories';
import { showToastNotification } from '../../../../utils/colorHelpers';
import UnsavedChangesWarning from './components/UnsavedChangesWarning';
import ThemeSelectionPanel from './components/ThemeSelectionPanel';
import ThemePreviewSection from './components/ThemePreviewSection';
import ColorCustomizationPanel from './components/ColorCustomizationPanel';
import ThemeActionsPanel from './components/ThemeActionsPanel';

interface ColorSettingsSectionProps {
  formData: SiteSettings;
  onInputChange: (field: keyof SiteSettings, value: string | boolean) => void;
}

const ColorSettingsSection: React.FC<ColorSettingsSectionProps> = ({
  formData,
  onInputChange
}) => {
  const [selectedColorCategory, setSelectedColorCategory] = useState('primary');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [selectedPreset, setSelectedPreset] = useState<string | null>('default');
  const [currentColors, setCurrentColors] = useState<ThemeColors>(defaultColors);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(formData.animation_duration);

  // プリセット選択ハンドラ（プレビューのみ、保存しない）
  const handlePresetSelect = (preset: typeof presetThemes[0]) => {
    setSelectedPreset(preset.id);
    setCurrentColors(preset.colors);
    setHasUnsavedChanges(true);
  };

  // 個別カラー変更ハンドラ（プレビューのみ、保存しない）
  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setCurrentColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
    setHasUnsavedChanges(true);
    setSelectedPreset(null); // カスタム変更時はプリセット選択を解除
  };

  // アニメーション時間変更ハンドラ
  const handleAnimationDurationChange = (duration: number) => {
    setAnimationDuration(duration);
    setHasUnsavedChanges(true);
    setSelectedPreset(null);
  };

  // デフォルトに戻す
  const handleResetToDefault = () => {
    if (confirm('デフォルトテーマに戻しますか？未保存の変更は失われます。')) {
      const defaultTheme = presetThemes.find(t => t.id === 'default');
      if (defaultTheme) {
        setCurrentColors(defaultTheme.colors);
        setSelectedPreset('default');
        setHasUnsavedChanges(true);
      }
    }
  };

  // プレビューのみ保存（一時保存）
  const handleSavePreview = () => {
    localStorage.setItem('remila_theme_preview', JSON.stringify(currentColors));
    localStorage.setItem('remila_animation_duration_preview', animationDuration.toString());
    console.log('プレビュー設定を一時保存:', currentColors);
    console.log('アニメーション時間を一時保存:', animationDuration);
    setHasUnsavedChanges(false);
    showToastNotification('プレビュー設定を保存しました');
  };

  // 本番環境に適用（実際の保存）
  const handleApplyToProduction = () => {
    if (confirm('この設定を本番環境に適用しますか？サイトの見た目が変更されます。')) {
      console.log('本番環境に適用:', currentColors);
      console.log('アニメーション時間を本番適用:', animationDuration);
      // 実際の保存処理でformDataも更新
      onInputChange('animation_duration', animationDuration);
      setHasUnsavedChanges(false);
      showToastNotification('本番環境に適用しました');
    }
  };

  // 変更をリセット
  const handleResetChanges = () => {
    if (confirm('変更内容をリセットしますか？')) {
      const defaultTheme = presetThemes.find(t => t.id === 'default');
      if (defaultTheme) {
        setCurrentColors(defaultTheme.colors);
        setSelectedPreset('default');
        setHasUnsavedChanges(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />

      <ThemeSelectionPanel
        presetThemes={presetThemes}
        selectedPreset={selectedPreset}
        onPresetSelect={handlePresetSelect}
      />

      <ThemePreviewSection
        currentColors={currentColors}
        previewDevice={previewDevice}
        onDeviceChange={setPreviewDevice}
      />

      <ColorCustomizationPanel
        categories={colorCategories}
        selectedColorCategory={selectedColorCategory}
        currentColors={currentColors}
        presetColors={presetColors}
        onCategorySelect={setSelectedColorCategory}
        onColorChange={handleColorChange}
      />

      <ThemeActionsPanel
        currentColors={currentColors}
        hasUnsavedChanges={hasUnsavedChanges}
        animationDuration={animationDuration}
        onColorChange={handleColorChange}
        onAnimationDurationChange={handleAnimationDurationChange}
        onResetToDefault={handleResetToDefault}
        onResetChanges={handleResetChanges}
        onSavePreview={handleSavePreview}
        onApplyToProduction={handleApplyToProduction}
      />
    </div>
  );
};

export default ColorSettingsSection;