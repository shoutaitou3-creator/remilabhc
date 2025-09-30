import React from 'react';
import { ThemeColors, PreviewDevice } from '../../../../../types/theme';
import LivePreview from './LivePreview';

interface ThemePreviewSectionProps {
  currentColors: ThemeColors;
  previewDevice: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
}

const ThemePreviewSection: React.FC<ThemePreviewSectionProps> = ({
  currentColors,
  previewDevice,
  onDeviceChange
}) => {
  return (
    <div className="space-y-6">
      <LivePreview
        currentColors={currentColors}
        previewDevice={previewDevice}
        onDeviceChange={onDeviceChange}
      />
      
      {/* プレビューの説明 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">プレビューについて</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• 変更内容はリアルタイムでプレビューに反映されます</li>
          <li>• デバイス切り替えで異なる画面サイズでの表示を確認できます</li>
          <li>• プレビューは実際のサイトの簡略版です</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemePreviewSection;