import React from 'react';

const ColorSettingsNotice: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-yellow-800 mb-2">色設定に関する注意事項</h4>
      <ul className="text-xs text-yellow-700 space-y-1">
        <li>• プリセットテーマをクリックすると、即座にプレビューに反映されます</li>
        <li>• 個別の色調整も可能で、リアルタイムでプレビューが更新されます</li>
        <li>• アクセシビリティを考慮し、十分なコントラスト比を保ってください</li>
        <li>• 「プレビューのみ保存」で一時保存、「本番環境に適用」で実際に反映されます</li>
        <li>• ブランドガイドラインがある場合は、それに準拠した色を選択してください</li>
      </ul>
    </div>
  );
};

export default ColorSettingsNotice;