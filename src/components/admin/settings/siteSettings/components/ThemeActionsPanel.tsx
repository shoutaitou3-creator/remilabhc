import React from 'react';
import { ThemeColors } from '../../../../../types/theme';
import DetailedAdjustments from './DetailedAdjustments';
import ColorSettingsActions from './ColorSettingsActions';
import ColorSettingsNotice from './ColorSettingsNotice';

interface ThemeActionsPanelProps {
  currentColors: ThemeColors;
  hasUnsavedChanges: boolean;
  animationDuration: number;
  onColorChange: (colorKey: keyof ThemeColors, value: string) => void;
  onAnimationDurationChange: (duration: number) => void;
  onResetToDefault: () => void;
  onResetChanges: () => void;
  onSavePreview: () => void;
  onApplyToProduction: () => void;
}

const ThemeActionsPanel: React.FC<ThemeActionsPanelProps> = ({
  currentColors,
  hasUnsavedChanges,
  animationDuration,
  onColorChange,
  onAnimationDurationChange,
  onResetToDefault,
  onResetChanges,
  onSavePreview,
  onApplyToProduction
}) => {
  return (
    <div className="space-y-6">
      <DetailedAdjustments
        currentColors={currentColors}
        animationDuration={animationDuration}
        onColorChange={onColorChange}
        onAnimationDurationChange={onAnimationDurationChange}
        onResetToDefault={onResetToDefault}
      />

      <ColorSettingsActions
        hasUnsavedChanges={hasUnsavedChanges}
        onResetChanges={onResetChanges}
        onSavePreview={onSavePreview}
        onApplyToProduction={onApplyToProduction}
      />

      <ColorSettingsNotice />
    </div>
  );
};

export default ThemeActionsPanel;