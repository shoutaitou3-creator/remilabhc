import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ThemeColors } from '../../../../../types/theme';

interface DetailedAdjustmentsProps {
  currentColors: ThemeColors;
  animationDuration: number;
  onColorChange: (colorKey: keyof ThemeColors, value: string) => void;
  onAnimationDurationChange: (duration: number) => void;
  onResetToDefault: () => void;
}

const DetailedAdjustments: React.FC<DetailedAdjustmentsProps> = ({
  currentColors,
  animationDuration,
  onColorChange,
  onAnimationDurationChange,
  onResetToDefault
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">詳細調整</h3>
          <p className="text-sm text-gray-600">グラデーション、透明度、アニメーション設定</p>
        </div>
        <button
          onClick={onResetToDefault}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>デフォルトに戻す</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* グラデーション設定 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">グラデーション設定</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-2">ヒーローグラデーション開始色</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={currentColors.bgSecondary}
                  onChange={(e) => onColorChange('bgSecondary', e.target.value)}
                  className="w-10 h-10 rounded border" 
                />
                <input 
                  type="text" 
                  value={currentColors.bgSecondary}
                  onChange={(e) => onColorChange('bgSecondary', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm font-mono" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">ヒーローグラデーション終了色</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={currentColors.bgAccent}
                  onChange={(e) => onColorChange('bgAccent', e.target.value)}
                  className="w-10 h-10 rounded border" 
                />
                <input 
                  type="text" 
                  value={currentColors.bgAccent}
                  onChange={(e) => onColorChange('bgAccent', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm font-mono" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* 透明度設定 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">透明度・影設定</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-2">カード影の透明度</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="10"
                className="w-full min-h-[44px]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>透明</span>
                <span>濃い</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">オーバーレイ透明度</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="30"
                className="w-full min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* アニメーション設定 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">アニメーション設定</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-2">アニメーション時間（ミリ秒）</label>
              <input
                type="number"
                min="100"
                max="2000"
                step="50"
                value={currentColors.animationDuration || 560}
                onChange={(e) => onAnimationDurationChange(parseInt(e.target.value) || 560)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[44px]"
                placeholder="560"
              />
              <div className="text-xs text-gray-500 mt-1">
                推奨範囲: 100-2000ms（デフォルト: 560ms）
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">ホバーエフェクト強度</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[44px]">
                <option value="subtle">控えめ</option>
                <option value="normal">標準</option>
                <option value="strong">強め</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">トランジション速度</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[44px]">
                <option value="fast">高速 (200ms)</option>
                <option value="normal">標準 (300ms)</option>
                <option value="slow">低速 (500ms)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAdjustments;